from rest_framework import viewsets, generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from django.conf import settings
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


@api_view(['GET'])
@permission_classes([AllowAny])
def bundle_info(request):
    """
    Public endpoint: returns the Bundle Competition Package details.
    Frontend uses this to render the bundle card with live event data.
    """
    bundle_slugs = getattr(settings, 'BUNDLE_EVENT_SLUGS', [])
    bundle_price = getattr(settings, 'BUNDLE_PRICE', 1000)
    bundle_eligible_groups = getattr(settings, 'BUNDLE_ELIGIBLE_GROUPS', ['A', 'B', 'C', 'D'])
    bundle_bonus = getattr(settings, 'BUNDLE_BONUS_DESCRIPTION', 'One free round of FC playing in the Game Zone!')

    bundle_events = list(
        Event.objects.filter(slug__in=bundle_slugs, is_active=True)
        .prefetch_related('eligibility_groups')
        .order_by('order')
    )

    # Calculate original total (without bundle discount)
    original_total = sum(e.individual_fee for e in bundle_events)
    savings = original_total - bundle_price

    return Response({
        'price': bundle_price,
        'original_total': original_total,
        'savings': savings,
        'eligible_groups': bundle_eligible_groups,
        'bonus': bundle_bonus,
        'events': EventListSerializer(bundle_events, many=True).data,
    })
