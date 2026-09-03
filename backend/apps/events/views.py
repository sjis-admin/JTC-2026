from rest_framework import viewsets, generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Event, EventGroup
from .serializers import EventListSerializer, EventDetailSerializer, EventGroupSerializer, EventAdminSerializer


class EventGroupViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventGroup.objects.all()
    serializer_class = EventGroupSerializer
    permission_classes = [AllowAny]


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.filter(is_active=True).prefetch_related('eligibility_groups', 'faqs')
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'event_type', 'highlight']
    search_fields = ['name', 'description']
    ordering_fields = ['order', 'name', 'individual_fee']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EventDetailSerializer
        return EventListSerializer


class EventAdminViewSet(viewsets.ModelViewSet):
    """Admin CRUD for all events."""
    queryset = Event.objects.all().prefetch_related('eligibility_groups', 'faqs')
    serializer_class = EventAdminSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'event_type', 'is_active', 'highlight']
    search_fields = ['name', 'description', 'rules']
    ordering_fields = ['order', 'name', 'individual_fee', 'created_at']
