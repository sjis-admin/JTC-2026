from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.utils import timezone
from .models import SiteSettings, School
from .serializers import SchoolSerializer, SiteSettingsSerializer, SiteSettingsUpdateSerializer


@api_view(['GET', 'PATCH'])
@permission_classes([IsAdminUser])
def site_settings_admin(request):
    site = SiteSettings.get()
    if request.method == 'GET':
        return Response(SiteSettingsSerializer(site, context={'request': request}).data)
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    serializer = SiteSettingsUpdateSerializer(site, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(SiteSettingsSerializer(site, context={'request': request}).data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def toggle_registration(request):
    """
    Instant 1-click toggle endpoint for admin / super-admin to freeze or resume registrations.
    Accepts optional JSON payload:
        { "registration_open": true | false }
    If not specified, it flips the current value of site.registration_open.
    """
    site = SiteSettings.get()
    requested_state = request.data.get('registration_open') if isinstance(request.data, dict) else None

    if requested_state is not None:
        site.registration_open = bool(requested_state)
    else:
        site.registration_open = not site.registration_open

    site.save(update_fields=['registration_open'])

    is_active, status_msg = site.is_registration_active()
    return Response({
        'success': True,
        'registration_open': site.registration_open,
        'is_active': is_active,
        'status_message': status_msg,
        'updated_at': timezone.now().isoformat(),
    }, status=status.HTTP_200_OK)


class SchoolListCreateView(generics.ListCreateAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAdminUser]


class SchoolDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAdminUser]
