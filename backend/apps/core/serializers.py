from rest_framework import serializers
from .models import SiteSettings, School


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id', 'name', 'short_name', 'is_active', 'order']


class SiteSettingsSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        exclude = ['sms_pass']  # Never expose password

    def get_logo_url(self, obj):
        request = self.context.get('request')
        if obj.logo and request:
            return request.build_absolute_uri(obj.logo.url)
        return None


class SiteSettingsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        exclude = []
