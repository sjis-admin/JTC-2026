from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from rest_framework.routers import DefaultRouter
from apps.events.views import EventAdminViewSet
from apps.accounts.views import SecureTokenObtainPairView

admin_router = DefaultRouter()
admin_router.register(r'events', EventAdminViewSet, basename='admin-events')

urlpatterns = [
    path('django-admin/', admin.site.urls),

    # Auth (with Rate Limiting & Bot Challenge)
    path('api/auth/token/', SecureTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),

    # Public API
    path('api/', include('apps.events.urls')),
    path('api/', include('apps.registrations.urls')),

    # Admin API
    path('api/admin/', include(admin_router.urls)),
    path('api/admin/', include('apps.accounts.urls')),
    path('api/admin/', include('apps.core.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
