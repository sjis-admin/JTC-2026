import re
from rest_framework import serializers
from .models import Participant, Registration, RegistrationEvent, GRADE_TO_GROUP
from apps.events.models import Event, EventGroup
from apps.core.models import School
from apps.events.serializers import EventListSerializer
from apps.core.sanitizer import sanitize_text
from apps.core.turnstile import verify_turnstile_token

# Bangladesh Mobile Phone Regex: 013-019 (11 digits or with +88/88)
BD_PHONE_REGEX = re.compile(r'^(?:\+?88|0088)?(01[3-9]\d{8})$')


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id', 'name', 'short_name']


class RegistrationEventCreateSerializer(serializers.Serializer):
    event_id = serializers.IntegerField()
    is_team = serializers.BooleanField(default=False)
    team_name = serializers.CharField(max_length=200, required=False, allow_blank=True)
    team_members = serializers.CharField(required=False, allow_blank=True,
                                         help_text='Comma-separated member names')

    def validate_team_name(self, value):
        return sanitize_text(value, max_length=200)

    def validate_team_members(self, value):
        return sanitize_text(value, max_length=1000)

    def validate(self, data):
        if data.get('is_team') and not data.get('team_name', '').strip():
            raise serializers.ValidationError({'team_name': 'Team name is required for team participation.'})
        return data


class RegistrationCreateSerializer(serializers.Serializer):
    # Participant fields
    name = serializers.CharField(max_length=200, min_length=3)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    school_id = serializers.IntegerField(required=False, allow_null=True)
    school_name_other = serializers.CharField(max_length=300, required=False, allow_blank=True)
    grade = serializers.ChoiceField(choices=list(GRADE_TO_GROUP.keys()))
    # Events
    events = RegistrationEventCreateSerializer(many=True)
    # Payment
    payment_method = serializers.ChoiceField(
        choices=['SSLCOMMERZ', 'BKASH', 'NAGAD', 'BANK'], default='SSLCOMMERZ'
    )
    payment_reference = serializers.CharField(max_length=200, required=False, allow_blank=True)
    # Bot Defense
    turnstile_token = serializers.CharField(required=False, allow_blank=True)

    def validate_name(self, value):
        cleaned = sanitize_text(value, max_length=200)
        if len(cleaned) < 3:
            raise serializers.ValidationError('Name must be at least 3 characters long.')
        if not re.search(r'[a-zA-Z]', cleaned):
            raise serializers.ValidationError('Name must contain letters.')
        return cleaned

    def validate_school_name_other(self, value):
        return sanitize_text(value, max_length=300)

    def validate_payment_reference(self, value):
        cleaned = sanitize_text(value, max_length=200)
        if cleaned:
            # Payment Fraud Defense: Check if this transaction reference was already used
            existing = Registration.objects.filter(
                payment_reference__iexact=cleaned
            ).exclude(payment_reference='').exists()
            if existing:
                raise serializers.ValidationError(
                    f'The transaction reference "{cleaned}" has already been submitted for another registration. '
                    'Duplicate transaction references are not permitted.'
                )
        return cleaned

    def validate_phone(self, value):
        cleaned = re.sub(r'[\s\-()]', '', value)
        match = BD_PHONE_REGEX.match(cleaned)
        if not match:
            raise serializers.ValidationError('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017xxxxxxxx).')
        return match.group(1)  # Return normalized 11-digit format

    def validate_events(self, events_data):
        if not events_data:
            raise serializers.ValidationError('At least one event must be selected.')
        return events_data

    def validate(self, data):
        # 1. Turnstile bot challenge validation
        request = self.context.get('request')
        remote_ip = request.META.get('REMOTE_ADDR') if request else None
        turnstile_token = data.get('turnstile_token', '')

        if not verify_turnstile_token(turnstile_token, remote_ip=remote_ip):
            raise serializers.ValidationError({
                'turnstile_token': 'Security verification challenge failed. Please refresh and try again.'
            })

        # 2. Validate school
        school_id = data.get('school_id')
        school_name_other = data.get('school_name_other', '').strip()
        if not school_id and not school_name_other:
            raise serializers.ValidationError({
                'school_name_other': 'Please select an institution or enter your institution name.'
            })

        grade = data.get('grade')
        participant_group_code = GRADE_TO_GROUP.get(grade)

        event_ids = [e['event_id'] for e in data.get('events', [])]
        events = Event.objects.filter(id__in=event_ids, is_active=True).prefetch_related('eligibility_groups')

        if len(events) != len(event_ids):
            raise serializers.ValidationError({'events': 'One or more selected events are invalid or inactive.'})

        for event in events:
            eligible_codes = list(event.eligibility_groups.values_list('code', flat=True))
            if eligible_codes and participant_group_code not in eligible_codes:
                raise serializers.ValidationError(
                    f'You are not eligible for "{event.name}". '
                    f'Your grade group ({participant_group_code}) is not in the eligible groups: '
                    f'{", ".join(eligible_codes)}.'
                )
        data['_events'] = events
        data['_participant_group_code'] = participant_group_code
        return data


class RegistrationEventReadSerializer(serializers.ModelSerializer):
    event = EventListSerializer(read_only=True)

    class Meta:
        model = RegistrationEvent
        fields = ['event', 'is_team', 'team_name', 'team_members', 'fee_charged']


def mask_email(email: str) -> str:
    if not email or '@' not in email:
        return '***'
    user_part, domain = email.split('@', 1)
    if len(user_part) <= 2:
        masked_user = user_part[0] + '***'
    else:
        masked_user = user_part[:2] + '*' * min(len(user_part) - 2, 6)
    return f"{masked_user}@{domain}"


def mask_phone(phone: str) -> str:
    if not phone:
        return '***'
    clean = str(phone).strip()
    if len(clean) <= 6:
        return '***' + clean[-2:]
    return clean[:3] + '*' * (len(clean) - 6) + clean[-3:]


class RegistrationReadSerializer(serializers.ModelSerializer):
    participant_name = serializers.CharField(source='participant.name')
    participant_email = serializers.SerializerMethodField()
    participant_phone = serializers.SerializerMethodField()
    participant_grade = serializers.CharField(source='participant.get_grade_display')
    participant_school = serializers.CharField(source='participant.school_display')
    registration_events = RegistrationEventReadSerializer(many=True, read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display')
    short_code = serializers.ReadOnlyField()

    def get_participant_email(self, obj):
        request = self.context.get('request')
        email = obj.participant.email if obj.participant else ''
        if request and request.user and (request.user.is_staff or request.user.is_superuser):
            return email
        return mask_email(email)

    def get_participant_phone(self, obj):
        request = self.context.get('request')
        phone = obj.participant.phone if obj.participant else ''
        if request and request.user and (request.user.is_staff or request.user.is_superuser):
            return phone
        return mask_phone(phone)

    class Meta:
        model = Registration
        fields = [
            'confirmation_code', 'short_code', 'participant_name', 'participant_email',
            'participant_phone', 'participant_grade', 'participant_school',
            'registration_events', 'total_fee', 'payment_method',
            'payment_reference', 'payment_status', 'payment_status_display',
            'email_sent', 'sms_sent', 'registered_at',
        ]
