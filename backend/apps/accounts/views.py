from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from apps.core.throttles import LoginRateThrottle
from apps.core.turnstile import verify_turnstile_token
from .models import AdminProfile


class SecureTokenObtainPairView(TokenObtainPairView):
    """
    Secure JWT Token endpoint for Admin Login:
    1. Enforces LoginRateThrottle (5 attempts/min per IP) to block brute-force attacks.
    2. Validates Cloudflare Turnstile token if enabled in production.
    """
    throttle_classes = [LoginRateThrottle]

    def post(self, request, *args, **kwargs):
        turnstile_token = request.data.get('turnstile_token', '')
        remote_ip = request.META.get('REMOTE_ADDR')

        if not verify_turnstile_token(turnstile_token, remote_ip=remote_ip):
            return Response(
                {'detail': 'Security verification challenge failed. Please try again.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().post(request, *args, **kwargs)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    role = 'ADMIN'
    if hasattr(user, 'admin_profile'):
        role = user.admin_profile.role
    elif user.is_superuser:
        role = 'SUPER_ADMIN'

    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'is_superuser': user.is_superuser,
        'is_staff': user.is_staff,
        'role': role,
    })
