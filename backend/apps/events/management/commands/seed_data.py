from django.core.management.base import BaseCommand
from apps.events.models import Event, EventGroup, EventFAQ
from apps.core.models import School, SiteSettings
from datetime import date


class Command(BaseCommand):
    help = 'Seeds initial groups, schools, site settings, and all 17 carnival events'

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
        site.announcement_banner = '⚡ Registrations for SJIS Inter-School Tech Carnival 2026 are now open! Explore 17 exciting events and register today.'
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
                'groups': ['B', 'C', 'D', 'E'],
                'venue_detail': 'Computer Lab / On-Spot Arena',
                'submission_type': 'ONLINE',
                'highlight': True,
                'icon': 'Sparkles',
                'description': 'Based on a theme given on-spot, contestants use natural language prompting to generate an image that matches the style, composition, and subject as closely as possible. Open to Group B to E (Individual).',
                'rules': (
                    "### Task Description\n"
                    "Contestants are given a specific on-the-spot secret theme. They must generate an image that matches the style, composition, and subject of the theme as closely as possible.\n\n"
                    "### Grade Group Eligibility\n"
                    "- **Group B to Group E** (Grade 5 to University Level)\n"
                    "- **Participation:** Individual\n\n"
                    "### Participant Requirements\n"
                    "- **Own Device (BYOD):** Any hardware from: laptop, tablet, smartphone, or mini PC.\n"
                    "- **Internet Connection:** Must bring your own internet connectivity and must be logged into your preferred AI image generation platform prior to the event.\n\n"
                    "### Rules and Regulations\n"
                    "1. Must start a new chat or terminal session of the AI model for the competition.\n"
                    "2. Must not violate the host platform’s (major) safety guidelines (NSFW, extreme violence, etc.).\n"
                    "3. The prompt history must match the generated image. The prompts will be test-run by judges if any suspicion arises to validate prompt authenticity.\n"
                    "4. The prompt history must not include any other resource (such as uploaded images or files) other than text typed by the participant. Each instruction MUST be typed by the participant completely (autocorrect and suggestions are allowed; image-to-image cloning is forbidden).\n"
                    "5. Submission into the official Google Form link provided at the time of competition."
                ),
                'judging_criteria': (
                    "🏆 Judging Criteria (Total: 100 Marks)\n"
                    "• Prompt Effectiveness: 35 Marks\n"
                    "• Accuracy of Output: 25 Marks\n"
                    "• Creativity & Innovation: 20 Marks\n"
                    "• Prompt Structure & Clarity: 10 Marks\n"
                    "• Efficiency (Fewest Effective Prompts): 10 Marks"
                ),
                'faqs': [
                    ("Which AI platforms are permitted?", "Any major text-to-image generator including Midjourney, DALL-E 3, Stable Diffusion, Adobe Firefly, or Bing Image Creator."),
                    ("Can I upload reference pictures into the AI?", "No. Image-to-image cloning or uploaded files are strictly prohibited. All generation must be 100% prompt-driven from typed text.")
                ]
            },
            {
                'name': 'Tech-Art Bonanza (Digital Art & Banner)',
                'slug': 'tech-art-bonanza',
                'short_name': 'Tech-Art Bonanza',
                'category': 'DIGITAL_ART',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D', 'E'],
                'venue_detail': 'Art & Media Hall (Day 1 Submission)',
                'submission_type': 'PENDRIVE',
                'highlight': True,
                'icon': 'Palette',
                'description': 'Theme-based digital art & digital poster/banner submission. Submit high-res exports and raw layered project files. Open to Groups A to E (Grade 3 to University).',
                'rules': (
                    "### Task Description\n"
                    "Contestants will make an artwork or poster based on the given technology theme announced by the carnival committee.\n\n"
                    "### Grade Eligibility\n"
                    "- **Grade 3 to 12 & University Level** (Group A to Group E)\n\n"
                    "### Guidelines\n"
                    "- Art submissions must be hand-drawn digitally. Posters must be designed graphically.\n"
                    "- Submit the final image as well as the raw editable project file (e.g. .PSD, .AI, .Procreate, .KRA) for poster submissions (and raw files for art submissions where possible). Raw files are audited to check for layer authenticity.\n"
                    "- Submissions must be 100% original human work. AI generation is strictly prohibited.\n"
                    "- Using trademarked or copyrighted characters or assets is forbidden. Participants must use self-made assets or verified royalty-free ones.\n"
                    "- Submit the project folder through a physical pen drive on the first day of the fest.\n"
                    "- Participants must bring their physical artwork to the submission site on time if requested."
                ),
                'judging_criteria': (
                    "🏆 Judgement Criteria (Total: 100 Marks)\n"
                    "• Relevance to Theme: 30 Marks\n"
                    "• Creativity & Originality: 25 Marks\n"
                    "• Artistic Skill & Technique: 20 Marks\n"
                    "• Visual Appeal / Presentation: 15 Marks\n"
                    "• In-depth Message / Meaning: 10 Marks"
                ),
                'faqs': [
                    ("Are AI generative tools allowed?", "No. AI generation is strictly banned. Raw layered files are inspected by the jury.")
                ]
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
                'venue_detail': 'Exam Hall (Qualifiers) & Main Stage (Finals)',
                'submission_type': 'MIXED',
                'highlight': False,
                'icon': 'Gamepad2',
                'description': 'Video game lore, mechanics, esports history, and game architecture quiz. Features written OMR qualifiers followed by a thrilling live on-stage buzzer showdown.',
                'rules': (
                    "### Tournament Structure (2 Rounds)\n\n"
                    "#### 1. Qualifiers (Written OMR Round)\n"
                    "- Qualifiers will be conducted via an MCQ question paper, where participants fill out OMR answer sheets.\n"
                    "- Question paper comprises 20 questions for a total of 20 marks. Participants must attempt all 20 questions.\n"
                    "- The top 5 participants advance directly to the Finals.\n"
                    "- In case of a tie for position 5 and below having identical marks, a verbal buzzer round of 11 questions will decide the 5th finalist.\n\n"
                    "#### 2. Finals (On-Stage Buzzer Round)\n"
                    "- Held live on stage with a buzzer system.\n"
                    "- Participants with the most questions answered correctly out of the first 10 questions win the Finals.\n"
                    "- In case of a draw, an 11-question sudden-death buzzer round will decide the winner.\n\n"
                    "### Syllabus\n"
                    "- Video game lore, gaming history, game dev trivia, esports tournaments, and franchises.\n"
                    "- Tailored difficulty arranged according to academic groups (Group A to D)."
                ),
                'judging_criteria': (
                    "🏆 Judging Criteria\n"
                    "• Qualifiers: Score out of 20 marks on MCQ OMR script.\n"
                    "• Finals: Correct buzzer answers out of 10 stage rounds."
                ),
                'faqs': []
            },
            {
                'name': 'Swift-Type Blitz (Typing Competition)',
                'slug': 'swifttype-blitz',
                'short_name': 'Swift-Type Blitz',
                'category': 'TYPING',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 200,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'SJIS Computer Lab',
                'submission_type': 'LAB',
                'highlight': False,
                'icon': 'Keyboard',
                'description': 'Speed typing showdown on MonkeyType in the SJIS Computer Lab. Test your pure WPM and accuracy over 15-second bursts. Participants may bring their own keyboards.',
                'rules': (
                    "### Task Description\n"
                    "Participants will have timed attempts to type as fast as possible on MonkeyType in the computer lab.\n\n"
                    "### Grade Eligibility\n"
                    "- **Grade 3 to Grade 12** (Group A to Group D)\n\n"
                    "### Guidelines\n"
                    "- Participants are permitted to bring and plug in their own mechanical/membrane USB keyboards.\n"
                    "- The event will be held in the school computer lab on desktop workstations. Bringing personal laptops is not allowed.\n"
                    "- No auto-correct, macros, scripts, or copy-pasting.\n"
                    "- 5 minutes will be given before the competition for warming up.\n"
                    "- Each try will be a 15-second test. The best of attempts will be chosen for judging.\n\n"
                    "### Judging\n"
                    "- The participants with the 3 highest recorded WPMs will be awarded."
                ),
                'judging_criteria': "Net Words Per Minute (WPM) scored on MonkeyType, with Accuracy percentage as tie-breaker.",
                'faqs': [
                    ("Can I bring my own mechanical keyboard?", "Yes, participants are permitted to bring their own USB keyboards.")
                ]
            },
            {
                'name': 'Webpage Creation',
                'slug': 'html-webpage-creation',
                'short_name': 'Webpage Creation',
                'category': 'CODING',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'SJIS Computer Lab',
                'submission_type': 'LAB',
                'highlight': False,
                'icon': 'Globe',
                'description': 'Recreate a given reference webpage using pure HTML and CSS (including JS) in 30 minutes in the SJIS Computer Lab using offline code editors.',
                'rules': (
                    "### Task Description\n"
                    "Participants will have to recreate a given webpage using HTML and CSS (including JS) in 30 minutes.\n\n"
                    "### Grade Eligibility\n"
                    "- **Grade 3 to Grade 12** (Group A to Group D)\n\n"
                    "### Guidelines\n"
                    "- All participants must use an offline code editor (e.g. VS Code, Sublime Text, Notepad++).\n"
                    "- The event will be held in the school computer lab. Bringing your own device is not allowed.\n"
                    "- Any functionality in the reference webpage will be specified. Participants must recreate the functionality as accurately as possible.\n"
                    "- Making an extra JS file for functionality is allowed and must be included with the webpage submission files.\n"
                    "- No internet browsing or AI tools permitted during the challenge."
                ),
                'judging_criteria': (
                    "🏆 Judging Breakdown (Total: 100%)\n"
                    "• Visual & Structural Accuracy: 60%\n"
                    "• Interactive Functionality: 25%\n"
                    "• Code Quality & Structure: 15%"
                ),
                'faqs': []
            },
            {
                'name': 'Video Making Competition',
                'slug': 'game-sync-symphony',
                'short_name': 'Video Making',
                'category': 'DIGITAL_ART',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Art & Media Desk (Day 1) & Main Stage Screening',
                'submission_type': 'PENDRIVE',
                'highlight': False,
                'icon': 'Film',
                'description': 'Create an engaging thematic video or montage based on the festival tech theme. Maximum 5 minutes, 1080p MP4. Submit via pendrive on Day 1 for stage screening and evaluation.',
                'rules': (
                    "### Task Description\n"
                    "Participants must create a video based on the theme given and submit it on the first day of the fest.\n\n"
                    "### Grade Eligibility\n"
                    "- **Grade 3 to Grade 12** (Group A to Group D)\n\n"
                    "### General Guidelines\n"
                    "- The video must be based on the given theme.\n"
                    "- Offensive, copyrighted, or inappropriate content is prohibited.\n"
                    "- All footage and content must be original and theme-based.\n"
                    "- Submit the submission through a physical pen drive on Day 1.\n\n"
                    "### Video Format\n"
                    "- Duration: Not more than 5 minutes.\n"
                    "- Resolution: 1080p Full HD in .mp4 format.\n\n"
                    "### Student Information\n"
                    "The submitted pendrive folder should contain the video (.mp4) and a doc file (.doc/.pdf) with student personal info (Name, Class, Section, School, Group) and title of the video."
                ),
                'judging_criteria': (
                    "🏆 Judging Criteria (Auditorium Stage Screening)\n"
                    "• Theme Relevance: 40%\n"
                    "• Editing, Audio & Video Quality: 35%\n"
                    "• Creativity & Storytelling: 25%"
                ),
                'faqs': []
            },
            {
                'name': 'Photography Competition',
                'slug': 'photo-editing',
                'short_name': 'Photography',
                'category': 'CREATIVE',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 200,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D', 'E'],
                'venue_detail': 'Carnival Photo Gallery Exhibition',
                'submission_type': 'PHYSICAL',
                'highlight': True,
                'icon': 'Camera',
                'description': 'Theme-based photography exhibition. Strictly 7×9 inches (18×23 cm) laminated hardcopy submission with handwritten back-side information. Zero AI allowed.',
                'rules': (
                    "### Task Description\n"
                    "Participants must take photos based on the given theme and submit physical hardcopies on the first day of the fest.\n\n"
                    "### Grade Eligibility\n"
                    "- **Grade 3 to 12 & University Level** (Group A to Group E)\n\n"
                    "### Guidelines & Specifications\n"
                    "1. **Photograph Size:**\n"
                    "   - The photograph must be printed strictly in **7 × 9 inches (18 × 23 cm)** size.\n"
                    "   - This size is suitable for uniform handling and display using clips.\n"
                    "   - Do not submit photographs larger or smaller than the specified size.\n"
                    "2. **Printing & Mandatory Lamination:**\n"
                    "   - Each student must submit one hardcopy.\n"
                    "   - The photograph must be properly laminated by the student before submission.\n"
                    "   - **Do not mount** the photograph on cardboard, foam board, or a frame, as photos will be displayed using hanging clips.\n"
                    "3. **Student Information:**\n"
                    "   - Must be clearly written on the **BACK SIDE** of the photograph **before laminating it**:\n"
                    "     • Student’s Name\n"
                    "     • School / College / University Name\n"
                    "     • Class & Section\n"
                    "     • Group (A/B/C/D/E)\n"
                    "     • Title of the Photograph\n"
                    "4. **Display:**\n"
                    "   - All approved photographs will be displayed by hanging them with clips.\n"
                    "5. **Important Note & Anti-AI:**\n"
                    "   - Photographs that are not laminated, incorrectly sized, or missing student information will not be considered.\n"
                    "   - **NO AI Generated photos will be allowed.**"
                ),
                'judging_criteria': (
                    "🏆 Judging Criteria (Total: 100%)\n"
                    "• Theme Relevance: 40%\n"
                    "• Creativity & Originality: 30%\n"
                    "• Composition: 20%\n"
                    "• Technical Quality: 10%"
                ),
                'faqs': []
            },
            {
                'name': 'Tech Quiz (ICT Olympiad)',
                'slug': 'tech-quiz',
                'short_name': 'Tech Quiz',
                'category': 'QUIZ',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Exam Hall & Main Auditorium Stage',
                'submission_type': 'MIXED',
                'highlight': False,
                'icon': 'HelpCircle',
                'description': 'ICT Olympiad — Technology Quiz Competition. Features Round 1 Written exam, Round 2 Buzzer qualifier, and Round 3 Live Stage Final Buzzer with negative marking.',
                'rules': (
                    "### Overview\n"
                    "🧠 ICT Olympiad — Technology Quiz Competition. Individual competition.\n\n"
                    "### General Rules\n"
                    "- This is an individual competition across Groups A to D.\n"
                    "- Participants must report before the scheduled reporting time.\n"
                    "- Mobile phones, smartwatches, and all electronic devices are strictly prohibited.\n"
                    "- No communication between participants during any round. Any cheating results in immediate disqualification.\n\n"
                    "### Rules & Format (3 Rounds)\n"
                    "📝 **Round 1 — Written Round:**\n"
                    "- 10 comprehensive questions. Time limit: 30 minutes.\n"
                    "- Total Marks: 20 (1 mark for correct answer + 1 mark for correct and relevant explanation).\n\n"
                    "🔔 **Round 2 — Buzzer Round:**\n"
                    "- 20 questions answered using the buzzer system.\n"
                    "- Only the top 4 highest-scoring participants qualify for the final round.\n\n"
                    "⚡ **Round 3 — Final Buzzer Round:**\n"
                    "- Finalists compete on stage. **Negative marking will apply in this round.**\n"
                    "- Top 2 scorers at the end of the final round declared the winners."
                ),
                'judging_criteria': (
                    "🏆 Judging & Scoring\n"
                    "• Round 1: Max 20 marks.\n"
                    "• Round 2: Buzzer accuracy across 20 questions (top 4 advance).\n"
                    "• Round 3: High score with negative marking; top 2 winners."
                ),
                'faqs': []
            },
            {
                'name': 'Treasure Hunt (Code Zero)',
                'slug': 'treasure-hunt',
                'short_name': 'Treasure Hunt',
                'category': 'OTHER',
                'event_type': 'TEAM',
                'individual_fee': 0,
                'team_fee': 600,
                'team_min': 2,
                'team_max': 4,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'SJIS Campus (2nd & 3rd Floor + Stage)',
                'submission_type': 'STAGE',
                'highlight': True,
                'icon': 'Compass',
                'description': 'A mysterious hacker called ZERO has stolen the Tech Fest’s Golden Code. Recover all 5 code fragments hidden across campus before ZERO deletes them forever!',
                'rules': (
                    "### The Mission Brief\n"
                    "“A mysterious hacker called ZERO has stolen the Tech Fest’s Golden Code. The code has been split into 5 fragments and hidden across the campus. Your team has 60 minutes to recover all fragments before ZERO deletes them forever.”\n\n"
                    "### Eligibility & Teams\n"
                    "- Group A to Group D (Grade 3 to Grade 12)\n"
                    "- Teams of 2 to 4 participants (৳600 per team)\n\n"
                    "### How It Works (5 Rounds)\n"
                    "• **Round 1 — QR Hunt:** Place QR codes given in a paper to each team. Scanning each QR code reveals the room location on the 2nd and 3rd floor of the SJIS building.\n"
                    "• **Round 2 — Tech Puzzle:** Teams find a simple coding/debugging challenge on printed paper in designated rooms. The correct output gives a secret number.\n"
                    "• **Round 3 — Hidden Message:** Teams receive an image containing a hidden message using visual/steganographic clues.\n"
                    "• **Round 4 — Encryption Challenge:** Teams solve a riddle to obtain a decryption string. Entering it on a webpage terminal reveals a URL.\n"
                    "• **Final Round — The Treasure:** The URL provides a combination of Key and box number that opens the stage treasure box housing the Bitcoin / Golden Code."
                ),
                'judging_criteria': "Fastest team to verify all 5 code fragments and open the treasure chest within 60 minutes.",
                'faqs': []
            },
            {
                'name': 'Rubik’s Showdown (4×4 Speedcube)',
                'slug': 'rubiks-showdown',
                'short_name': 'Rubik’s Showdown',
                'category': 'OTHER',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 200,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Speedcubing Arena',
                'submission_type': 'PHYSICAL',
                'highlight': False,
                'icon': 'Box',
                'description': 'Official 4×4 Rubik’s Cube speed solving showdown. Standard 4×4 cubes scrambled by organizers. Fastest valid solving times take the podium.',
                'rules': (
                    "### Category\n"
                    "**4×4 Rubik’s Cube Competition**\n\n"
                    "### Grade Eligibility\n"
                    "- Grade 3 to 12 (Group A to Group D)\n\n"
                    "### Task\n"
                    "Participants must solve a standard 4×4 Rubik’s Cube within the given time. The participant with the fastest valid solving time will be ranked higher.\n\n"
                    "### Guidelines\n"
                    "1. **Cube Requirements:** Standard 4×4 cube only. Participants may bring their own 4×4 cube in proper working condition. Electronic or modified advantage cubes strictly banned.\n"
                    "2. **Scrambling:** Each cube will be scrambled by organizers/judges. Participants must not observe the scrambling process.\n"
                    "3. **Procedure:** Timing begins on official signal. A cube is considered solved only when all six faces are completely solved with respective colours.\n"
                    "4. **Timing:** Best valid solving time considered for final ranking.\n"
                    "5. **Fair Play:** No external notes, algorithms, or devices allowed during solving."
                ),
                'judging_criteria': "Fastest single valid 4×4 solve time recorded by official timer.",
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
                'description': 'Individual presentation contest using Microsoft PowerPoint. Choose exactly one assigned topic for your academic group. Strict human-created rule; no AI-generated slide decks.',
                'rules': (
                    "### Competition Type: Individual Competition\n"
                    "- Grade 3 to 12 (Group A to Group D)\n\n"
                    "### Official Presentation Topics (Choose ONLY ONE for your Group):\n\n"
                    "**Group-A (Grade 3–4):**\n"
                    "1. Introduction to Computer\n"
                    "2. History of Computer\n"
                    "3. History of Internet\n\n"
                    "**Group-B (Grade 5–6):**\n"
                    "1. Introduction to coding\n"
                    "2. 3D printing in education, medicine and industry\n"
                    "3. Wearable technology\n\n"
                    "**Group-C (Grade 7–8):**\n"
                    "1. The magic of animation\n"
                    "2. Technology in space\n"
                    "3. The technology behind virtual reality (AR vs VR)\n\n"
                    "**Group-D (Grade 9–12 / A2):**\n"
                    "1. The anatomy of a Digital Footprint\n"
                    "2. Generative AI vs Human Creativity\n"
                    "3. Cybersecurity Threats and Prevention\n\n"
                    "### Guidelines\n"
                    "- Must be created using Microsoft PowerPoint (.pptx format).\n"
                    "- **AI-generated presentations or fully AI-generated content will not be allowed.**\n"
                    "- Must clearly provide: Participant’s Name, School Name, Class & Section, Group (A/B/C/D), and Presentation Title."
                ),
                'judging_criteria': (
                    "🏆 Judging Criteria\n"
                    "• Relevance to topic & content depth\n"
                    "• Slide design & visual appeal\n"
                    "• Effective use of PowerPoint features\n"
                    "• Stage delivery, communication & time management"
                ),
                'faqs': []
            },
            {
                'name': 'Tech Bytes (Tech Article Writing)',
                'slug': 'tech-bytes',
                'short_name': 'Tech Bytes',
                'category': 'CREATIVE',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Examination Hall',
                'submission_type': 'PHYSICAL',
                'highlight': False,
                'icon': 'FileText',
                'description': 'On-the-spot technology-related article writing in English. Secret theme announced at venue. Evaluated on depth of thought, clarity, and grammatical precision.',
                'rules': (
                    "### Competition Type: Individual On-the-Spot Writing\n"
                    "- Grade 3 to 12 (Group A to Group D)\n\n"
                    "### Task & Guidelines\n"
                    "- Participants will write a technology-related article on the spot based on a topic/theme announced at the venue.\n"
                    "- All articles must be written in **English** within the allocated competition time.\n"
                    "- Must include title, introduction, main content, and conclusion with practical tech examples.\n"
                    "- Word limit will be announced before writing begins.\n"
                    "- Organizers provide official writing paper. Participants bring pens.\n"
                    "- Header must clearly list: Student's Name, School, Class & Section, Group (A/B/C/D), and Article Title."
                ),
                'judging_criteria': (
                    "🏆 Judging Criteria\n"
                    "• Relevance to topic & quality of ideas\n"
                    "• Structure, flow & paragraph organization\n"
                    "• Language, grammar & clarity of expression"
                ),
                'faqs': []
            },
            {
                'name': 'Tech Meme Competition',
                'slug': 'tech-memes',
                'short_name': 'Tech Memes',
                'category': 'CREATIVE',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Online Submission & Screening',
                'submission_type': 'ONLINE',
                'highlight': False,
                'icon': 'Smile',
                'description': 'Individual submission of original programming, computer science, and digital technology humor. Every meme undergoes strict screening and plagiarism audit before judging.',
                'rules': (
                    "### Competition Type: Individual / Submission-Based\n"
                    "- Grade 3 to 12 (Group A to Group D)\n\n"
                    "### Guidelines & Screening Process\n"
                    "- All submitted memes will first go through a **screening and auditing process** for appropriateness and originality before shortlisting.\n"
                    "- Must be related to technology, programming, AI, robotics, or digital student life.\n"
                    "- Each participant may submit **one meme only** in JPG, JPEG, or PNG.\n"
                    "- Must be the original creative work of the participant. Submissions found to contain unauthorized or directly copied content will be disqualified.\n"
                    "- Provide: Student's Name, School, Class & Section, Group (A/B/C/D), and Caption of the Meme."
                ),
                'judging_criteria': (
                    "🏆 Judging Criteria\n"
                    "• Creativity and humor\n"
                    "• Relevance to technology & CS culture\n"
                    "• Originality of concept (audited against reposts)\n"
                    "• Visual presentation and clarity"
                ),
                'faqs': []
            },
            {
                'name': 'Line Robot Showcase (BDRO)',
                'slug': 'line-robot',
                'short_name': 'Line Robot (BDRO)',
                'category': 'ROBOTICS',
                'event_type': 'BOTH',
                'individual_fee': 300,
                'team_fee': 1000,
                'team_min': 1,
                'team_max': 3,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'Robotics Arena Track',
                'submission_type': 'PHYSICAL',
                'highlight': False,
                'icon': 'Cpu',
                'description': 'BDRO Line-Following Robot race across a precision track. Robots must navigate fully autonomously and adhere to strict 25cm × 25cm × 25cm dimensional bounds.',
                'rules': (
                    "### BDRO Line-Following Competition\n"
                    "- Grade 3 to 12 (Group A to Group D)\n"
                    "- Individual (৳300) or Team of up to 3 (৳1000)\n\n"
                    "### Guidelines (BDRO Rules)\n"
                    "- **Dimensions:** The robot **cannot exceed dimensions 25cm × 25cm × 25cm**.\n"
                    "- **Autonomous Operation:** The robot must move autonomously after the run starts. No physical contact or electronic/wireless communication with the robot is allowed.\n"
                    "- If the robot leaves the track, a time penalty will be applied as decided by the judges.\n"
                    "- Any misconduct results in disqualification.\n"
                    "- The robots with the fastest times will be awarded. Ties handled by preferring the smaller/lighter robot."
                ),
                'judging_criteria': "Fastest course completion time minus track penalties. Smaller/lighter robot wins ties.",
                'faqs': []
            },
            {
                'name': 'Drone Competition (BDRO)',
                'slug': 'drone-competition',
                'short_name': 'Drone Competition (BDRO)',
                'category': 'ROBOTICS',
                'event_type': 'BOTH',
                'individual_fee': 500,
                'team_fee': 1000,
                'team_min': 1,
                'team_max': 3,
                'groups': ['C', 'D', 'E'],
                'venue_detail': 'Open Field Drone Flight Arena',
                'submission_type': 'STAGE',
                'highlight': True,
                'icon': 'Plane',
                'description': 'BDRO Drone Obstacle Course navigation. Pilots maneuver custom drones through gates, hoops, and checkpoints. Strict flight zone boundaries and penalty rules apply.',
                'rules': (
                    "### BDRO Drone Challenge\n"
                    "- Grade 7 to 12 & University Level (Group C to Group E)\n"
                    "- Individual (৳500) or Team of up to 3 (৳1000)\n\n"
                    "### Guidelines (BDRO Rules)\n"
                    "- Participants must bring their own drones complying with safety limits.\n"
                    "- All drones must stay in the designated competition flight arena.\n"
                    "- Missing a checkpoint or colliding with an obstacle results in a **5-second time penalty**.\n"
                    "- Sabotaging other participants’ drones, colliding with them, or leaving the flight zone will result in disqualification.\n"
                    "- Participants entering the active flight zone without permission will be disqualified.\n"
                    "- The drones with the fastest times will be awarded. Ties handled by redoing the course."
                ),
                'judging_criteria': "Fastest obstacle course time (flight time + penalty seconds).",
                'faqs': []
            },
            {
                'name': 'Coding Marathon (BDRO)',
                'slug': 'coding-marathon',
                'short_name': 'Coding Marathon (BDRO)',
                'category': 'CODING',
                'event_type': 'INDIVIDUAL',
                'individual_fee': 300,
                'team_fee': 0,
                'groups': ['A', 'B', 'C', 'D'],
                'venue_detail': 'SJIS Computer Lab',
                'submission_type': 'LAB',
                'highlight': True,
                'icon': 'Code',
                'description': 'Algorithmic programming and competitive problem solving in the SJIS Computer Lab across junior and senior tiers (Scratch for A/B, Python/C++ for C/D).',
                'rules': (
                    "### BDRO Coding Marathon\n"
                    "- Grade 3 to Grade 12 (Group A to Group D)\n\n"
                    "### Segment Breakdown\n"
                    "- **Group A (Grade 3–4):** Scratch block-based visual coding challenges.\n"
                    "- **Group B (Grade 5–6):** Scratch algorithmic problem solving and logic.\n"
                    "- **Group C (Grade 7–8):** Python algorithmic challenge.\n"
                    "- **Group D (Grade 9–12 / A2):** Python / C++ competitive programming contest.\n\n"
                    "### Regulations\n"
                    "- Held in the SJIS Computer Lab.\n"
                    "- AI code generation assistants are strictly blocked and forbidden.\n"
                    "- All standard language libraries permitted."
                ),
                'judging_criteria': "Automated test cases passed, code efficiency, and submission time penalties.",
                'faqs': []
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
                'venue_detail': 'Robotics & Hardware Exhibition Arena',
                'submission_type': 'STAGE',
                'highlight': True,
                'icon': 'Bot',
                'description': 'Robot Display & Hardware Innovation. Showcase functional IoT, robotics, automation, and AI hardware projects live before the expert jury panel.',
                'rules': (
                    "### Hardware Innovation Showcase\n"
                    "- Group C, D, E (Grade 7 to University 4th Year)\n"
                    "- Individual (৳500) | Team of max 3 members (৳1000)\n"
                    "- Hardware prototype must be functional and demonstrated live before the jury.\n"
                    "- Award: Prestigious Winner Crest + Certificate."
                ),
                'judging_criteria': "Innovation, technical complexity, live prototype demonstration, and jury defense.",
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
