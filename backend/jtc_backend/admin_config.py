from django.contrib import admin
from apps.core.models import SiteSettings, School
from apps.events.models import Event, EventGroup, EventFAQ
from apps.registrations.models import Participant, Registration, RegistrationEvent


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Branding', {'fields': ('logo', 'carnival_name', 'tagline')}),
        ('Dates & Venue', {'fields': ('carnival_start_date', 'carnival_end_date', 'venue')}),
        ('Registration', {'fields': ('registration_open', 'registration_deadline')}),
        ('Contact & Social', {'fields': ('contact_email', 'contact_phone', 'facebook_url', 'instagram_url', 'youtube_url')}),
        ('Announcement', {'fields': ('announcement_banner',)}),
        ('Email', {'fields': ('email_confirmation_enabled', 'email_from_name')}),
        ('SMS (GreenWeb)', {'fields': ('sms_enabled', 'sms_user', 'sms_pass', 'sms_from')}),
    )


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ['name', 'short_name', 'is_active', 'order']
    list_editable = ['is_active', 'order']


@admin.register(EventGroup)
class EventGroupAdmin(admin.ModelAdmin):
    list_display = ['code', 'label', 'grade_range']


class EventFAQInline(admin.TabularInline):
    model = EventFAQ
    extra = 1


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'event_type', 'individual_fee', 'team_fee', 'is_active', 'highlight']
    list_filter = ['category', 'event_type', 'is_active']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ['eligibility_groups']
    inlines = [EventFAQInline]


class RegistrationEventInline(admin.TabularInline):
    model = RegistrationEvent
    extra = 0
    readonly_fields = ['event', 'is_team', 'team_name', 'fee_charged']


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ['short_code', 'participant', 'total_fee', 'payment_status', 'registered_at']
    list_filter = ['payment_status', 'payment_method']
    search_fields = ['participant__name', 'participant__email', 'payment_reference']
    readonly_fields = ['confirmation_code', 'short_code', 'registered_at', 'payment_verified_at']
    inlines = [RegistrationEventInline]
