from django.core.management.base import BaseCommand
from apps.events.models import Event, EventGroup, EventFAQ
from apps.core.models import School, SiteSettings
from datetime import date


class Command(BaseCommand):
    help = 'Seeds initial groups, schools, site settings, and all 19 carnival events'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting seed process...'))

        # 1. Site Settings
        site = SiteSettings.get()
        site.carnival_name = 'SJIS Inter-School Tech Carnival 2026'
        site.tagline = 'Inspiring Innovation, Igniting Future Technologists'
        site.venue = 'St. Joseph International School, 97 Asad Avenue, Mohammadpur, Dhaka 1207'
        site.carnival_start_date = date(2026, 10, 1)
        site.carnival_end_date = date(2026, 10, 2)
        site.registration_open = True
        site.contact_email = 'jtc@sjis.edu.bd'
        site.contact_phone = '+880 2-9116271'
        site.announcement_banner = '⚡ Registrations for SJIS Inter-School Tech Carnival 2026 are now open! Explore 19 exciting events and register today.'
        site.save()
        self.stdout.write(self.style.SUCCESS('Site settings configured.'))

        # 2. Groups
        groups_data = [
            ('A', 'Group A', 'Grade 3 to Grade 4'),
            ('B', 'Group B', 'Grade 5 to Grade 6'),
            ('C', 'Group C', 'Grade 7 to Grade 8'),
            ('D', 'Group D', 'Grade 9 to Grade 12 (A2/HSC)'),
            ('E', 'Group E', 'University Students (Bachelors 1st–4th Year)'),
        ]
        groups = {}
        for code, label, grade_range in groups_data:
            grp, _ = EventGroup.objects.get_or_create(
                code=code,
                defaults={'label': label, 'grade_range': grade_range}
            )
            groups[code] = grp
        self.stdout.write(self.style.SUCCESS('Event groups seeded.'))

        # 3. Schools
        initial_schools = [
            ('St. Joseph International School', 'SJIS', 1),
            ('St. Joseph Higher Secondary School', 'SJHSS', 2),
            ('Notre Dame College', 'NDC', 3),
            ('Scholastica', 'Scholastica', 4),
            ('Mastermind English Medium School', 'Mastermind', 5),
            ('Sunnydale School', 'Sunnydale', 6),
            ('Dhaka Residential Model College', 'DRMC', 7),
            ('Rajuk Uttara Model College', 'RUMC', 8),
            ('Viqarunnisa Noon School & College', 'VNSC', 9),
            ('Holy Cross College', 'HCC', 10),
            ('SFX Greenherald International School', 'Greenherald', 11),
            ('Maple Leaf International School', 'MLIS', 12),
            ('Birshreshtha Noor Mohammad Public College', 'BNMPC', 13),
            ('Dhaka City College', 'DCC', 14),
            ('University of Dhaka', 'DU', 15),
            ('BUET', 'BUET', 16),
            ('BRAC University', 'BRACU', 17),
            ('North South University', 'NSU', 18),
            ('Independent University, Bangladesh', 'IUB', 19),
        ]
        for name, short_name, order in initial_schools:
            School.objects.get_or_create(
                name=name,
                defaults={'short_name': short_name, 'order': order, 'is_active': True}
            )
        self.stdout.write(self.style.SUCCESS('Schools seeded.'))

        # 4. Events definition
        events_data = [
            {
                'name': 'Coding Marathon (Coding Competition)',
                'slug': 'coding-marathon',
                'short_name': 'Coding Marathon',
                'category': 'CODING',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Computer Lab',
                'submission_type': 'LAB',
                'highlight': True,
                'icon': 'Code',
                'description': 'Algorithmic programming and creative coding competition across junior and senior categories. Winner awarded Medals.',
                'rules': (
                    "### Segment Breakdown\n"
                    "- **Group A (Grade 3–4)**: Scratch block-based challenge.\n"
                    "- **Group B (Grade 5–6)**: Scratch block-based problem solving.\n"
                    "- **Group C (Grade 7–8)**: Python algorithmic challenge (competitive platform).\n"
                    "- **Group D (Grade 9–12)**: Python / C++ competitive programming contest environment.\n\n"
                    "### General Rules\n"
                    "- Contest will be held in the SJIS Computer Lab.\n"
                    "- No external assistance or AI code generation assistants are permitted.\n"
                    "- Award: Official Winner Medals & Certificate."
                ),
                'judging_criteria': "Automated test cases passed, code efficiency, and submission time penalty.",
                'faqs': [
                    ("Are standard libraries allowed?", "Yes, all standard libraries for Python / C++ are permitted.")
                ]
            },
            {
                'name': 'AI Prompting',
                'slug': 'ai-prompting',
                'short_name': 'AI Prompting',
                'category': 'AI',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 200,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D', 'E'],
                'venue_detail': 'Computer Lab',
                'submission_type': 'ONLINE',
                'highlight': True,
                'icon': 'Sparkles',
                'description': 'Test your generative AI mastery by reverse-engineering visual styles, composition, and subjects using prompt engineering. Winner awarded Medals.',
                'rules': (
                    "### Task\n"
                    "Contestants are given a specific target image and a text description. They must generate an image that matches the style, composition, and subject of the target as closely as possible.\n\n"
                    "### Participant Requirements & Rules\n"
                    "- **Bring Your Own Device (BYOD)**: Participants must bring their own hardware (laptop, tablet, or smartphone) to the venue.\n"
                    "- **Connectivity & Platform**: Participants are responsible for their own internet connectivity and must be logged into their preferred AI image generation platform prior to the start.\n"
                    "- **Award**: Official Winner Medals & Certificate."
                ),
                'judging_criteria': "Element fidelity, prompt intentionality, and cleanliness (no AI glitches).",
                'faqs': [
                    ("What AI platforms are allowed?", "Midjourney, DALL-E, Stable Diffusion, Adobe Firefly, Bing Image Creator, or similar text-to-image generators.")
                ]
            },
            {
                'name': 'Drone Competition (Design & Flight)',
                'slug': 'drone-competition',
                'short_name': 'Drone Competition',
                'category': 'ROBOTICS',
                'event_type': 'BOTH',
                'individual_fee': 500,
                'team_fee': 1000,
                'team_min': 1,
                'team_max': 3,
                'groups': ['C', 'D'],
                'venue_detail': 'Open Field Arena',
                'submission_type': 'STAGE',
                'highlight': True,
                'icon': 'Plane',
                'description': 'Making own drone and make it fly! Individual (৳500) or Team of max 3 (৳1000). Group C & D. Winner awarded prestigious Crest.',
                'rules': (
                    "- **Eligibility**: Group C (Grade 7–8) & Group D (Grade 9–12).\n"
                    "- **Fee**: Individual: ৳500 | Team (Max 3 members): ৳1000.\n"
                    "- **Award**: Prestigious Winner Crest + Certificate.\n"
                    "- Participants must build/configure their own drone and demonstrate controlled flight, obstacle maneuver, and target landing in the designated flight zone."
                ),
                'judging_criteria': "Flight stability, maneuver accuracy, build craftsmanship, pilot control, and safety adherence.",
                'faqs': []
            },
            {
                'name': 'PowerPoint Presentation',
                'slug': 'powerpoint-presentation',
                'short_name': 'PowerPoint Presentation',
                'category': 'CREATIVE',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Auditorium / Seminar Hall',
                'submission_type': 'STAGE',
                'highlight': False,
                'icon': 'Presentation',
                'description': 'Theme-based slide deck creation and live on-stage presentation. Winner awarded Medals.',
                'rules': (
                    "- **Format**: Submission and live presentation based.\n"
                    "- **Theme**: A theme will be provided in advance.\n"
                    "- **Time Limit**: 5 minutes presentation + 2 minutes Q&A from judges.\n"
                    "- Slides must be submitted beforehand in .pptx or .pdf format.\n"
                    "- **Award**: Official Winner Medals & Certificate."
                ),
                'judging_criteria': "Slide aesthetics, clarity of communication, stage presence, time management, and Q&A responses.",
                'faqs': []
            },
            {
                'name': 'Game Sync Symphony (Gaming Montage / Video)',
                'slug': 'game-sync-symphony',
                'short_name': 'Gaming Montage / Video',
                'category': 'DIGITAL_ART',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Main Stage Screening',
                'submission_type': 'PENDRIVE',
                'highlight': False,
                'icon': 'Film',
                'description': 'Dynamic video editing competition featuring gaming montages and synced gameplay videos. Winner awarded Medals.',
                'rules': (
                    "- Individual event (৳300).\n"
                    "- Video editing package featuring gameplay synchronization, beat matching, visual SFX, and color grading.\n"
                    "- Submission via pendrive on Day 1 of the fest.\n"
                    "- **Award**: Official Winner Medals & Certificate."
                ),
                'judging_criteria': "Audio-video sync, pacing, visual effects, storytelling, rendering quality (1080p/4K 60fps).",
                'faqs': []
            },
            {
                'name': 'SwiftType Blitz (Typing Competition)',
                'slug': 'swifttype-blitz',
                'short_name': 'Type Blitz',
                'category': 'TYPING',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 200,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Computer Lab',
                'submission_type': 'LAB',
                'highlight': False,
                'icon': 'Keyboard',
                'description': 'Speed typing showdown in the SJIS Computer Lab. Winner awarded Medals.',
                'rules': (
                    "- **Platform**: Speed typing 60-second test mode.\n"
                    "- **Attempts**: 3 tries will be given to record the highest score.\n"
                    "- **Result**: Best Net WPM (Words Per Minute) with accuracy threshold.\n"
                    "- **Award**: Official Winner Medals & Certificate."
                ),
                'judging_criteria': "Highest Net WPM and highest Accuracy percentage.",
                'faqs': [
                    ("Can I bring my own mechanical keyboard?", "Yes, you may bring your own USB keyboard.")
                ]
            },
            {
                'name': 'Robo Showcase (Robot Display)',
                'slug': 'robo-showcase',
                'short_name': 'Robo Showcase',
                'category': 'ROBOTICS',
                'event_type': 'BOTH',
                'individual_fee': 500,
                'team_fee': 1000,
                'team_min': 1,
                'team_max': 3,
                'groups': ['C', 'D', 'E'],
                'venue_detail': 'Robotics & Hardware Exhibition Hall',
                'submission_type': 'STAGE',
                'highlight': True,
                'icon': 'Bot',
                'description': 'Robot Display & Hardware Innovation. Individual (৳500) or Team of max 3 (৳1000). Winner awarded prestigious Crest.',
                'rules': (
                    "- **Eligibility**: Group C, D, E (Grade 7 to University).\n"
                    "- **Fee**: Individual: ৳500 | Team (Max 3 members): ৳1000.\n"
                    "- Hardware prototype must be functional and demonstrated live before the jury.\n"
                    "- **Award**: Prestigious Winner Crest + Certificate."
                ),
                'judging_criteria': "Innovation, technical complexity, real-world utility, execution quality, and Q&A presentation.",
                'faqs': []
            },
            {
                'name': 'Tech-art Bonanza (Digital Art & Banner Submission)',
                'slug': 'tech-art-bonanza',
                'short_name': 'Digital Art / Banner',
                'category': 'DIGITAL_ART',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Art & Media Hall',
                'submission_type': 'PENDRIVE',
                'highlight': True,
                'icon': 'Palette',
                'description': 'Theme-based digital art, illustration, and banner design submission. Winner awarded Medals.',
                'rules': (
                    "- **Eligibility**: Grade 3 to Grade 12 (Group A–D).\n"
                    "- **Fee**: ৳300 (individual).\n"
                    "- **Submission**: Source files and high-res export via pendrive on Day 1.\n"
                    "- **Award**: Official Winner Medals & Certificate."
                ),
                'judging_criteria': "Creativity, thematic relevance, aesthetic appeal, technical composition, and typography.",
                'faqs': []
            },
            {
                'name': 'Photo Editing (Photography Competition)',
                'slug': 'photo-editing',
                'short_name': 'Photo Editing',
                'category': 'CREATIVE',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 200,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D', 'E'],
                'venue_detail': 'Exhibition Gallery',
                'submission_type': 'PHYSICAL',
                'highlight': True,
                'icon': 'Camera',
                'description': 'Creative photo editing and photography showcase in the carnival gallery. Winner awarded Medals.',
                'rules': (
                    "- Individual event (৳200).\n"
                    "- Photo submission and creative editing exhibition.\n"
                    "- **Award**: Official Winner Medals & Certificate."
                ),
                'judging_criteria': "Composition, color grading, storytelling, technical sharpness, creativity.",
                'faqs': []
            },
            {
                'name': 'Tech Bytes (Tech Article Writing)',
                'slug': 'tech-bytes',
                'short_name': 'Tech Article Writing',
                'category': 'CREATIVE',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Writing Hall',
                'submission_type': 'PHYSICAL',
                'highlight': False,
                'icon': 'FileText',
                'description': 'Deep dive analytical tech article writing on modern computing, AI ethics, and IT innovations. Winner awarded Medals.',
                'rules': (
                    "- Individual event (৳300).\n"
                    "- Word count: 600–1000 words.\n"
                    "- **Award**: Official Winner Medals & Certificate."
                ),
                'judging_criteria': "Depth of research, clarity of thought, grammatical precision, technical accuracy.",
                'faqs': []
            },
            {
                'name': 'Rubik’s Showdown (Rubik’s Cube Competition)',
                'slug': 'rubiks-showdown',
                'short_name': "Rubik's Showdown",
                'category': 'OTHER',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 200,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Speedcubing Arena',
                'submission_type': 'PHYSICAL',
                'highlight': False,
                'icon': 'Box',
                'description': 'Fast-paced 3x3 speedcubing tournament with official timer rules. Winner awarded Medals.',
                'rules': (
                    "- Official 3x3 cube scramble and inspection rules.\n"
                    "- Individual event (৳200).\n"
                    "- **Award**: Official Winner Medals & Certificate."
                ),
                'judging_criteria': "Fastest single solve and average solve times.",
                'faqs': []
            },
            {
                'name': 'Tech Memes',
                'slug': 'tech-memes',
                'short_name': 'Tech Memes',
                'category': 'CREATIVE',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D', 'E'],
                'venue_detail': 'Online Submission',
                'submission_type': 'ONLINE',
                'highlight': False,
                'icon': 'Smile',
                'description': 'Original programming, computer science, and tech student humor. Winner awarded Medals.',
                'rules': (
                    "- Individual event (৳300).\n"
                    "- Must be original content created by the participant.\n"
                    "- **Award**: Official Winner Medals & Certificate."
                ),
                'judging_criteria': "Humor, relatability, creativity, visual template execution.",
                'faqs': []
            },
            {
                'name': 'Gaming Quiz',
                'slug': 'gaming-quiz',
                'short_name': 'Gaming Quiz',
                'category': 'GAMING',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Old Building Room & Stage',
                'submission_type': 'MIXED',
                'highlight': False,
                'icon': 'Gamepad2',
                'description': 'Video game lore, mechanics, esports, and gaming history quiz. Winner awarded Medals.',
                'rules': (
                    "- Individual event (৳300).\n"
                    "- Written prelims followed by live stage buzzer rounds.\n"
                    "- **Award**: Official Winner Medals & Certificate."
                ),
                'judging_criteria': "Written score for prelims, direct point totals in buzzer/stage rounds.",
                'faqs': []
            },
            {
                'name': 'Tech Quiz',
                'slug': 'tech-quiz',
                'short_name': 'Tech Quiz',
                'category': 'QUIZ',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Main Stage & Exam Hall',
                'submission_type': 'MIXED',
                'highlight': False,
                'icon': 'HelpCircle',
                'description': 'Battle of intellect across computer science, frontier tech, inventions, and tech giants. Winner awarded Medals.',
                'rules': (
                    "- Individual event (৳300).\n"
                    "- Written exam followed by live stage buzzer round.\n"
                    "- **Award**: Official Winner Medals & Certificate."
                ),
                'judging_criteria': "Accuracy of answers, speed of submission, buzzer round reaction time.",
                'faqs': []
            },
            {
                'name': 'HTML Web Page creation',
                'slug': 'html-webpage-creation',
                'short_name': 'HTML Web Page creation',
                'category': 'CODING',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Computer Lab',
                'submission_type': 'LAB',
                'highlight': False,
                'icon': 'Globe',
                'description': 'Design and code a responsive webpage from scratch based on an on-the-spot prompt. Winner awarded Medals.',
                'rules': (
                    "- Individual event (৳300).\n"
                    "- HTML, CSS, JavaScript in lab code challenge.\n"
                    "- **Award**: Official Winner Medals & Certificate."
                ),
                'judging_criteria': "Design quality, code structure, responsiveness across mobile & desktop, creativity.",
                'faqs': []
            },
            {
                'name': 'Line Robot',
                'slug': 'line-robot',
                'short_name': 'Line Robot',
                'category': 'ROBOTICS',
                'event_type': 'BOTH',
                'individual_fee': 300,
                'team_fee': 1000,
                'team_min': 1,
                'team_max': 3,
                'groups': ['B', 'C', 'D', 'E'],
                'venue_detail': 'Robotics Arena Track',
                'submission_type': 'PHYSICAL',
                'highlight': False,
                'icon': 'Cpu',
                'description': 'Autonomous line following robot race across a complex black-line track. Individual (৳300) / Team of max 3 (৳1000). Awarded Medals / Crest.',
                'rules': (
                    "- **Eligibility**: Group B, C, D, E (Grade 5 to University).\n"
                    "- **Fee**: Individual: ৳300 | Team (Max 3 members): ৳1000.\n"
                    "- Robot must autonomously follow the line without manual intervention.\n"
                    "- **Award**: Medals / Crest + Certificate."
                ),
                'judging_criteria': "Track completion time minus checkpoint penalties.",
                'faqs': []
            },
            {
                'name': 'Valorant (Team of 5)',
                'slug': 'valorant-esports',
                'short_name': 'Valorant (5v5)',
                'category': 'ESPORTS',
                'event_type': 'TEAM',
                'individual_fee': 0,
                'team_fee': 500,
                'team_min': 5,
                'team_max': 5,
                'groups': ['C', 'D', 'E'],
                'venue_detail': 'Online (Prelims) & Main Stage LAN (Semis/Finals)',
                'submission_type': 'MIXED',
                'highlight': True,
                'icon': 'Crosshair',
                'description': '5v5 tactical shooter showdown. Team of 5 (৳500). Semis and Grand Finals hosted on stage LAN with live broadcast. Winner awarded Prize Money & Model Cheque.',
                'rules': (
                    "### Tournament Structure\n"
                    "- **Team Size**: Exactly 5 players per team (৳500 per team).\n"
                    "- **Prelims**: Played online prior to LAN day.\n"
                    "- **Semi-Finals & Grand Finals**: Played live on stage on high-performance LAN rigs with live streaming.\n"
                    "- **Award**: Prize Money + Model Cheque + Champion Crest."
                ),
                'judging_criteria': "Direct match victories based on official competitive tournament rulebook.",
                'faqs': []
            },
            {
                'name': 'EAFC (FIFA E-Sports)',
                'slug': 'eafc-esports',
                'short_name': 'EAFC (1v1)',
                'category': 'ESPORTS',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D', 'E'],
                'venue_detail': 'Gaming Arena (Fest Day)',
                'submission_type': 'PHYSICAL',
                'highlight': True,
                'icon': 'Trophy',
                'description': '1v1 EA Sports FC console championship. Individual (৳300). Knockout rounds on LAN on Fest Day. Winner awarded Football Crest / Prize Money.',
                'rules': (
                    "- **Format**: 1v1 knockout tournament (৳300).\n"
                    "- **Platform**: PlayStation 5 / PC LAN on Fest Day.\n"
                    "- **Award**: Football Crest / Prize Money + Certificate."
                ),
                'judging_criteria': "Standard 6-minute halves with Extra Time and Penalties on tie.",
                'faqs': []
            },
        ]

        valid_slugs = [edata['slug'] for edata in events_data]
        # Clean up old duplicate/renamed event records
        deleted_count, _ = Event.objects.exclude(slug__in=valid_slugs).delete()
        if deleted_count > 0:
            self.stdout.write(self.style.WARNING(f'Removed {deleted_count} deprecated duplicate event records.'))

        for idx, edata in enumerate(events_data, 1):
            grp_codes = edata.pop('groups', [])
            faqs = edata.pop('faqs', [])
            event, created = Event.objects.get_or_create(
                slug=edata['slug'],
                defaults={**edata, 'order': idx}
            )
            if not created:
                for k, v in edata.items():
                    setattr(event, k, v)
                event.order = idx
                event.save()

            event.eligibility_groups.set([groups[c] for c in grp_codes if c in groups])

            # Seed FAQs
            EventFAQ.objects.filter(event=event).delete()
            for f_idx, (q, a) in enumerate(faqs, 1):
                EventFAQ.objects.create(event=event, question=q, answer=a, order=f_idx)

            self.stdout.write(self.style.SUCCESS(f'Seeded event [{idx}/{len(events_data)}]: {event.name}'))

        self.stdout.write(self.style.SUCCESS(f'All {len(events_data)} official events synced and seeded successfully!'))
