from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from django.db import transaction
from django.utils import timezone
from .models import Participant, Registration, RegistrationEvent, GRADE_TO_GROUP
from .serializers import RegistrationCreateSerializer, RegistrationReadSerializer
from .notifications import send_confirmation_email, send_confirmation_sms
from .guest_auth import (
    GoogleTokenVerifier, OTPStore,
    generate_session_jwt, verify_session_jwt, is_valid_email,
)
from apps.core.models import School, SiteSettings
from apps.core.serializers import SchoolSerializer
from apps.events.models import EventGroup
from apps.core.throttles import RegistrationRateThrottle, BurstAnonThrottle, VerifyRateThrottle


# ─── Auth Gate Endpoints ───────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def auth_google(request):
    """
    Verifies a Google ID token from the frontend GSI SDK.
    Returns a short-lived session JWT + user info on success.
    POST body: { "credential": "<google_id_token>" }
    """
    credential = request.data.get('credential', '').strip()
    if not credential:
        return Response({'error': 'Missing Google credential token.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user_info = GoogleTokenVerifier.verify(credential)
    except ValueError as exc:
        return Response({'error': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    token = generate_session_jwt(
        email=user_info['email'],
        name=user_info['name'],
        auth_method='google',
    )
    return Response({
        'session_token': token,
        'email': user_info['email'],
        'name': user_info['name'],
        'picture': user_info['picture'],
        'auth_method': 'google',
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def auth_guest_otp_send(request):
    """
    Generates and emails a 6-digit OTP to the provided guest email.
    POST body: { "email": "user@example.com" }
    Rate-limited on the frontend; backend validates format only.
    """
    email = request.data.get('email', '').strip().lower()
    if not email or not is_valid_email(email):
        return Response({'error': 'Please provide a valid email address.'}, status=status.HTTP_400_BAD_REQUEST)

    otp = OTPStore.generate_and_store(email)

    try:
        OTPStore.send_otp_email(email, otp)
    except Exception:
        return Response(
            {'error': 'Failed to send verification email. Please check the address and try again.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    return Response({'detail': 'Verification code sent. Please check your inbox (and spam folder).'})


@api_view(['POST'])
@permission_classes([AllowAny])
def auth_guest_otp_verify(request):
    """
    Validates the OTP entered by the guest and issues a session JWT on success.
    POST body: { "email": "user@example.com", "otp": "123456" }
    """
    email = request.data.get('email', '').strip().lower()
    otp_input = request.data.get('otp', '').strip()

    if not email or not is_valid_email(email):
        return Response({'error': 'Please provide a valid email address.'}, status=status.HTTP_400_BAD_REQUEST)

    if not otp_input or not otp_input.isdigit() or len(otp_input) != 6:
        return Response({'error': 'OTP must be a 6-digit number.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        valid = OTPStore.validate(email, otp_input)
    except ValueError as exc:
        return Response({'error': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    if not valid:
        return Response({'error': 'Incorrect verification code. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)

    token = generate_session_jwt(email=email, name='', auth_method='guest')
    return Response({
        'session_token': token,
        'email': email,
        'auth_method': 'guest',
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def school_list(request):
    """Public endpoint: list all active schools for dropdown."""
    schools = School.objects.filter(is_active=True)
    return Response(SchoolSerializer(schools, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def site_settings_public(request):
    """Public subset of site settings for frontend."""
    site = SiteSettings.get()
    is_active, status_msg = site.is_registration_active()
    return Response({
        'carnival_name': site.carnival_name,
        'carnival_start_date': site.carnival_start_date,
        'carnival_end_date': site.carnival_end_date,
        'venue': site.venue,
        'tagline': site.tagline,
        'registration_open': is_active,
        'registration_open_raw': site.registration_open,
        'registration_start_date': site.registration_start_date,
        'registration_deadline': site.registration_deadline,
        'registration_status_message': status_msg,
        'contact_email': site.contact_email,
        'contact_phone': site.contact_phone,
        'facebook_url': site.facebook_url,
        'instagram_url': site.instagram_url,
        'youtube_url': site.youtube_url,
        'announcement_banner': site.announcement_banner,
        'logo_url': request.build_absolute_uri(site.logo.url) if site.logo else None,
    })


class RegistrationCreateView(generics.CreateAPIView):
    serializer_class = RegistrationCreateSerializer
    permission_classes = [AllowAny]
    throttle_classes = [RegistrationRateThrottle, BurstAnonThrottle]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        site = SiteSettings.get()
        is_active, status_msg = site.is_registration_active()
        if not is_active:
            return Response({'error': status_msg}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        events = data['_events']

        # Get or create school
        school = None
        if data.get('school_id'):
            try:
                school = School.objects.get(pk=data['school_id'])
            except School.DoesNotExist:
                pass

        # Create participant
        participant = Participant.objects.create(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            school=school,
            school_name_other=data.get('school_name_other', ''),
            grade=data['grade'],
        )

        # Calculate total fee
        total_fee = 0
        event_map = {e.id: e for e in events}
        events_payload = data['events']

        for ep in events_payload:
            event = event_map[ep['event_id']]
            if ep.get('is_team') and event.event_type in ['TEAM', 'BOTH']:
                total_fee += event.team_fee
            else:
                total_fee += event.individual_fee

        # Create registration
        registration = Registration.objects.create(
            participant=participant,
            total_fee=total_fee,
            payment_method=data.get('payment_method', 'BKASH'),
            payment_reference=data.get('payment_reference', ''),
        )

        # Create RegistrationEvent rows
        for ep in events_payload:
            event = event_map[ep['event_id']]
            is_team = ep.get('is_team', False) and event.event_type in ['TEAM', 'BOTH']
            fee = event.team_fee if is_team else event.individual_fee
            RegistrationEvent.objects.create(
                registration=registration,
                event=event,
                is_team=is_team,
                team_name=ep.get('team_name', ''),
                team_members=ep.get('team_members', ''),
                fee_charged=fee,
            )

        # Send notifications (best-effort)
        send_confirmation_email(registration)
        send_confirmation_sms(registration)

        return Response(
            RegistrationReadSerializer(registration, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


@api_view(['GET'])
@permission_classes([AllowAny])
@throttle_classes([VerifyRateThrottle])
def registration_lookup(request, code):
    """Lookup registration by JTC26XXXX short ID, numeric ID, or confirmation_code UUID."""
    code_clean = code.strip().upper()
    reg = None

    # Format 1: JTC260001 or JTC-2026-0001
    if code_clean.startswith('JTC26') and code_clean[5:].isdigit():
        reg_id = int(code_clean[5:])
        reg = Registration.objects.select_related(
            'participant', 'participant__school'
        ).prefetch_related(
            'registration_events__event__eligibility_groups'
        ).filter(id=reg_id).first()
    elif code_clean.startswith('JTC-26-') and code_clean[7:].isdigit():
        reg_id = int(code_clean[7:])
        reg = Registration.objects.select_related(
            'participant', 'participant__school'
        ).prefetch_related(
            'registration_events__event__eligibility_groups'
        ).filter(id=reg_id).first()
    elif code_clean.startswith('JTC') and code_clean[3:].isdigit():
        reg_id = int(code_clean[3:])
        reg = Registration.objects.select_related(
            'participant', 'participant__school'
        ).prefetch_related(
            'registration_events__event__eligibility_groups'
        ).filter(id=reg_id).first()
    elif code_clean.isdigit():
        reg = Registration.objects.select_related(
            'participant', 'participant__school'
        ).prefetch_related(
            'registration_events__event__eligibility_groups'
        ).filter(id=int(code_clean)).first()

    # Format 2: Full UUID or UUID prefix/suffix
    if not reg:
        try:
            reg = Registration.objects.select_related(
                'participant', 'participant__school'
            ).prefetch_related(
                'registration_events__event__eligibility_groups'
            ).get(confirmation_code=code)
        except (Registration.DoesNotExist, ValueError):
            pass

    if not reg:
        reg = Registration.objects.select_related(
            'participant', 'participant__school'
        ).prefetch_related(
            'registration_events__event__eligibility_groups'
        ).filter(confirmation_code__istartswith=code).first()

    if not reg:
        return Response({'error': 'Registration not found.'}, status=status.HTTP_404_NOT_FOUND)

    return Response(RegistrationReadSerializer(reg, context={'request': request}).data)


# ─── Admin views ──────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_registrations_list(request):
    """Admin: list all registrations with filters."""
    qs = Registration.objects.select_related(
        'participant', 'participant__school'
    ).prefetch_related('registration_events__event')

    status_filter = request.query_params.get('status')
    if status_filter:
        qs = qs.filter(payment_status=status_filter)

    search = request.query_params.get('search')
    if search:
        qs = qs.filter(
            participant__name__icontains=search
        ) | qs.filter(
            participant__email__icontains=search
        ) | qs.filter(
            participant__phone__icontains=search
        ) | qs.filter(
            confirmation_code__icontains=search
        ) | qs.filter(
            payment_reference__icontains=search
        )

    from rest_framework.pagination import PageNumberPagination
    paginator = PageNumberPagination()
    paginator.page_size = 100
    page = paginator.paginate_queryset(qs.order_by('-registered_at'), request)
    serializer = RegistrationReadSerializer(page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_update_payment(request, pk):
    """Admin: verify or reject a payment (supports id or confirmation_code)."""
    try:
        if str(pk).isdigit():
            reg = Registration.objects.get(pk=int(pk))
        else:
            reg = Registration.objects.get(confirmation_code=pk)
    except Registration.DoesNotExist:
        return Response({'error': 'Registration not found.'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('payment_status')
    notes = request.data.get('admin_notes', '')
    if new_status not in ['PENDING', 'VERIFIED', 'REJECTED', 'REFUNDED']:
        return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)

    reg.payment_status = new_status
    reg.admin_notes = notes
    if new_status == 'VERIFIED':
        reg.payment_verified_at = timezone.now()
        reg.payment_verified_by = request.user
    reg.save()
    return Response(RegistrationReadSerializer(reg, context={'request': request}).data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_stats(request):
    """Admin: dashboard statistics."""
    from apps.events.models import Event
    from django.db.models import Count, Sum

    total_registrations = Registration.objects.count()
    verified = Registration.objects.filter(payment_status='VERIFIED').count()
    pending = Registration.objects.filter(payment_status='PENDING').count()
    rejected = Registration.objects.filter(payment_status='REJECTED').count()
    total_revenue = Registration.objects.filter(
        payment_status='VERIFIED'
    ).aggregate(total=Sum('total_fee'))['total'] or 0

    pending_revenue = Registration.objects.filter(
        payment_status='PENDING'
    ).aggregate(total=Sum('total_fee'))['total'] or 0

    total_events_booked = RegistrationEvent.objects.count()

    event_stats = RegistrationEvent.objects.values(
        'event__name', 'event__category'
    ).annotate(count=Count('id')).order_by('-count')[:10]

    return Response({
        'total_registrations': total_registrations,
        'verified': verified,
        'pending': pending,
        'rejected': rejected,
        'total_revenue_verified': total_revenue,
        'total_revenue_pending': pending_revenue,
        'total_events_booked': total_events_booked,
        'event_popularity': list(event_stats),
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_export_excel(request):
    """Admin: Export all registrations, students, and payment records as an Excel workbook (.xlsx)."""
    from django.http import HttpResponse
    from .excel_export import generate_registrations_workbook

    qs = Registration.objects.select_related(
        'participant', 'participant__school', 'participant__group', 'payment_verified_by'
    ).prefetch_related('registration_events__event').all()

    status_filter = request.query_params.get('status')
    if status_filter and status_filter != 'ALL':
        qs = qs.filter(payment_status=status_filter)

    search = request.query_params.get('search')
    if search:
        qs = qs.filter(
            participant__name__icontains=search
        ) | qs.filter(
            participant__email__icontains=search
        ) | qs.filter(
            participant__phone__icontains=search
        ) | qs.filter(
            confirmation_code__icontains=search
        ) | qs.filter(
            payment_reference__icontains=search
        )

    excel_bytes = generate_registrations_workbook(qs.order_by('-registered_at'))
    timestamp = timezone.now().strftime('%Y%m%d_%H%M%S')
    filename = f"JTC2026_Registrations_{timestamp}.xlsx"

    response = HttpResponse(
        excel_bytes,
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response

