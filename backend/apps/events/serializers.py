from rest_framework import serializers
from .models import Event, EventGroup, EventFAQ


class EventGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventGroup
        fields = ['id', 'code', 'label', 'grade_range']


class EventFAQSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = EventFAQ
        fields = ['id', 'question', 'answer', 'order']


class EventListSerializer(serializers.ModelSerializer):
    eligibility_groups = EventGroupSerializer(many=True, read_only=True)
    fee_display = serializers.ReadOnlyField()
    registered_count = serializers.ReadOnlyField()

    class Meta:
        model = Event
        fields = [
            'id', 'name', 'slug', 'short_name', 'category', 'description',
            'event_type', 'individual_fee', 'team_fee', 'team_min', 'team_max',
            'eligibility_groups', 'submission_type', 'venue_detail',
            'is_active', 'highlight', 'icon', 'fee_display', 'registered_count', 'order',
        ]


class EventDetailSerializer(EventListSerializer):
    faqs = EventFAQSerializer(many=True, read_only=True)

    class Meta(EventListSerializer.Meta):
        fields = EventListSerializer.Meta.fields + ['rules', 'faqs']


class EventAdminSerializer(serializers.ModelSerializer):
    eligibility_group_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=EventGroup.objects.all(), source='eligibility_groups', required=False
    )
    eligibility_groups = EventGroupSerializer(many=True, read_only=True)
    faqs = EventFAQSerializer(many=True, required=False)

    class Meta:
        model = Event
        fields = '__all__'

    def update(self, instance, validated_data):
        faqs_data = validated_data.pop('faqs', None)
        instance = super().update(instance, validated_data)
        if faqs_data is not None:
            instance.faqs.all().delete()
            for idx, f in enumerate(faqs_data):
                EventFAQ.objects.create(
                    event=instance,
                    question=f.get('question', ''),
                    answer=f.get('answer', ''),
                    order=f.get('order', idx)
                )
        return instance
