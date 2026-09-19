"""
Notification service: Email + GreenWeb SMS.
"""
import logging
import requests
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from apps.core.models import SiteSettings

logger = logging.getLogger(__name__)


def send_confirmation_email(registration):
    """Send HTML confirmation email with official receipt and pass link to participant."""
    site = SiteSettings.get()
    if not site.email_confirmation_enabled:
        return False
    try:
        participant = registration.participant
        reg_events = list(registration.registration_events.select_related('event'))
        frontend_base = getattr(settings, 'FRONTEND_URL', 'https://jtc.sjis.edu.bd').rstrip('/')
        pass_url = f"{frontend_base}/verify?code={registration.short_code}"
        receipt_url = f"{frontend_base}/register/success?code={registration.confirmation_code}"
        is_paid = registration.payment_status == 'VERIFIED' or registration.total_fee == 0

        subject = (
            f"Payment Verified & Entry Pass — {site.carnival_name} | {registration.short_code}"
            if is_paid else
            f"Registration Received (Payment: {registration.get_payment_status_display()}) — {site.carnival_name} | {registration.short_code}"
        )

        html_message = render_to_string('emails/registration_confirmation.html', {
            'registration': registration,
            'participant': participant,
            'reg_events': reg_events,
            'site': site,
            'pass_url': pass_url,
            'receipt_url': receipt_url,
            'is_paid': is_paid,
        })
        bundle_section = ""
        if registration.is_bundle:
            bundle_section = (
                "--------------------------------------------------\n"
                "✨ 5-IN-1 TECH FESTIVAL BUNDLE ENROLLED!\n"
                "Fee: ৳1,000 BDT (Regular Value: ৳1,400 — Saved: ৳400)\n"
                "⚽ BONUS PERK: 1 Complimentary Free Round of FC in the Game Zone!\n"
                "Remember to claim your free FC round at the Game Zone desk on festival day.\n"
                "--------------------------------------------------\n\n"
            )

        plain_message = (
            f"Hi {participant.name},\n\n"
            f"Your registration for {site.carnival_name} has been received!\n\n"
            f"{bundle_section}"
            f"Pass Code: {registration.short_code}\n"
            f"Payment Status: {registration.get_payment_status_display().upper()}\n"
            f"Total Registration Fee: ৳{registration.total_fee} BDT\n"
            f"Payment Method: {registration.payment_method}\n"
            f"{'Transaction Ref: ' + registration.payment_reference if registration.payment_reference else ''}\n\n"
            f"Authorized Events:\n"
            + "\n".join(f" - {re.event.name}: ৳{re.fee_charged} BDT" for re in reg_events) + "\n\n"
            f"View & Download Official Entry Pass: {pass_url}\n"
            f"View Official Payment Receipt: {receipt_url}\n\n"
            f"Venue: {site.venue}\n"
            f"Contact: {site.contact_email} | {site.contact_phone}\n\n"
            f"Josephite Tech Club\nSt. Joseph International School"
        )
        send_mail(
            subject=subject,
            message=plain_message,
            html_message=html_message,
            from_email=f'{site.email_from_name} <{settings.EMAIL_HOST_USER}>',
            recipient_list=[participant.email],
            fail_silently=False,
        )
        registration.email_sent = True
        registration.save(update_fields=['email_sent'])
        return True
    except Exception as e:
        logger.error(f'Email send failed for {registration.short_code}: {e}')
        return False


def send_confirmation_sms(registration):
    """Send SMS via GreenWeb SMS API."""
    site = SiteSettings.get()
    sms_enabled = site.sms_enabled or settings.GREENWEB_SMS_ENABLED
    sms_user = site.sms_user or settings.GREENWEB_SMS_USER
    sms_pass = site.sms_pass or settings.GREENWEB_SMS_PASS
    sms_from = site.sms_from or settings.GREENWEB_SMS_FROM

    if not sms_enabled or not sms_user:
        return False

    participant = registration.participant
    phone = participant.phone.replace('+880', '0').replace(' ', '').replace('-', '')
    if not phone.startswith('0'):
        phone = '0' + phone

    first_name = participant.name.split()[0][:14] if participant.name else 'Student'
    frontend_base = getattr(settings, 'FRONTEND_URL', 'https://jtc.sjis.edu.bd').rstrip('/')
    pass_url = f"{frontend_base}/verify?code={registration.short_code}"

    if registration.payment_status == 'VERIFIED' or registration.total_fee == 0:
        message = (
            f"JTC SJIS: Hi {first_name}, registration & payment verified! "
            f"Code: {registration.short_code}. Pass: {pass_url}"
        )
    else:
        message = (
            f"JTC SJIS: Hi {first_name}, reg received ({registration.short_code}). "
            f"Payment: {registration.get_payment_status_display().upper()}. Verify: {pass_url}"
        )

    try:
        resp = requests.get(
            'https://api.greenweb.com.bd/api.php',
            params={
                'token': sms_user,
                'to': phone,
                'message': message,
            },
            timeout=10
        )
        if resp.status_code == 200:
            registration.sms_sent = True
            registration.save(update_fields=['sms_sent'])
            return True
    except Exception as e:
        logger.error(f'SMS send failed for {registration.short_code}: {e}')
    return False


