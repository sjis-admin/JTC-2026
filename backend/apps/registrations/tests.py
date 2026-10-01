import json
from rest_framework.test import APITestCase
from django.conf import settings
from apps.events.models import Event, EventGroup
from apps.core.models import School
from apps.registrations.models import GRADE_TO_GROUP
from apps.registrations.serializers import RegistrationCreateSerializer


class BundleEligibilityTestCase(APITestCase):
    def setUp(self):
        self.school, _ = School.objects.get_or_create(name='St. Joseph International School')
        
        # Create groups A, B, C, D, E
        self.groups = {}
        for code, label, grange in [
            ('A', 'Group A', 'Grade 3–4'),
            ('B', 'Group B', 'Grade 5–6'),
            ('C', 'Group C', 'Grade 7–8'),
            ('D', 'Group D', 'Grade 9–12'),
            ('E', 'Group E', 'University'),
        ]:
            self.groups[code], _ = EventGroup.objects.get_or_create(code=code, defaults={'label': label, 'grade_range': grange})

        # Create bundle events
        self.bundle_slugs = getattr(settings, 'BUNDLE_EVENT_SLUGS', [
            'coding-marathon', 'gaming-quiz', 'swifttype-blitz', 'tech-art-bonanza', 'tech-memes'
        ])
        for idx, slug in enumerate(self.bundle_slugs):
            ev = Event.objects.create(
                name=f'Event {slug}',
                slug=slug,
                category='CODING',
                event_type='INDIVIDUAL',
                individual_fee=300,
                order=idx,
                is_active=True
            )
            ev.eligibility_groups.set([self.groups['A'], self.groups['B'], self.groups['C'], self.groups['D']])
            if slug == 'tech-art-bonanza':
                ev.eligibility_groups.add(self.groups['E'])

    def test_bundle_eligible_for_all_groups_a_to_d(self):
        # Test Group A (Grade 4), Group B (Grade 6), Group C (Grade 8), Group D (Grade 10)
        test_cases = [
            ('4', 'A', '01711111111'),
            ('6', 'B', '01722222222'),
            ('8', 'C', '01733333333'),
            ('10', 'D', '01744444444'),
        ]
        for grade, expected_group, phone in test_cases:
            serializer = RegistrationCreateSerializer(data={
                'name': f'Contestant Group {expected_group}',
                'email': f'group{expected_group.lower()}@example.com',
                'phone': phone,
                'school_id': self.school.id,
                'grade': grade,
                'is_bundle': True,
                'payment_method': 'SSLCOMMERZ',
                'turnstile_token': '',
            })
            self.assertTrue(serializer.is_valid(), f"Grade {grade} (Group {expected_group}) failed: {serializer.errors}")
            self.assertEqual(len(serializer.validated_data['_events']), 5)
            self.assertEqual(serializer.validated_data['_participant_group_code'], expected_group)

    def test_bundle_rejected_for_all_group_e_university_grades(self):
        # All university grades should be rejected for bundle
        for idx, uni_grade in enumerate(['UNI_1', 'UNI_2', 'UNI_3', 'UNI_4']):
            serializer = RegistrationCreateSerializer(data={
                'name': 'University Student',
                'email': f'univ{idx}@example.com',
                'phone': f'0175555555{idx}',
                'school_id': self.school.id,
                'grade': uni_grade,
                'is_bundle': True,
                'payment_method': 'SSLCOMMERZ',
                'turnstile_token': '',
            })
            self.assertFalse(serializer.is_valid(), f"Grade {uni_grade} should be rejected for bundle")
            self.assertIn('is_bundle', serializer.errors)
            error_msg = str(serializer.errors['is_bundle'][0])
            self.assertIn('only applicable for Groups A to D', error_msg)

    def test_bundle_view_creation_for_eligible_group(self):
        payload = {
            'name': 'Valid Participant',
            'email': 'valid.bundle@example.com',
            'phone': '01799887766',
            'school_id': self.school.id,
            'grade': '9',  # Group D
            'is_bundle': True,
            'payment_method': 'BKASH',
            'payment_reference': '',
            'turnstile_token': '',
        }
        response = self.client.post('/api/registrations/', payload, format='json')
        self.assertEqual(response.status_code, 201, response.data)
        self.assertTrue(response.data['is_bundle'])
        self.assertEqual(response.data['total_fee'], 1000)
        self.assertEqual(len(response.data['registration_events']), 5)

    def test_bundle_view_rejection_for_group_e(self):
        payload = {
            'name': 'University Contestant',
            'email': 'univ.attempt@example.com',
            'phone': '01799887755',
            'school_id': self.school.id,
            'grade': 'UNI_2',  # Group E
            'is_bundle': True,
            'payment_method': 'BKASH',
            'payment_reference': '',
            'turnstile_token': '',
        }
        response = self.client.post('/api/registrations/', payload, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('is_bundle', response.data)

    def test_bundle_info_endpoint(self):
        response = self.client.get('/api/bundle-info/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['eligible_groups'], ['A', 'B', 'C', 'D'])
        self.assertIn('Groups A to D', data['eligible_groups_display'])
        self.assertIn('eligibility_note', data)

    def test_group_e_can_register_for_individual_eligible_events(self):
        # Group E should be able to register for events open to Group E (e.g. tech-art-bonanza)
        art_event = Event.objects.get(slug='tech-art-bonanza')
        payload = {
            'name': 'University Artist',
            'email': 'univ.artist@example.com',
            'phone': '01712345678',
            'school_id': self.school.id,
            'grade': 'UNI_1',  # Group E
            'is_bundle': False,
            'events': [{'event_id': art_event.id, 'is_team': False}],
            'payment_method': 'BKASH',
            'payment_reference': '',
            'turnstile_token': '',
        }
        response = self.client.post('/api/registrations/', payload, format='json')
        self.assertEqual(response.status_code, 201, response.data)
        self.assertFalse(response.data['is_bundle'])
        self.assertEqual(response.data['total_fee'], 300)
        self.assertEqual(len(response.data['registration_events']), 1)

    def test_my_registration_status_and_cancel_pending(self):
        # 1. Initially no registration
        resp = self.client.get('/api/registrations/my-status/?email=test.flow@example.com')
        self.assertEqual(resp.status_code, 200)
        self.assertFalse(resp.data['has_registration'])
        self.assertEqual(resp.data['status'], 'NONE')

        # 2. Create pending registration
        art_event = Event.objects.get(slug='tech-art-bonanza')
        payload = {
            'name': 'Pending Student',
            'email': 'test.flow@example.com',
            'phone': '01711223344',
            'school_id': self.school.id,
            'grade': '6',
            'is_bundle': False,
            'events': [{'event_id': art_event.id, 'is_team': False}],
            'payment_method': 'SSLCOMMERZ',
            'turnstile_token': '',
        }
        create_resp = self.client.post('/api/registrations/', payload, format='json')
        self.assertEqual(create_resp.status_code, 201)
        conf_code = create_resp.data['confirmation_code']

        # 3. Check status again -> should be PENDING
        resp = self.client.get('/api/registrations/my-status/?email=test.flow@example.com')
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.data['has_registration'])
        self.assertEqual(resp.data['status'], 'PENDING')
        self.assertEqual(resp.data['registration']['confirmation_code'], conf_code)

        # 4. Cancel pending registration
        cancel_resp = self.client.post(
            '/api/registrations/cancel-pending/',
            {'confirmation_code': conf_code, 'email': 'test.flow@example.com'},
            format='json'
        )
        self.assertEqual(cancel_resp.status_code, 200)
        self.assertTrue(cancel_resp.data['success'])

        # 5. After cancel, status is NONE (unblocked)
        resp = self.client.get('/api/registrations/my-status/?email=test.flow@example.com')
        self.assertEqual(resp.status_code, 200)
        self.assertFalse(resp.data['has_registration'])
        self.assertEqual(resp.data['status'], 'NONE')

        # 6. User can re-register now with no duplicate conflict
        create_resp2 = self.client.post('/api/registrations/', payload, format='json')
        self.assertEqual(create_resp2.status_code, 201)


class RegistrationToggleAndBlockTestCase(APITestCase):
    def setUp(self):
        from apps.core.models import SiteSettings
        from django.contrib.auth import get_user_model
        User = get_user_model()

        self.school, _ = School.objects.get_or_create(name='St. Joseph International School')
        self.group_c, _ = EventGroup.objects.get_or_create(code='C', defaults={'label': 'Group C', 'grade_range': 'Grade 7–8'})
        self.event = Event.objects.create(
            name='Speed Typing Challenge',
            slug='speed-typing-test',
            category='TYPING',
            event_type='INDIVIDUAL',
            individual_fee=200,
            order=1,
            is_active=True
        )
        self.event.eligibility_groups.set([self.group_c])

        self.admin_user = User.objects.create_superuser(
            username='admin_tester',
            email='admin@jtc.test',
            password='adminpassword123'
        )

        self.site_settings = SiteSettings.get()
        self.site_settings.registration_open = True
        self.site_settings.registration_start_date = None
        self.site_settings.registration_deadline = None
        self.site_settings.save()

    def test_admin_toggle_endpoint_and_backend_blocking(self):
        # 1. Unauthenticated toggle request must be rejected (401)
        resp = self.client.post('/api/admin/settings/toggle-registration/')
        self.assertEqual(resp.status_code, 401)

        # 2. Authenticate as admin and toggle registration OFF
        self.client.force_authenticate(user=self.admin_user)
        toggle_resp = self.client.post('/api/admin/settings/toggle-registration/', {'registration_open': False}, format='json')
        self.assertEqual(toggle_resp.status_code, 200)
        self.assertFalse(toggle_resp.data['registration_open'])
        self.assertFalse(toggle_resp.data['is_active'])

        # 3. Verify public settings reflect the change immediately
        self.client.logout()
        pub_settings = self.client.get('/api/settings/')
        self.assertEqual(pub_settings.status_code, 200)
        self.assertFalse(pub_settings.data['registration_open'])
        self.assertIn('paused by administration', pub_settings.data['registration_status_message'])

        # 4. Attempt student registration while closed -> MUST be blocked with 403
        payload = {
            'name': 'Blocked Student',
            'email': 'blocked.student@example.com',
            'phone': '01811223344',
            'school_id': self.school.id,
            'grade': '7',
            'is_bundle': False,
            'events': [{'event_id': self.event.id, 'is_team': False}],
            'payment_method': 'BKASH',
            'payment_reference': 'TRX12345678',
            'turnstile_token': '',
        }
        reg_resp = self.client.post('/api/registrations/', payload, format='json')
        self.assertEqual(reg_resp.status_code, 403)
        self.assertFalse(reg_resp.data.get('registration_open'))
        self.assertIn('paused by administration', reg_resp.data.get('error'))

        # 5. Attempt auth endpoints while closed -> MUST be blocked with 403
        otp_resp = self.client.post('/api/auth/guest/otp/send/', {'email': 'test@example.com'}, format='json')
        self.assertEqual(otp_resp.status_code, 403)

        # 6. Admin turns registration back ON
        self.client.force_authenticate(user=self.admin_user)
        toggle_on_resp = self.client.post('/api/admin/settings/toggle-registration/', {'registration_open': True}, format='json')
        self.assertEqual(toggle_on_resp.status_code, 200)
        self.assertTrue(toggle_on_resp.data['registration_open'])
        self.assertTrue(toggle_on_resp.data['is_active'])

        # 7. Public settings reflect registration open
        self.client.logout()
        pub_settings2 = self.client.get('/api/settings/')
        self.assertTrue(pub_settings2.data['registration_open'])

        # 8. Student registration succeeds now!
        reg_resp2 = self.client.post('/api/registrations/', payload, format='json')
        self.assertEqual(reg_resp2.status_code, 201)
        self.assertEqual(reg_resp2.data['payment_status'], 'PENDING')


