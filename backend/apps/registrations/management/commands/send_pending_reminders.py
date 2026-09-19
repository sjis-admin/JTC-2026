"""
Django Management Command: send_pending_reminders
Sends 1 automated daily cart reminder email to participants with PENDING registrations.
Can be executed via daily system cron or scheduled worker.

Usage:
  python manage.py send_pending_reminders
  python manage.py send_pending_reminders --dry-run
  python manage.py send_pending_reminders --force
  python manage.py send_pending_reminders --min-hours=2
  python manage.py send_pending_reminders --max-reminders=7
  python manage.py send_pending_reminders --code=JTC260011
"""
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.core.models import SiteSettings
from apps.registrations.models import Registration
from apps.registrations.notifications import send_pending_reminder_email


class Command(BaseCommand):
    help = 'Sends 1 daily reminder email to participants whose registration is PENDING in the cart.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Simulate reminder scan without sending any emails or updating records.'
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Bypass the 24-hour daily limit and site settings check.'
        )
        parser.add_argument(
            '--min-hours',
            type=int,
            default=2,
            help='Minimum registration age in hours before first reminder is sent (default: 2).'
        )
        parser.add_argument(
            '--max-reminders',
            type=int,
            default=7,
            help='Maximum number of reminders to send to a single registration (default: 7).'
        )
        parser.add_argument(
            '--code',
            type=str,
            default='',
            help='Filter by specific registration short_code (e.g. JTC260011) or confirmation UUID.'
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        force = options['force']
        min_hours = options['min_hours']
        max_reminders = options['max_reminders']
        target_code = options['code'].strip().upper()

        site = SiteSettings.get()
        if not site.email_reminder_enabled and not force:
            self.stdout.write(self.style.WARNING(
                "Cart reminder emails are currently DISABLED in Site Settings. Use --force to override."
            ))
            return

        now = timezone.now()
        cutoff_created = now - timedelta(hours=min_hours)
        cutoff_last_sent = now - timedelta(hours=23)  # 23h allows for daily cron timing drift

        qs = Registration.objects.filter(
            payment_status='PENDING',
            total_fee__gt=0,
            participant__email__isnull=False,
        ).select_related('participant').prefetch_related('registration_events__event')

        if target_code:
            if target_code.startswith('JTC26') and target_code[5:].isdigit():
                qs = qs.filter(id=int(target_code[5:]))
            else:
                qs = qs.filter(confirmation_code=target_code)

        total_pending = qs.count()
        self.stdout.write(
            f"Scanning pending registrations (Found {total_pending} total PENDING)..."
        )

        eligible_regs = []
        skipped_too_new = 0
        skipped_already_sent_today = 0
        skipped_max_reached = 0

        for reg in qs:
            if not force and reg.registered_at > cutoff_created:
                skipped_too_new += 1
                continue

            if not force and reg.reminder_count >= max_reminders:
                skipped_max_reached += 1
                continue

            if not force and reg.last_reminder_sent_at and reg.last_reminder_sent_at > cutoff_last_sent:
                skipped_already_sent_today += 1
                continue

            eligible_regs.append(reg)

        self.stdout.write(
            f"Summary: {len(eligible_regs)} eligible for daily reminder "
            f"(Skipped: {skipped_already_sent_today} sent today, "
            f"{skipped_too_new} registered <{min_hours}h ago, "
            f"{skipped_max_reached} reached max {max_reminders} reminders)."
        )

        if not eligible_regs:
            self.stdout.write(self.style.SUCCESS("No pending registrations require reminders today."))
            return

        if dry_run:
            self.stdout.write(self.style.WARNING(f"[DRY RUN] Would send emails to {len(eligible_regs)} contestant(s):"))
            for reg in eligible_regs:
                event_names = ", ".join([re.event.name for re in reg.registration_events.all()])
                self.stdout.write(
                    f"  - [{reg.short_code}] {reg.participant.name} <{reg.participant.email}> | "
                    f"Events: {event_names} | Fee: ৳{reg.total_fee} | Reminders sent so far: {reg.reminder_count}"
                )
            return

        sent_count = 0
        fail_count = 0

        for reg in eligible_regs:
            self.stdout.write(
                f"Sending reminder to {reg.short_code} ({reg.participant.name} <{reg.participant.email}>)...",
                ending=" "
            )
            success, msg = send_pending_reminder_email(reg, force=force)
            if success:
                self.stdout.write(self.style.SUCCESS(f"✓ {msg}"))
                sent_count += 1
            else:
                self.stdout.write(self.style.ERROR(f"✗ {msg}"))
                fail_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"\nCompleted! Successfully sent: {sent_count}, Failed: {fail_count}."
        ))
