"""
Registrations app models: Participant, Registration, RegistrationEvent, Team.
"""
import uuid
from django.db import models
from apps.events.models import Event, EventGroup
from apps.core.models import School


GRADE_CHOICES = [
    ('3', 'Grade 3'), ('4', 'Grade 4'), ('5', 'Grade 5'), ('6', 'Grade 6'),
    ('7', 'Grade 7'), ('8', 'Grade 8'), ('9', 'Grade 9'), ('10', 'Grade 10 (SSC/O-Level)'),
    ('11', 'Grade 11 (HSC/A-Level Year 1)'), ('12', 'Grade 12 (HSC/A-Level Year 2)'),
    ('UNI_1', 'University — 1st Year'), ('UNI_2', 'University — 2nd Year'),
    ('UNI_3', 'University — 3rd Year'), ('UNI_4', 'University — 4th Year'),
]

GRADE_TO_GROUP = {
    '3': 'A', '4': 'A',
    '5': 'B', '6': 'B',
    '7': 'C', '8': 'C',
    '9': 'D', '10': 'D', '11': 'D', '12': 'D',
    'UNI_1': 'E', 'UNI_2': 'E', 'UNI_3': 'E', 'UNI_4': 'E',
}


class Participant(models.Model):
    TSHIRT_CHOICES = [('S', 'S'), ('M', 'M'), ('L', 'L'), ('XL', 'XL'), ('XXL', 'XXL')]

    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, blank=True)
    school_name_other = models.CharField(max_length=300, blank=True, help_text='If school not in list')
    grade = models.CharField(max_length=10, choices=GRADE_CHOICES)
    group = models.ForeignKey(EventGroup, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.name} ({self.get_grade_display()})'

    def save(self, *args, **kwargs):
        # Auto-assign group from grade
        group_code = GRADE_TO_GROUP.get(self.grade)
        if group_code:
            try:
                self.group = EventGroup.objects.get(code=group_code)
            except EventGroup.DoesNotExist:
                pass
        super().save(*args, **kwargs)

    @property
    def school_display(self):
        if self.school:
            return self.school.name
        return self.school_name_other or 'Unknown'


class Registration(models.Model):
    PAYMENT_STATUS = [
        ('PENDING', 'Pending Verification'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
        ('REFUNDED', 'Refunded'),
    ]
    PAYMENT_METHOD = [
        ('SSLCOMMERZ', 'SSLCommerz Online Payment (Cards/bKash/Nagad/Banking)'),
        ('BKASH', 'bKash'),
        ('NAGAD', 'Nagad'),
        ('BANK', 'Bank Transfer'),
    ]

    confirmation_code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name='registrations')
    total_fee = models.PositiveIntegerField(default=0)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD, default='BKASH')
    payment_reference = models.CharField(max_length=200, blank=True, help_text='bKash/Nagad/Bank transaction ID')
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS, default='PENDING')
    payment_verified_at = models.DateTimeField(null=True, blank=True)
    payment_verified_by = models.ForeignKey(
        'auth.User', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='verified_payments'
    )
    admin_notes = models.TextField(blank=True)
    email_sent = models.BooleanField(default=False)
    sms_sent = models.BooleanField(default=False)
    registered_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-registered_at']

    def __str__(self):
        return f'{self.short_code} — {self.participant.name}'

    @property
    def short_code(self):
        if self.id:
            return f"JTC26{self.id:04d}"
        return f"JTC26{str(self.confirmation_code)[:4].upper()}"

    @property
    def events_list(self):
        return [re.event for re in self.registration_events.select_related('event')]


class RegistrationEvent(models.Model):
    """Junction: one row per event in a registration (supports team context)."""
    registration = models.ForeignKey(Registration, on_delete=models.CASCADE, related_name='registration_events')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrationevent_set')
    is_team = models.BooleanField(default=False)
    team_name = models.CharField(max_length=200, blank=True)
    team_members = models.TextField(blank=True, help_text='Comma-separated member names')
    fee_charged = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'{self.registration.short_code} → {self.event.name}'
