from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from apps.accounts.models import AdminProfile


class AdminProfileInline(admin.StackedInline):
    model = AdminProfile
    can_delete = False
    verbose_name_plural = 'JTC Admin Profile & Role'


class UserAdmin(BaseUserAdmin):
    inlines = [AdminProfileInline]
    list_display = ['username', 'email', 'is_staff', 'is_superuser', 'get_jtc_role']

    def get_jtc_role(self, obj):
        if hasattr(obj, 'admin_profile'):
            return obj.admin_profile.get_role_display()
        return 'Super Admin' if obj.is_superuser else 'Admin' if obj.is_staff else 'Normal User (No Dashboard Access)'
    get_jtc_role.short_description = 'JTC Role'


try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

admin.site.register(User, UserAdmin)


@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role']
