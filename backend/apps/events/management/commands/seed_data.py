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
                'description': 'Test your generative AI mastery by reverse-engineering visual styles, composition, and subjects using prompt engineering.',
                'rules': (
                    "### Task\n"
                    "Contestants are given a specific target image and a text description. They must generate an image that matches the style, composition, and subject of the target as closely as possible.\n\n"
                    "### Participant Requirements & Rules\n"
                    "- **Bring Your Own Device (BYOD)**: Participants must bring their own hardware (laptop, tablet, or smartphone) to the venue.\n"
                    "- **Connectivity & Platform**: Participants are responsible for their own internet connectivity and must be logged into their preferred AI image generation platform prior to the start.\n\n"
                    "### Instant Disqualification Criteria\n"
                    "- Violates host platform safety guidelines (NSFW, extreme violence).\n"
                    "- Prompt history does not match the generated image (judges will test-run winning prompts to verify reproducibility).\n"
                    "- Reverse-engineered image-to-image prompts are used (uploading an existing image to the AI to clone it).\n"
                    "- Submitted prompt is **NOT** in one continuous paragraph (no bullet points, no line breaks, no massive word-salad blocks)."
                ),
                'judging_criteria': (
                    "- **Element Fidelity**: Did the AI actually render every element requested in the prompt, or did it ignore half of them?\n"
                    "- **Cleanliness & Artifacts**: Deductions for standard AI glitches (floating limbs, chaotic text, melted hands, impossible geometry).\n"
                    "- **Prompt Intentionality**: Is the prompt clean and cohesive, or just repetitive buzzwords ('photorealistic, 8k, hyperdetailed')?"
                ),
                'faqs': [
                    ("What AI platforms are allowed?", "Midjourney, DALL-E, Stable Diffusion, Adobe Firefly, Bing Image Creator, or similar text-to-image generators."),
                    ("Can I use multiple prompts?", "You can experiment within the time limit, but only one final prompt and resulting image can be submitted.")
                ]
            },
            {
                'name': 'Coding Marathon',
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
                'description': 'Algorithmic programming and creative coding competition across junior and senior categories.',
                'rules': (
                    "### Segment Breakdown\n"
                    "- **Group A (Grade 3–4)**: Scratch block-based challenge.\n"
                    "- **Group B (Grade 5–6)**: Scratch block-based problem solving.\n"
                    "- **Group C (Grade 7–8)**: Python algorithmic challenge (Codeforces / competitive platform).\n"
                    "- **Group D (Grade 9–12)**: Python / C++ competitive programming (Codeforces contest environment).\n\n"
                    "### General Rules\n"
                    "- Contest will be held in the SJIS Computer Lab.\n"
                    "- No external assistance or AI code generation assistants are permitted."
                ),
                'judging_criteria': "Automated test cases passed, code efficiency, and submission time penalty.",
                'faqs': [
                    ("Are standard libraries allowed?", "Yes, all standard libraries for Python / C++ are permitted.")
                ]
            },
            {
                'name': 'Tech-art Bonanza (Digital Art & Poster)',
                'slug': 'tech-art-bonanza',
                'short_name': 'Digital Art & Poster',
                'category': 'DIGITAL_ART',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Art & Media Hall',
                'submission_type': 'PENDRIVE',
                'highlight': True,
                'icon': 'Palette',
                'description': 'Theme-based digital art, illustration, and graphic poster design.',
                'rules': (
                    "- **Eligibility**: Grade 3 to Grade 12.\n"
                    "- **Theme**: A specific tech/futuristic theme will be provided before the submission window.\n"
                    "- **Software**: Used software must be explicitly stated (Photoshop, Illustrator, Procreate, Krita, Blender, etc.).\n"
                    "- **Submission**: Both working project source files (.psd, .ai, .procreate, .blend) and high-res export image files (.png/.jpg) must be submitted via pendrive on the first day of the fest."
                ),
                'judging_criteria': "Creativity, thematic relevance, aesthetic appeal, technical composition, and typography.",
                'faqs': [
                    ("Can I use AI generated elements?", "No, all artwork must be original human illustration.")
                ]
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
                'description': 'Speed typing showdown powered by Monkeytype in the SJIS Computer Lab.',
                'rules': (
                    "- **Platform**: Monkeytype standard 60-second mode.\n"
                    "- **Warmup**: 5 minutes will be given for keyboard warmup.\n"
                    "- **Attempts**: 3 tries will be given to record the highest score.\n"
                    "- **Result**: Best of 3 WPM (Words Per Minute) with accuracy threshold will be recorded.\n"
                    "- Top 3 highest WPM scorers will be awarded medals and prizes."
                ),
                'judging_criteria': "Highest Net WPM and highest Accuracy percentage.",
                'faqs': [
                    ("Can I bring my own mechanical keyboard?", "Yes, you may bring your own USB keyboard.")
                ]
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
                'description': 'Theme-based slide deck creation and live on-stage presentation.',
                'rules': (
                    "- **Format**: Submission and live presentation based.\n"
                    "- **Theme**: A theme will be provided in advance.\n"
                    "- **Time Limit**: 5 minutes presentation + 2 minutes Q&A from judges.\n"
                    "- Slides must be submitted beforehand in .pptx or .pdf format."
                ),
                'judging_criteria': "Slide aesthetics, clarity of communication, stage presence, time management, and Q&A responses.",
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
                'description': 'Test your deep knowledge of video game lore, mechanics, esports, and gaming history across 3 rounds.',
                'rules': (
                    "### 3-Round Tournament Structure\n"
                    "- **Round 1 (Prelims)**: Written exam on paper in old building classroom based on provided syllabus.\n"
                    "- **Round 2 (Semi-Finals)**: Top qualifiers compete in stage round.\n"
                    "- **Round 3 (Grand Finals)**: Rapid buzzer and visual rounds on stage.\n\n"
                    "Questions cover PC, Console, Retro, Esports, and Game Development history."
                ),
                'judging_criteria': "Written score for prelims, direct point totals in buzzer/stage rounds.",
                'faqs': []
            },
            {
                'name': 'Webpage Creation',
                'slug': 'webpage-creation',
                'short_name': 'Webpage Creation',
                'category': 'CODING',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Computer Lab',
                'submission_type': 'LAB',
                'highlight': False,
                'icon': 'Globe',
                'description': 'Design and code a high-quality responsive website based on a prompt within the time limit.',
                'rules': (
                    "- HTML, CSS, JavaScript, and popular frontend libraries are allowed.\n"
                    "- Participants will be provided an on-the-spot theme/topic.\n"
                    "- Evaluation will be on design aesthetics, responsiveness, semantic structure, and interactivity."
                ),
                'judging_criteria': "Design quality, code structure, responsiveness across mobile & desktop, creativity.",
                'faqs': []
            },
            {
                'name': 'Game Sync Symphony (Gaming Montage & Anime MV)',
                'slug': 'game-sync-symphony',
                'short_name': 'Video Editing (Montage/AMV)',
                'category': 'DIGITAL_ART',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Main Stage Screening',
                'submission_type': 'PENDRIVE',
                'highlight': False,
                'icon': 'Film',
                'description': 'Dynamic video editing competition featuring gaming montages and anime music videos.',
                'rules': (
                    "### 2 Segments Included (1 Package - ৳300)\n"
                    "- **Segment 1**: Gaming Montage (Gameplay synchronization, beat matching, SFX, color grading).\n"
                    "- **Segment 2**: Anime MV (AMV) (Narrative pacing, typography, scene transitions).\n"
                    "- Participants may enter either segment or both for the single package fee of ৳300.\n"
                    "- Videos will be reviewed and shortlisted by judges before the final stage screening.\n"
                    "- Submission via pendrive / external HDD / SSD on Day 1 of the fest."
                ),
                'judging_criteria': "Audio-video sync, pacing, visual effects, storytelling, rendering quality (1080p/4K 60fps).",
                'faqs': []
            },
            {
                'name': 'Photography Competition',
                'slug': 'photography-competition',
                'short_name': 'Photography',
                'category': 'CREATIVE',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 200,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D', 'E'],
                'venue_detail': 'Exhibition Gallery',
                'submission_type': 'PHYSICAL',
                'highlight': True,
                'icon': 'Camera',
                'description': 'Capture striking visual moments and showcase your work in the prestigious carnival photo exhibition.',
                'rules': (
                    "### Submission & Exhibition Guidelines\n"
                    "1. **Photograph Size**: Must be printed in **7 × 9 inches (18 × 23 cm)** size.\n"
                    "2. **Printing & Lamination**: Each student must submit **one hardcopy per photograph (up to 2 photographs per participant)**. The photograph must be **properly laminated** by the student before submission. Do NOT mount on cardboard, foam board, or frame.\n"
                    "3. **Display**: All photographs will be hung with clips in the exhibition gallery.\n"
                    "4. **Information on BACK SIDE**:\n"
                    "   - Student’s Name\n"
                    "   - Class & Section / University Dept\n"
                    "   - House / Institution\n"
                    "   - Title of the Photograph\n"
                    "5. **Scoring**: 2 photos submitted per participant, each rated 0–10 (Total out of 20 marks)."
                ),
                'judging_criteria': "Composition, lighting, emotional resonance, technical sharpness, storytelling.",
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
                'description': 'Deep dive analytical article writing on trending technology, AI ethics, cybersecurity, and future computing.',
                'rules': (
                    "- Individual event (৳300).\n"
                    "- Word count: 600–1000 words.\n"
                    "- Topics will be released on the day or submitted prior as announced."
                ),
                'judging_criteria': "Depth of research, clarity of thought, grammatical precision, technical accuracy.",
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
                'description': 'Battle of intellect across computer science, frontier tech, inventions, and tech giants.',
                'rules': (
                    "### 2 Rounds\n"
                    "- **Round 1 (Written)**: 30 marks paper exam. Top 10 participants will be selected. Time of submission matters (earlier submission breaks ties).\n"
                    "- **Round 2 (Finals)**: Live on-stage buzzer round to determine 1st, 2nd, and 3rd place champions."
                ),
                'judging_criteria': "Accuracy of answers, speed of submission, buzzer round reaction time.",
                'faqs': []
            },
            {
                'name': 'Tech Meme Contest',
                'slug': 'tech-meme',
                'short_name': 'Tech Meme',
                'category': 'CREATIVE',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D', 'E'],
                'venue_detail': 'Online Submission',
                'submission_type': 'ONLINE',
                'highlight': False,
                'icon': 'Smile',
                'description': 'Show off your tech humor and relatability through original programming, IT, and student life memes.',
                'rules': (
                    "- Must be original content created by the participant.\n"
                    "- Memes must strictly adhere to school-appropriate humor (no vulgarity or targeted harassment)."
                ),
                'judging_criteria': "Humor, relatability, creativity, visual template execution.",
                'faqs': []
            },
            {
                'name': "Rubik's Cube Speedcubing",
                'slug': 'rubiks-cube',
                'short_name': "Rubik's Cube",
                'category': 'OTHER',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 200,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Speedcubing Arena',
                'submission_type': 'PHYSICAL',
                'highlight': False,
                'icon': 'Box',
                'description': 'Fast-paced 3x3 speedcubing tournament with official WCA timer inspection rules.',
                'rules': (
                    "- Official 3x3 cube scramble.\n"
                    "- 15 seconds inspection time.\n"
                    "- Average of 5 solves (Ao5) format to decide top podium finishers."
                ),
                'judging_criteria': "Fastest single solve and Ao5 times recorded via stackmat timer.",
                'faqs': []
            },
            {
                'name': 'Treasure Hunt',
                'slug': 'treasure-hunt',
                'short_name': 'Treasure Hunt',
                'category': 'OTHER',
                'event_type': 'TEAM',
                'individual_fee': 0,
                'team_fee': 500,
                'team_min': 3,
                'team_max': 3,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'SJIS Campus Grounds',
                'submission_type': 'PHYSICAL',
                'highlight': True,
                'icon': 'Compass',
                'description': 'Campus-wide tech riddle and cryptic clue solving expedition in teams of 3.',
                'rules': (
                    "- Team size: Exactly 3 members per team (৳500 per team).\n"
                    "- Teams must solve cryptographic clues, QR codes, and tech riddles hidden across campus.\n"
                    "- First team to decrypt the final master vault wins."
                ),
                'judging_criteria': "Fastest team to complete all clue checkpoints and return with the final artifact.",
                'faqs': []
            },
            {
                'name': 'Valorant (E-Sports Tournament)',
                'slug': 'valorant-esports',
                'short_name': 'Valorant (5v5)',
                'category': 'ESPORTS',
                'event_type': 'TEAM',
                'individual_fee': 0,
                'team_fee': 500,
                'team_min': 5,
                'team_max': 6,
                'groups': ['C', 'D', 'E'],
                'venue_detail': 'Online (Prelims) & Main Stage LAN (Semis/Finals)',
                'submission_type': 'MIXED',
                'highlight': True,
                'icon': 'Crosshair',
                'description': '5v5 tactical shooter showdown. Knockout stages online, Semis and Grand Finals hosted on stage LAN with live broadcast.',
                'rules': (
                    "### Tournament Structure\n"
                    "- **Format**: Single-elimination knockouts.\n"
                    "- **Prelims**: Played online prior to LAN day.\n"
                    "- **Semi-Finals & Grand Finals**: Played live on stage on high-performance LAN rigs, live-streamed on official Facebook page.\n"
                    "- **Team**: 5 main players + 1 optional substitute.\n"
                    "- Standard competitive ruleset and map veto system."
                ),
                'judging_criteria': "Direct match victories based on official Riot Games tournament rulebook.",
                'faqs': [
                    ("Can we use our own peripherals on stage?", "Yes, keyboard, mouse, mousepad, and in-ear monitors are allowed on stage.")
                ]
            },
            {
                'name': 'EA FC (FIFA E-Sports)',
                'slug': 'eafc-esports',
                'short_name': 'EA FC (1v1)',
                'category': 'ESPORTS',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 200,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D', 'E'],
                'venue_detail': 'Gaming Arena (Fest Day)',
                'submission_type': 'PHYSICAL',
                'highlight': True,
                'icon': 'Trophy',
                'description': '1v1 EA Sports FC console championship. All knockout rounds played on LAN on the day of the fest.',
                'rules': (
                    "- **Format**: 1v1 knockout tournament.\n"
                    "- **Platform**: PlayStation 5 / PC LAN.\n"
                    "- All rounds will be held on LAN on the day of the fest.\n"
                    "- Semi-finals and Grand Finals presented on the main stage with live streaming."
                ),
                'judging_criteria': "Standard 6-minute halves with Extra Time and Penalties on tie.",
                'faqs': [
                    ("Can I bring my own controller?", "Yes, compatible DualSense / Xbox controllers are permitted.")
                ]
            },
            {
                'name': 'Robo Showcase (Project Display)',
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
                'description': 'Exhibition of autonomous, IoT, assistive, and embedded robotics innovations.',
                'rules': (
                    "- **Eligibility**: Group C, D, E (Grade 7 to University).\n"
                    "- **Fee**: ৳500 for Individual, ৳1000 for Team (Max 3 members).\n"
                    "- Hardware prototype must be functional and demonstrated live before the jury.\n"
                    "- A poster / schematic summary must accompany the project display."
                ),
                'judging_criteria': "Innovation, technical complexity, real-world utility, execution quality, and Q&A presentation.",
                'faqs': []
            },
            {
                'name': 'Line Follower Robot (LFR)',
                'slug': 'line-robot',
                'short_name': 'Line Follower Robot',
                'category': 'ROBOTICS',
                'event_type': 'BOTH',
                'individual_fee': 500,
                'team_fee': 1000,
                'team_min': 1,
                'team_max': 3,
                'groups': ['B', 'C', 'D', 'E'],
                'venue_detail': 'Robotics Arena Track',
                'submission_type': 'PHYSICAL',
                'highlight': False,
                'icon': 'Cpu',
                'description': 'Autonomous line following robot race across a complex black-line maze with obstacles and sharp curves.',
                'rules': (
                    "- **Eligibility**: Group B, C, D, E (Grade 5 to University).\n"
                    "- **Fee**: ৳500 individual / ৳1000 team (max 3 persons).\n"
                    "- Maximum robot dimensions: 25cm x 25cm x 25cm.\n"
                    "- Robot must autonomously follow the line without manual intervention.\n"
                    "- 2 trial runs given per robot; fastest clean run counts."
                ),
                'judging_criteria': "Track completion time minus checkpoint penalties.",
                'faqs': []
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
                'description': 'Custom drone manufacturing, aerodynamic stability, obstacle navigation, and precision landing showcase.',
                'rules': (
                    "- **Eligibility**: Group C & D (Grade 7 to Grade 12).\n"
                    "- **Fee**: ৳500 individual / ৳1000 team (max 3 persons).\n"
                    "- **Award**: Prestigious Winner Crest + Medals.\n"
                    "- Participants must build/configure their own drone and demonstrate controlled flight, obstacle maneuver, and target landing in the designated flight zone."
                ),
                'judging_criteria': "Flight stability, maneuver accuracy, build craftsmanship, pilot control, and safety adherence.",
                'faqs': []
            },
        ]

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

            self.stdout.write(self.style.SUCCESS(f'Seeded event [{idx}/19]: {event.name}'))

        self.stdout.write(self.style.SUCCESS('All 19 events seeded successfully!'))
