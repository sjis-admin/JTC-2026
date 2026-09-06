from django.contrib import admin
from .models import Participant, Registration, RegistrationEvent

@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'grade', 'group', 'school_display', 'created_at']
    list_filter = ['grade', 'group', 'school']
    search_fields = ['name', 'email', 'phone', 'school_name_other']

class RegistrationEventInline(admin.TabularInline):
    model = RegistrationEvent
    extra = 0
    readonly_fields = ['event', 'is_team', 'team_name', 'team_members', 'fee_charged']

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = [
        'short_code', 'participant', 'total_fee', 'is_bundle', 'bundle_bonus_fc',
        'payment_method', 'payment_status', 'registered_at'
    ]
    list_filter = ['payment_status', 'payment_method', 'is_bundle', 'bundle_bonus_fc']
    search_fields = ['confirmation_code', 'participant__name', 'participant__email', 'payment_reference']
    readonly_fields = ['confirmation_code', 'short_code', 'registered_at']
    inlines = [RegistrationEventInline]
