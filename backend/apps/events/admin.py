from django.contrib import admin
from .models import Event, EventGroup, EventFAQ

@admin.register(EventGroup)
class EventGroupAdmin(admin.ModelAdmin):
    list_display = ['code', 'label', 'grade_range']

class EventFAQInline(admin.TabularInline):
    model = EventFAQ
    extra = 1

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'event_type', 'individual_fee', 'team_fee', 'is_active', 'highlight', 'order']
    list_filter = ['category', 'event_type', 'is_active', 'highlight']
    list_editable = ['is_active', 'highlight', 'order']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ['eligibility_groups']
    inlines = [EventFAQInline]
