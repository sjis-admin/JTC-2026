import getpass
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from apps.accounts.models import AdminProfile


class Command(BaseCommand):
    help = "Create an Admin (Staff) account without Superuser privileges (role: ADMIN, VERIFIER, or VIEWER)."

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, help='Username for the admin user')
        parser.add_argument('--email', type=str, help='Email address')
        parser.add_argument('--password', type=str, help='Password')
        parser.add_argument(
            '--role',
            type=str,
            choices=['ADMIN', 'VERIFIER', 'VIEWER'],
            default='ADMIN',
            help='Admin role: ADMIN, VERIFIER, or VIEWER (default: ADMIN)'
        )

    def handle(self, *args, **options):
        username = options.get('username')
        email = options.get('email') or ''
        password = options.get('password')
        role = (options.get('role') or 'ADMIN').upper()

        # Interactive prompts if not provided via command line arguments
        if not username:
            username = input("Enter username: ").strip()
            if not username:
                raise CommandError("Username cannot be blank.")

        if User.objects.filter(username=username).exists():
            raise CommandError(f"User '{username}' already exists.")

        if not email and options.get('email') is None:
            email = input("Enter email address (optional): ").strip()

        if not password:
            password = getpass.getpass("Enter password: ")
            password_confirm = getpass.getpass("Confirm password: ")
            if password != password_confirm:
                raise CommandError("Passwords do not match.")
            if not password:
                raise CommandError("Password cannot be blank.")

        # Create staff user (is_staff=True, is_superuser=False)
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_staff=True,
            is_superuser=False
        )

        profile, _ = AdminProfile.objects.get_or_create(user=user)
        profile.role = role
        profile.save()

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully created Admin account '{username}' with role '{role}'! (Staff: True, Superuser: False)"
            )
        )
