from django.db import models
from django.contrib.auth.models import User


class AdminProfile(models.Model):
    ROLE_CHOICES = [
        ('SUPER_ADMIN', 'Super Admin'),
        ('ADMIN', 'Admin'),
        ('VERIFIER', 'Payment Verifier'),
        ('VIEWER', 'Viewer (Read-only)'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='ADMIN')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.user and not self.user.is_staff:
            self.user.is_staff = True
            self.user.save(update_fields=['is_staff'])
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.user.username} ({self.role})'
