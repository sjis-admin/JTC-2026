"""
Core app: SiteSettings, School models.
"""
from django.db import models
from django.utils import timezone


class SiteSettings(models.Model):
    """Singleton model for site-wide settings managed dynamically from admin dashboard."""
    logo = models.ImageField(upload_to='site/', null=True, blank=True, help_text='JTC Logo')
    carnival_name = models.CharField(max_length=200, default='SJIS Inter-School Tech Carnival 2026')
    carnival_start_date = models.DateField(null=True, blank=True, help_text='Carnival start date (e.g. 2026-10-01)')
    carnival_end_date = models.DateField(null=True, blank=True, help_text='Carnival end date (e.g. 2026-10-02)')
    venue = models.CharField(max_length=300, default='St. Joseph International School, 97 Asad Avenue, Mohammadpur, Dhaka 1207')
    tagline = models.CharField(max_length=300, default='Where Innovation Meets Excellence')
    
    # Dynamic Registration Window
    registration_open = models.BooleanField(default=True, help_text='Master toggle to allow or disable registrations')
    registration_start_date = models.DateTimeField(null=True, blank=True, help_text='Registration opening date and time')
    registration_deadline = models.DateTimeField(null=True, blank=True, help_text='Registration closing deadline date and time')
    
    contact_email = models.EmailField(default='jtc@sjis.edu.bd')
    contact_phone = models.CharField(max_length=100, default='+880 2-9116271', help_text='Helpline numbers displayed in footer and passes')
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    announcement_banner = models.TextField(blank=True, help_text='Scrolling announcement text (leave blank to hide)')
    
    # SSLCommerz Online Payment Gateway settings
    sslcommerz_enabled = models.BooleanField(default=True, help_text='Enable SSLCommerz instant card/bKash/Nagad gateway')
    sslcommerz_store_id = models.CharField(max_length=100, blank=True, help_text='Merchant Store ID from SSLCommerz')
    sslcommerz_store_pass = models.CharField(max_length=100, blank=True, help_text='Store Password / Secret Key')
    sslcommerz_is_sandbox = models.BooleanField(default=False, help_text='Checked for Sandbox/Test mode, unchecked for Live production')

    # GreenWeb SMS settings (override from env)
    sms_enabled = models.BooleanField(default=False)
    sms_user = models.CharField(max_length=100, blank=True)
    sms_pass = models.CharField(max_length=100, blank=True)
    sms_from = models.CharField(max_length=20, blank=True, default='JTCSJIS')
    
    # Email settings
    email_confirmation_enabled = models.BooleanField(default=True)
    email_from_name = models.CharField(max_length=100, default='Josephite Tech Club')

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return 'Site Settings'

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def is_registration_active(self) -> tuple[bool, str]:
        """
        Dynamically calculates whether registration is currently open.
        Returns: (is_active: bool, reason_message: str)
        """
        if not self.registration_open:
            return False, 'Registration is currently paused by administration.'

        now = timezone.now()

        # Check start date
        if self.registration_start_date and now < self.registration_start_date:
            formatted_start = self.registration_start_date.strftime('%B %d, %Y at %I:%M %p')
            return False, f'Registration will open on {formatted_start}.'

        # Check closing deadline
        if self.registration_deadline and now > self.registration_deadline:
            formatted_end = self.registration_deadline.strftime('%B %d, %Y at %I:%M %p')
            return False, f'Registration officially closed on {formatted_end}.'

        return True, 'Registration is currently open.'


class School(models.Model):
    """Pre-populated school list for dropdown (admin-managed)."""
    name = models.CharField(max_length=300, unique=True)
    short_name = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name
