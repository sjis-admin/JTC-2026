"""
Django Management Command: expire_unpaid_registrations
Automatically marks pending registrations as EXPIRED if unpaid after TTL (default 24h).
Can be executed via cron or scheduled worker.

Usage:
  python manage.py expire_unpaid_registrations
  python manage.py expire_unpaid_registrations --hours=12
  python manage.py expire_unpaid_registrations --method=ALL
  python manage.py expire_unpaid_registrations --dry-run
"""
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction
from apps.registrations.models import Registration


class Command(BaseCommand):
    help = 'Expires unpaid registrations that have been PENDING beyond the specified TTL hours.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--hours',
            type=int,
            default=24,
            help='Number of hours before a pending registration expires (default: 24).'
        )
        parser.add_argument(
            '--method',
            type=str,
            default='SSLCOMMERZ',
            help='Filter by payment method (SSLCOMMERZ, BKASH, NAGAD, BANK, or ALL). Default is SSLCOMMERZ.'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Simulate expiration without making database changes.'
        )

    def handle(self, *args, **options):
        hours = options['hours']
        method = options['method'].upper()
        dry_run = options['dry_run']

        cutoff = timezone.now() - timedelta(hours=hours)

        qs = Registration.objects.filter(
            payment_status='PENDING',
            total_fee__gt=0,
            registered_at__lte=cutoff
        )

        if method != 'ALL':
            qs = qs.filter(payment_method=method)

        count = qs.count()
        self.stdout.write(
            f"Scanning for pending registrations older than {hours}h (cutoff: {cutoff.strftime('%Y-%m-%d %H:%M:%S UTC')}, method: {method})..."
        )

        if count == 0:
            self.stdout.write(self.style.SUCCESS("No pending registrations need expiration."))
            return

        self.stdout.write(f"Found {count} registration(s) to expire.")

        if dry_run:
            self.stdout.write(self.style.WARNING("[DRY RUN] No records were modified."))
            for reg in qs[:20]:
                self.stdout.write(f"  - Would expire: {reg.short_code} ({reg.participant.name}, fee: BDT {reg.total_fee}, registered: {reg.registered_at})")
            if count > 20:
                self.stdout.write(f"  ... and {count - 20} more.")
            return

        expired_count = 0
        with transaction.atomic():
            for reg in qs.select_for_update():
                note_entry = f"[Auto-TTL {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}] Expired: unpaid pending status exceeded {hours} hours."
                reg.payment_status = 'EXPIRED'
                reg.admin_notes = f"{reg.admin_notes}\n{note_entry}".strip()
                reg.save(update_fields=['payment_status', 'admin_notes'])
                expired_count += 1
                self.stdout.write(f"  - Expired: {reg.short_code} (Participant: {reg.participant.name})")

        self.stdout.write(self.style.SUCCESS(f"Successfully expired {expired_count} registration(s)."))
