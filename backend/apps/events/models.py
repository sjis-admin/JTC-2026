"""
Events app models: EventGroup, Event, EventFAQ.
"""
from django.db import models
from django.utils.text import slugify


class EventGroup(models.Model):
    """Grade groups A-E as defined by the carnival."""
    GROUP_CHOICES = [
        ('A', 'Group A — Grade 3–4'),
        ('B', 'Group B — Grade 5–6'),
        ('C', 'Group C — Grade 7–8'),
        ('D', 'Group D — Grade 9–A2 (Grade 12)'),
        ('E', 'Group E — University (Bachelors 1st–4th year)'),
    ]
    code = models.CharField(max_length=1, choices=GROUP_CHOICES, unique=True)
    label = models.CharField(max_length=100)
    grade_range = models.CharField(max_length=100)

    class Meta:
        ordering = ['code']

    def __str__(self):
        return f'Group {self.code} ({self.grade_range})'


class Event(models.Model):
    CATEGORY_CHOICES = [
        ('AI', 'AI & Tech'),
        ('CODING', 'Coding'),
        ('DIGITAL_ART', 'Digital Art & Media'),
        ('GAMING', 'Gaming'),
        ('ESPORTS', 'E-Sports'),
        ('ROBOTICS', 'Robotics & Drone'),
        ('QUIZ', 'Quiz & Knowledge'),
        ('CREATIVE', 'Creative'),
        ('TYPING', 'Typing'),
        ('OTHER', 'Other'),
    ]
    TYPE_CHOICES = [
        ('INDIVIDUAL', 'Individual'),
        ('TEAM', 'Team'),
        ('BOTH', 'Individual or Team'),
    ]
    SUBMISSION_CHOICES = [
        ('ONLINE', 'Online (during event)'),
        ('PENDRIVE', 'Pendrive / Offline'),
        ('STAGE', 'Stage Presentation'),
        ('LAB', 'Computer Lab'),
        ('PHYSICAL', 'Physical Submission'),
        ('MIXED', 'Mixed'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    short_name = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='OTHER')
    description = models.TextField(blank=True)
    rules = models.TextField(blank=True, help_text='Detailed rules in markdown format')
    judging_criteria = models.TextField(blank=True)
    eligibility_groups = models.ManyToManyField(EventGroup, related_name='events', blank=True)
    event_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='INDIVIDUAL')
    individual_fee = models.PositiveIntegerField(default=0, help_text='Fee in BDT')
    team_fee = models.PositiveIntegerField(default=0, help_text='Team fee in BDT (if team)')
    team_min = models.PositiveIntegerField(default=1)
    team_max = models.PositiveIntegerField(default=1)
    submission_type = models.CharField(max_length=10, choices=SUBMISSION_CHOICES, default='ONLINE')
    venue_detail = models.CharField(max_length=200, blank=True, help_text='e.g. Computer Lab, Old Building Room X')
    max_participants = models.PositiveIntegerField(null=True, blank=True, help_text='Leave blank for unlimited')
    is_active = models.BooleanField(default=True)
    highlight = models.BooleanField(default=False, help_text='Show as featured event on home page')
    icon = models.CharField(max_length=50, blank=True, help_text='Lucide icon name')
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def fee_display(self):
        if self.event_type == 'TEAM':
            return f'৳{self.team_fee} (team)'
        if self.event_type == 'BOTH':
            return f'৳{self.individual_fee} (individual) / ৳{self.team_fee} (team)'
        return f'৳{self.individual_fee}'

    @property
    def registered_count(self):
        return self.registrationevent_set.filter(
            registration__payment_status__in=['PENDING', 'VERIFIED']
        ).count()


class EventFAQ(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='faqs')
    question = models.CharField(max_length=300)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.event.name} — {self.question[:50]}'
