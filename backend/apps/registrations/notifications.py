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
    """Send HTML confirmation email to participant."""
    site = SiteSettings.get()
    if not site.email_confirmation_enabled:
        return False
    try:
        participant = registration.participant
        events = [re.event for re in registration.registration_events.select_related('event')]
        subject = f'Registration Confirmed — {site.carnival_name} | Code: {registration.short_code}'
        html_message = render_to_string('emails/registration_confirmation.html', {
            'registration': registration,
            'participant': participant,
            'events': events,
            'site': site,
        })
        plain_message = (
            f"Hi {participant.name},\n\n"
            f"Your registration for {site.carnival_name} is confirmed!\n"
            f"Confirmation Code: {registration.short_code}\n"
            f"Events: {', '.join(e.name for e in events)}\n"
            f"Total Fee: ৳{registration.total_fee}\n"
            f"Payment Status: {registration.get_payment_status_display()}\n\n"
            f"Venue: {site.venue}\n"
            f"Contact: {site.contact_email}\n\n"
            "Thank you!\nJosephite Tech Club"
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
