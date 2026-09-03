from django.contrib import admin
from .models import SiteSettings, School

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ['carnival_name', 'registration_open', 'carnival_start_date', 'venue']

@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ['name', 'short_name', 'is_active', 'order']
    list_editable = ['is_active', 'order']
    search_fields = ['name', 'short_name']