def send_pending_reminder_email(registration, force=False):
    """
    Send daily reminder email to participant whose registration is PENDING in cart.
    Enforces a strict 24-hour interval per registration (unless force=True).
    Updates last_reminder_sent_at, increments reminder_count, and logs in admin_notes.
    Returns: (success: bool, message: str)
    """
    from datetime import timedelta
    from django.utils import timezone

    site = SiteSettings.get()
    if not site.email_reminder_enabled and not force:
        return False, "Cart reminder emails are currently disabled in Site Settings."

    if registration.payment_status != 'PENDING':
        return False, f"Registration is currently {registration.get_payment_status_display()}, not PENDING."

    if registration.total_fee <= 0:
        return False, "Registration fee is 0 BDT (no payment required)."

    participant = registration.participant
    if not participant or not participant.email:
        return False, "Participant email is missing."

    # Enforce 1 email per day (minimum 23 hours to account for cron scheduling variances)
    now = timezone.now()
    if not force and registration.last_reminder_sent_at:
        time_since_last = now - registration.last_reminder_sent_at
        if time_since_last < timedelta(hours=23):
            hours_elapsed = round(time_since_last.total_seconds() / 3600, 1)
            return False, f"Reminder already sent today ({hours_elapsed}h ago). Daily limit is 1 email/day."

    try:
        reg_events = list(registration.registration_events.select_related('event'))
        frontend_base = getattr(settings, 'FRONTEND_URL', 'https://jtc.sjis.edu.bd').rstrip('/')
        checkout_url = f"{frontend_base}/register/success?code={registration.confirmation_code}"

        if registration.is_bundle:
            events_summary = "5-in-1 Tech Festival Bundle"
        elif len(reg_events) == 1:
            events_summary = reg_events[0].event.name
        elif len(reg_events) <= 3:
            events_summary = ", ".join([re.event.name for re in reg_events])
        else:
            events_summary = f"{reg_events[0].event.name} and {len(reg_events) - 1} other arena(s)"

        reminder_num = registration.reminder_count + 1

        if reminder_num == 1:
            subject = f"⚡ Complete Your Registration for {events_summary} — {site.carnival_name} | {registration.short_code}"
        else:
            subject = f"⏳ Reminder #{reminder_num}: Your Registration for {events_summary} is Pending on Cart | {registration.short_code}"

        html_message = render_to_string('emails/cart_reminder.html', {
            'registration': registration,
            'participant': participant,
            'reg_events': reg_events,
            'events_summary': events_summary,
            'site': site,
            'checkout_url': checkout_url,
        })

        events_plain = "\n".join(
            f"  - {re.event.name}: ৳{re.fee_charged} BDT" + (f" (Team: {re.team_name})" if re.is_team else "")
            for re in reg_events
        )

        bundle_note = ""
        if registration.is_bundle:
            bundle_note = (
                "--------------------------------------------------\n"
                "✨ 5-IN-1 FESTIVAL ALL-ACCESS BUNDLE ENROLLED!\n"
                "⚽ BONUS PERK: 1 Complimentary Free FC Game Zone Round!\n"
                "--------------------------------------------------\n\n"
            )

        plain_message = (
            f"Hi {participant.name},\n\n"
            f"The stage is set and excitement is building for {site.carnival_name}!\n\n"
            f"We noticed that your competition registration for {events_summary} is currently waiting in your cart.\n\n"
            f"{bundle_note}"
            f"Registration Reference: {registration.short_code}\n"
            f"Selected Competitions:\n{events_plain}\n\n"
            f"Total Investment Due: ৳{registration.total_fee} BDT\n"
            f"Status: PENDING COMPLETION\n\n"
            f"⚠️ ARENA SLOTS ARE STRICTLY LIMITED:\n"
            f"Because seating and competition slots are capped on a first-confirmed basis, unpaid reservations are released on a rolling schedule. Complete your registration before slots get over!\n\n"
            f"👉 COMPLETE YOUR REGISTRATION NOW:\n"
            f"{checkout_url}\n\n"
            f"(Pay securely in seconds via SSLCommerz: bKash, Nagad, Cards, or Internet Banking)\n\n"
            f"Need assistance or have questions?\n"
            f"Email: {site.contact_email} | Phone: {site.contact_phone}\n"
            f"Venue: {site.venue}\n\n"
            f"Warm regards,\n"
            f"Josephite Tech Club\n"
            f"St. Joseph International School"
        )

        send_mail(
            subject=subject,
            message=plain_message,
            html_message=html_message,
            from_email=f'{site.email_from_name} <{settings.EMAIL_HOST_USER}>',
            recipient_list=[participant.email],
            fail_silently=False,
        )

        registration.last_reminder_sent_at = now
        registration.reminder_count = reminder_num
        note_entry = f"[Cart Reminder #{reminder_num} on {now.strftime('%Y-%m-%d %H:%M:%S')}] Sent reminder email to {participant.email}."
        registration.admin_notes = f"{registration.admin_notes}\n{note_entry}".strip()
        registration.save(update_fields=['last_reminder_sent_at', 'reminder_count', 'admin_notes'])

        logger.info(f"Sent cart reminder #{reminder_num} to {participant.email} for {registration.short_code}")
        return True, f"Reminder #{reminder_num} sent successfully to {participant.email}."

    except Exception as e:
        logger.error(f"Failed to send cart reminder for {registration.short_code}: {e}")
        return False, f"Failed to send email: {str(e)}"

