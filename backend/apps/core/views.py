from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
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


class SchoolListCreateView(generics.ListCreateAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAdminUser]


class SchoolDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAdminUser]
