from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import EventViewSet, EventGroupViewSet, bundle_info

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'event-groups', EventGroupViewSet, basename='eventgroup')

urlpatterns = [
    path('', include(router.urls)),
    path('bundle-info/', bundle_info, name='bundle-info'),
]
