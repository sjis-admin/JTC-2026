import { EventItem, EventGroup } from './api';

export const ACADEMIC_GROUPS: Record<string, EventGroup> = {
  A: { id: 1, code: 'A', label: 'Group A', grade_range: 'Grade 3 to Grade 4' },
  B: { id: 2, code: 'B', label: 'Group B', grade_range: 'Grade 5 to Grade 6' },
  C: { id: 3, code: 'C', label: 'Group C', grade_range: 'Grade 7 to Grade 8' },
  D: { id: 4, code: 'D', label: 'Group D', grade_range: 'Grade 9 to Grade 12 (A2/HSC)' },
  E: { id: 5, code: 'E', label: 'Group E', grade_range: 'University Students (Bachelors 1st–4th Year)' },
};

export interface RubricItem {
  criteria: string;
  marks: number | string;
}

export interface PowerPointTopicGroup {
  group: string;
  grades: string;
  topics: string[];
}

export const PPT_TOPICS_BY_GROUP: PowerPointTopicGroup[] = [
  {
    group: 'Group A',
    grades: 'Grade 3 to Grade 4',
    topics: [
      '1. Introduction to Computer',
      '2. History of Computer',
      '3. History of Internet',
    ],
  },
  {
    group: 'Group B',
    grades: 'Grade 5 to Grade 6',
    topics: [
      '1. Introduction to coding',
      '2. 3D printing in education, medicine and industry',
      '3. Wearable technology',
    ],
  },
  {
    group: 'Group C',
    grades: 'Grade 7 to Grade 8',
    topics: [
      '1. The magic of animation',
      '2. Technology in space',
      '3. The technology behind virtual reality (AR vs VR)',
    ],
  },
  {
    group: 'Group D',
    grades: 'Grade 9 to Grade 12 (A2 / HSC)',
    topics: [
      '1. The anatomy of a Digital Footprint',
      '2. Generative AI vs Human Creativity',
      '3. Cybersecurity Threats and Prevention',
    ],
  },
];

export const TREASURE_HUNT_ROUNDS = [
  {
    round: 'Round 1 — QR Hunt',
    detail: 'Place QR codes given in a paper to each team. Scanning each QR code reveals the room location on the 2nd and 3rd floor of the SJIS building.',
  },
  {
    round: 'Round 2 — Tech Puzzle',
    detail: 'Teams tackle a simple coding/debugging challenge presented on printed paper in the designated rooms. The correct program output yields a secret number.',
  },
  {
    round: 'Round 3 — Hidden Message',
    detail: 'Teams are provided with an image containing an encrypted message hidden through clever visual clues and steganographic patterns.',
  },
  {
    round: 'Round 4 — Encryption Challenge',
    detail: 'Teams solve a tech riddle to obtain a decryption key. Entering it on a dedicated terminal webpage unlocks a classified destination URL.',
  },
  {
    round: 'Final Round — The Treasure',
    detail: 'The URL provides the final combination of Key and Box number that opens the stage treasure chest housing the carnival Golden Code / Bitcoin.',
  },
];

export const CARNIVAL_EVENTS: EventItem[] = [
  {
    id: 1,
    name: 'AI Prompting',
    slug: 'ai-prompting',
    short_name: 'AI Prompting',
    category: 'AI',
    event_type: 'INDIVIDUAL',
    individual_fee: 200,
    team_fee: 0,
    team_min: 1,
    team_max: 1,
    eligibility_groups: [ACADEMIC_GROUPS.B, ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D, ACADEMIC_GROUPS.E],
    submission_type: 'ONLINE',
    venue_detail: 'Computer Lab / On-Spot Arena',
    is_active: true,
    highlight: true,
    icon: 'Sparkles',
    fee_display: '৳200',
    registered_count: 0,
    order: 1,
    description:
      'Based on a theme given on-spot, contestants use natural language prompting to generate an image that matches the style, composition, and subject as closely as possible. Open to Group B to E (Individual).',
    rules: `### Task Description
Based on an on-the-spot secret theme, contestants must craft text prompts to generate an image matching the style, composition, and subject of the theme as closely as possible.

### Grade Eligibility
- **Group B to Group E** (Grade 5 to University 4th Year)
- Individual participation only

### Participant Requirements
- **Own Device (BYOD):** Any hardware from: laptop, tablet, smartphone, or mini PC.
- **Internet Connection:** Must bring your own mobile data/hotspot connection.
- **Pre-Login:** Must be logged into preferred AI image generation platform (e.g. Midjourney, DALL-E, Stable Diffusion, Firefly, Bing Image Creator) prior to the event start.

### Rules & Regulations
1. **New Session:** Must start a fresh chat or terminal of the AI model specifically for the competition.
2. **Safety Compliance:** Must not violate the host platform’s major safety guidelines (NSFW, extreme violence, etc.).
3. **Reproducibility Check:** The prompt history must match the generated image. Prompts will be test-run by judges if any suspicion arises to validate prompt authenticity.
4. **Text-Only Rule:** The prompt history must NOT include any uploaded image or file other than text typed by the participant. Each instruction MUST be typed by the participant completely (autocorrect and suggestions are allowed; image-to-image cloning is prohibited).
5. **Submission:** Completed output and prompt history must be submitted via the official Google Form link provided at competition time.`,
    judging_criteria: "",
    faqs: [
      {
        question: 'Which AI platforms are permitted?',
        answer: 'Any major text-to-image platform including Midjourney, DALL-E 3, Stable Diffusion, Adobe Firefly, or Microsoft Copilot / Designer.',
      },
      {
        question: 'Can I upload reference pictures into the AI?',
        answer: 'No. Image-to-image inputs or uploaded files are strictly forbidden. All generation must be 100% prompt-driven from typed text.',
      },
    ],
  },
  {
    id: 2,
    name: 'Tech-Art Bonanza (Digital Art & Banner)',
    slug: 'tech-art-bonanza',
    short_name: 'Tech-Art Bonanza',
    category: 'DIGITAL_ART',
    event_type: 'INDIVIDUAL',
    individual_fee: 300,
    team_fee: 0,
    team_min: 1,
    team_max: 1,
    eligibility_groups: [ACADEMIC_GROUPS.A, ACADEMIC_GROUPS.B, ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D, ACADEMIC_GROUPS.E],
    submission_type: 'PENDRIVE',
    venue_detail: 'Art & Media Hall (Day 1 Submission)',
    is_active: true,
    highlight: true,
    icon: 'Palette',
    fee_display: '৳300',
    registered_count: 0,
    order: 2,
    description:
      'Theme-based digital art & digital poster/banner submission. Submit high-res exports and raw layered project files. Open to Groups A to E (Grade 3 to University).',
    rules: `### Task Description
Contestants will create an artwork or poster based on the given technology theme announced by the carnival committee.

### Grade Eligibility
- **Grade 3 to 12 & University Level** (Group A to Group E)

### Guidelines
- **Art vs Poster:** Art submissions must be hand-drawn digitally. Posters must be graphically designed.
- **Raw File Verification:** Submit the final image as well as the raw editable project file (e.g. .PSD, .AI, .Procreate, .KRA, .CLIP) for poster submissions (and raw files for art submissions where possible). Raw files are audited by judges to verify authenticity and layers.
- **Originality & Anti-AI:** Submissions must be 100% human-created. AI-generated elements are strictly prohibited.
- **Copyright:** Using trademarked or copyrighted characters or assets is forbidden. Participants must use self-made assets or verified royalty-free elements.
- **Submission Mode:** Submit the project folder via pen drive on the first day of the fest at the submission desk.
- Participants must bring their physical artwork print/display to the submission site on time if requested.`,
    judging_criteria: "",
    faqs: [
      {
        question: 'Are AI tools allowed for digital art?',
        answer: 'No. Any use of AI generative fill, diffusion backgrounds, or AI art tools will lead to immediate disqualification. Raw layered files are checked.',
      },
    ],
  },
  {
    id: 3,
    name: 'Gaming Quiz',
    slug: 'gaming-quiz',
    short_name: 'Gaming Quiz',
    category: 'GAMING',
    event_type: 'INDIVIDUAL',
    individual_fee: 300,
    team_fee: 0,
    team_min: 1,
    team_max: 1,
    eligibility_groups: [ACADEMIC_GROUPS.A, ACADEMIC_GROUPS.B, ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D],
    submission_type: 'MIXED',
    venue_detail: 'Exam Hall (Qualifiers) & Main Stage (Finals)',
    is_active: true,
    highlight: false,
    icon: 'Gamepad2',
    fee_display: '৳300',
    registered_count: 0,
    order: 3,
    description:
      'Video game lore, mechanics, esports history, and game architecture quiz. Features written OMR qualifiers followed by a thrilling live on-stage buzzer showdown.',
    rules: `### Tournament Structure (2 Rounds)

#### 1. Qualifiers (OMR Written Round)
- Conducted via an MCQ question paper where participants fill out OMR answer sheets.
- Question paper comprises 20 questions for a total of 20 marks.
- Participants must attempt all 20 questions within the allotted time.
- **Advancement:** The top 5 participants from the Qualifiers advance directly to the Finals.
- **Tie-Breaker:** In case participants from position 5 and below have exact identical scores, a live verbal buzzer round of 11 sudden-death questions will decide the 5th finalist.

#### 2. Finals (On-Stage Buzzer Round)
- Held live on the carnival main stage with a buzzer system.
- Participants with the most questions answered correctly out of the first 10 questions will win the Finals.
- **Draw Rule:** In case of a draw for podium positions, an 11-question sudden-death buzzer round will decide the champion.

### Syllabus
- Video game history, game development trivia, iconic franchises, esports championships, console hardware, and character lore.
- Tailored difficulty arranged according to academic groups (Group A to D).`,
    judging_criteria: "",
    faqs: [],
  },
  {
    id: 4,
    name: 'Swift-Type Blitz (Typing Competition)',
    slug: 'swifttype-blitz',
    short_name: 'Swift-Type Blitz',
    category: 'TYPING',
    event_type: 'INDIVIDUAL',
    individual_fee: 200,
    team_fee: 0,
    team_min: 1,
    team_max: 1,
    eligibility_groups: [ACADEMIC_GROUPS.A, ACADEMIC_GROUPS.B, ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D],
    submission_type: 'LAB',
    venue_detail: 'SJIS Computer Lab',
    is_active: true,
    highlight: false,
    icon: 'Keyboard',
    fee_display: '৳200',
    registered_count: 0,
    order: 4,
    description:
      'High-octane speed typing showdown on MonkeyType in the SJIS Computer Lab. Test your pure WPM and accuracy over 15-second bursts. Participants may bring their own keyboards.',
    rules: `### Task Description
Participants will have timed attempts on MonkeyType to type as rapidly and accurately as possible in the school computer lab.

### Grade Eligibility
- **Grade 3 to Grade 12** (Group A to Group D)

### Guidelines
- **Keyboards:** Participants are permitted to bring and plug in their own mechanical/membrane USB keyboards.
- **Venue Hardware:** The competition takes place on SJIS Computer Lab desktop workstations. Bringing personal laptops or computers is not permitted.
- **Fair Play:** Auto-correct, automated scripts, macros, and copy-pasting are strictly banned.
- **Warm-Up:** A 5-minute warm-up period is provided before the official competition begins.
- **Format:** Each try is a 15-second speed test. The best of five attempts will be recorded for official ranking.

### Judging & Awards
- The contestants with the 3 highest recorded Net Words Per Minute (WPM) will be awarded official carnival medals and certificates.`,
    judging_criteria: "",
    faqs: [
      {
        question: 'Can I bring my custom mechanical keyboard?',
        answer: 'Yes, contestants are welcome to bring their own USB wired or wireless keyboards.',
      },
    ],
  },
  {
    id: 5,
    name: 'Webpage Creation',
    slug: 'html-webpage-creation',
    short_name: 'Webpage Creation',
    category: 'CODING',
    event_type: 'INDIVIDUAL',
    individual_fee: 300,
    team_fee: 0,
    team_min: 1,
    team_max: 1,
    eligibility_groups: [ACADEMIC_GROUPS.A, ACADEMIC_GROUPS.B, ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D],
    submission_type: 'LAB',
    venue_detail: 'SJIS Computer Lab',
    is_active: true,
    highlight: false,
    icon: 'Globe',
    fee_display: '৳300',
    registered_count: 0,
    order: 5,
    description:
      'Recreate a given reference webpage using pure HTML and CSS (including JS) in 30 minutes in the SJIS Computer Lab using offline code editors.',
    rules: `### Task Description
Participants will have to recreate a given target webpage using HTML and CSS (including JavaScript where needed) within 30 minutes.

### Grade Eligibility
- **Grade 3 to Grade 12** (Group A to Group D)

### Guidelines
- **Offline Environment:** All participants must code using an offline code editor (VS Code, Sublime Text, or Notepad++).
- **Lab Setup:** The event will be held in the school computer lab. Bringing personal laptops is not allowed.
- **Functionality:** Any interactive functionality in the reference webpage will be specified. Participants must recreate the visual structure and behavior as accurately as possible.
- **Script Files:** Creating an extra separate JavaScript file (.js) for interactivity is allowed and must be included in the submission folder.
- **No Internet Assistance:** External templates, AI tools, or internet browsing are blocked during the contest.`,
    judging_criteria: "",
    faqs: [
      {
        question: 'Can I use CSS frameworks like Bootstrap or Tailwind?',
        answer: 'No CDN access is available; pure vanilla HTML5, CSS3, and JavaScript must be used in the offline environment.',
      },
    ],
  },
  {
    id: 6,
    name: 'Video Making Competition',
    slug: 'game-sync-symphony',
    short_name: 'Video Making',
    category: 'DIGITAL_ART',
    event_type: 'INDIVIDUAL',
    individual_fee: 300,
    team_fee: 0,
    team_min: 1,
    team_max: 1,
    eligibility_groups: [ACADEMIC_GROUPS.A, ACADEMIC_GROUPS.B, ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D],
    submission_type: 'PENDRIVE',
    venue_detail: 'Art & Media Desk (Day 1) & Main Stage Screening',
    is_active: true,
    highlight: false,
    icon: 'Film',
    fee_display: '৳300',
    registered_count: 0,
    order: 6,
    description:
      'Create an engaging thematic video or montage based on the festival tech theme. Maximum 5 minutes, 1080p MP4. Submit via pendrive on Day 1 for stage screening and evaluation.',
    rules: `### Task Description
Participants must produce an original video based on the carnival technology theme and submit it on the first day of the fest.

### Grade Eligibility
- **Grade 3 to Grade 12** (Group A to Group D)

### General Guidelines
- The video must be strictly based on the assigned tech theme.
- Offensive, copyrighted, or inappropriate footage/audio is strictly prohibited.
- All footage and content must be original and theme-oriented.
- Submission must be turned in via a physical pen drive on Day 1.

### Video Technical Format
- **Duration:** Not more than 5 minutes.
- **Resolution:** Full HD 1080p (1920×1080).
- **Format:** MP4 container.

### Submission Folder Structure
The submitted pendrive folder must contain:
1. The video file (.mp4).
2. A document file (.doc / .pdf) containing the student's full personal info (Name, Class, Section, School, Group) and the title/concept of the video.`,
    judging_criteria: "",
    faqs: [],
  },
  {
    id: 7,
    name: 'Photography Competition',
    slug: 'photo-editing',
    short_name: 'Photography',
    category: 'CREATIVE',
    event_type: 'INDIVIDUAL',
    individual_fee: 200,
    team_fee: 0,
    team_min: 1,
    team_max: 1,
    eligibility_groups: [ACADEMIC_GROUPS.A, ACADEMIC_GROUPS.B, ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D, ACADEMIC_GROUPS.E],
    submission_type: 'PHYSICAL',
    venue_detail: 'Carnival Photo Gallery Exhibition',
    is_active: true,
    highlight: true,
    icon: 'Camera',
    fee_display: '৳200',
    registered_count: 0,
    order: 7,
    description:
      'Theme-based photography exhibition. Strictly 7×9 inches (18×23 cm) laminated hardcopy submission with handwritten back-side information. Zero AI allowed.',
    rules: `### Task Description
Participants must take original photographs based on the festival theme and submit hardcopies on the first day of the tech carnival.

### Grade Eligibility
- **Grade 3 to 12 & University Level** (Group A to Group E)

### Strict Print & Submission Specifications
1. **Photograph Dimensions:**
   - Must be printed strictly in **7 × 9 inches (18 × 23 cm)** size.
   - This exact size is required for uniform hanging and display using hanging clips.
   - Do NOT submit photographs larger or smaller than this dimension.

2. **Printing & Mandatory Lamination:**
   - Each student must submit one hardcopy of the photograph.
   - The photograph must be **properly laminated by the student before submission**.
   - **DO NOT mount** the photograph on cardboard, foam board, or a frame, as photos are hung with clips.

3. **Student Information (Back Side):**
   - The following information must be clearly written on the **BACK SIDE** of the photograph **BEFORE laminating**:
     • Student’s Full Name
     • School / College / University Name
     • Class & Section
     • Group (A / B / C / D / E)
     • Title of the Photograph

4. **Exhibition Display:**
   - All approved photographs will be displayed suspended with gallery clips in the exhibition hall.
   - Photographs that are unlaminated, incorrectly sized, or missing student information will be disqualified.

5. **Anti-AI Policy:**
   - **NO AI-generated or AI-synthesized photos will be allowed.** Submissions must be captured with a camera or phone by the participant.`,
    judging_criteria: "",
    faqs: [
      {
        question: 'Can I frame my photograph with glass or cardboard?',
        answer: 'No. Frames and foam boards are strictly prohibited because all entries are displayed via hanging clips. You must laminate the 7×9 hardcopy.',
      },
    ],
  },
  {
    id: 8,
    name: 'Tech Quiz (ICT Olympiad)',
    slug: 'tech-quiz',
    short_name: 'Tech Quiz',
    category: 'QUIZ',
    event_type: 'INDIVIDUAL',
    individual_fee: 300,
    team_fee: 0,
    team_min: 1,
    team_max: 1,
    eligibility_groups: [ACADEMIC_GROUPS.A, ACADEMIC_GROUPS.B, ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D],
    submission_type: 'MIXED',
    venue_detail: 'Exam Hall & Main Auditorium Stage',
    is_active: true,
    highlight: false,
    icon: 'HelpCircle',
    fee_display: '৳300',
    registered_count: 0,
    order: 8,
    description:
      'ICT Olympiad — Technology Quiz Competition. Features Round 1 Written exam, Round 2 Buzzer qualifier, and Round 3 Live Stage Final Buzzer with negative marking.',
    rules: `### Overview
ICT Olympiad — Technology Quiz Competition. This is an individual competition testing computer science, digital systems, cybersecurity, software, and tech innovations.

### General Rules
- Individual competition across Groups A to D.
- Participants must report before the scheduled reporting time.
- Mobile phones, smartwatches, and all electronic devices are strictly prohibited.
- No communication between participants during any round. Any cheating results in immediate disqualification.

### Competition Format (3 Rounds)

#### 📝 Round 1 — Written Round
- Participants are given 10 comprehensive analytical questions.
- Time limit: 30 minutes.
- **Total Marks: 20** (1 mark for correct answer + 1 mark for correct and relevant technical explanation).
- Answers must be submitted within the allotted time.

#### 🔔 Round 2 — Buzzer Round
- Conducted with 20 rapid-fire questions using the buzzer system.
- Only the **top 4 highest-scoring participants** from Round 2 qualify for the grand finals.

#### ⚡ Round 3 — Final Buzzer Round
- Live stage buzzer showdown between the 4 finalists.
- **Negative marking applies in this round** for incorrect buzzer attempts.
- The top 2 scorers at the end of Round 3 will be declared the Champions and receive official awards.

#### 🏆 Tie-Breaker
In case of a tie affecting qualification or podium places, a rapid-fire question round will be conducted. Judges' decisions are final and binding.`,
    judging_criteria: "",
    faqs: [],
  },
  {
    id: 9,
    name: 'Treasure Hunt (Code Zero)',
    slug: 'treasure-hunt',
    short_name: 'Treasure Hunt',
    category: 'OTHER',
    event_type: 'TEAM',
    individual_fee: 0,
    team_fee: 600,
    team_min: 2,
    team_max: 4,
    eligibility_groups: [ACADEMIC_GROUPS.A, ACADEMIC_GROUPS.B, ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D],
    submission_type: 'STAGE',
    venue_detail: 'SJIS Campus (2nd & 3rd Floor + Stage)',
    is_active: true,
    highlight: true,
    icon: 'Compass',
    fee_display: '৳600 (team)',
    registered_count: 0,
    order: 9,
    description:
      'A mysterious hacker called ZERO has stolen the Tech Fest’s Golden Code. Recover all 5 code fragments hidden across campus before ZERO deletes them forever!',
    rules: `### The Mission Brief
“A mysterious hacker called ZERO has stolen the Tech Fest’s Golden Code. The code has been split into 5 fragments and hidden across the campus. Your team has 60 minutes to recover all fragments before ZERO deletes them forever.”

### Eligibility
- **Grade 3 to Grade 12** (Group A to Group D)
- Teams of 2 to 4 members

### How It Works (5 Progressive Stages)
1. **Round 1 — QR Hunt:** Teams are given a clue sheet with encrypted QR codes. Scanning each QR code reveals secret room locations on the 2nd and 3rd floors of the SJIS building.
2. **Round 2 — Tech Puzzle:** Teams find printed coding/debugging challenges in designated rooms. Determining the correct program output yields a secret numerical coordinate.
3. **Round 3 — Hidden Message:** Teams receive an image concealing steganographic visual clues. Deciphering the clue unlocks the decryption cipher.
4. **Round 4 — Encryption Challenge:** Teams solve a cryptography riddle to obtain a decryption string. Entering it into an online web terminal uncovers a secret destination URL.
5. **Final Round — The Stage Treasure:** The URL yields the master Key and Box number that unlocks the physical treasure chest on stage containing the Bitcoin / Golden Code.`,
    judging_criteria: "",
    faqs: [
      {
        question: 'How many members can be in a Treasure Hunt team?',
        answer: 'Teams consist of 2 to 4 participants from Groups A to D.',
      },
    ],
  },
  {
    id: 10,
    name: 'Rubik’s Showdown (4×4 Speedcube)',
    slug: 'rubiks-showdown',
    short_name: 'Rubik’s Showdown',
    category: 'OTHER',
    event_type: 'INDIVIDUAL',
    individual_fee: 200,
    team_fee: 0,
    team_min: 1,
    team_max: 1,
    eligibility_groups: [ACADEMIC_GROUPS.A, ACADEMIC_GROUPS.B, ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D],
    submission_type: 'PHYSICAL',
    venue_detail: 'Speedcubing Arena',
    is_active: true,
    highlight: false,
    icon: 'Box',
    fee_display: '৳200',
    registered_count: 0,
    order: 10,
    description:
      'Official 4×4 Rubik’s Cube speed solving showdown. Standard 4×4 cubes scrambled by organizers. Fastest valid solving times take the podium.',
    rules: `### Competition Category
**Standard 4×4 Rubik’s Cube Competition**

### Grade Eligibility
- **Grade 3 to Grade 12** (Group A to Group D)

### Task
Participants must solve a standard 4×4 Rubik’s Cube within the given time. The participant with the fastest valid solving time will be ranked highest.

### Official Guidelines
1. **Cube Requirements:**
   - Standard 4×4 Rubik’s Cube only.
   - Participants must bring their own 4×4 cube in proper mechanical working condition.
   - Any electronic, motorized, or specially modified cubes providing an unfair advantage are strictly prohibited.
   - Organizers reserve the right to inspect all cubes prior to scrambling.

2. **Scrambling Procedure:**
   - Each cube will be scrambled by official event marshals/judges following standardized scramble sequences.
   - Participants must not observe or interfere with the scrambling process.

3. **Procedure & Timing:**
   - Official timing mats/stopwatches will record each solve.
   - Competitors start on the judge's signal and stop timer immediately upon finishing.
   - A cube is considered solved only when all six faces are completely resolved into uniform colors.
   - Multiple attempts will be permitted as decided by organizers; best valid solve time is ranked.

4. **Fair Play:**
   - No external notes, algorithmic cheat sheets, smartwatches, or phones permitted during solve.`,
    judging_criteria: "",
    faqs: [
      {
        question: 'Can I use a magnetic 4x4 cube?',
        answer: 'Yes, factory magnetic speedcubes are allowed, provided they have no electronic sensors or Bluetooth connectivity.',
      },
    ],
  },
  {
    id: 11,
    name: 'PowerPoint Presentation',
    slug: 'powerpoint-presentation',
    short_name: 'PowerPoint Presentation',
    category: 'CREATIVE',
    event_type: 'INDIVIDUAL',
    individual_fee: 300,
    team_fee: 0,
    team_min: 1,
    team_max: 1,
    eligibility_groups: [ACADEMIC_GROUPS.A, ACADEMIC_GROUPS.B, ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D],
    submission_type: 'STAGE',
    venue_detail: 'Auditorium / Seminar Hall',
    is_active: true,
    highlight: false,
    icon: 'Presentation',
    fee_display: '৳300',
    registered_count: 0,
    order: 11,
    description:
      'Individual presentation contest using Microsoft PowerPoint. Choose exactly one assigned topic for your academic group. Strict human-created rule; no AI-generated slide decks.',
    rules: `### Competition Type
**Individual Competition** (Grade 3 to Grade 12 — Groups A to D)

### Official Presentation Topics
*(Participants must choose strictly ONE topic from their designated grade group for their submission & presentation)*

#### 🔹 Group A (Grade 3–4):
1. Introduction to Computer
2. History of Computer
3. History of Internet

#### 🔹 Group B (Grade 5–6):
1. Introduction to coding
2. 3D printing in education, medicine and industry
3. Wearable technology

#### 🔹 Group C (Grade 7–8):
1. The magic of animation
2. Technology in space
3. The technology behind virtual reality (AR vs VR)

#### 🔹 Group D (Grade 9–12 / A2):
1. The anatomy of a Digital Footprint
2. Generative AI vs Human Creativity
3. Cybersecurity Threats and Prevention

### Key Guidelines
- **Software:** Must be built using **Microsoft PowerPoint** (.pptx format).
- **Individual Effort:** Must be prepared and presented independently by the contestant.
- **Anti-AI Policy:** **AI-generated presentations or fully AI-generated slide content are strictly prohibited.**
- **Slide Count & Timing:** Time limit and slide expectations will be confirmed by organizers at the venue. Exceeding time limits incurs mark deductions.
- **Required Slide Info:** The presentation must clearly feature: Participant’s Name, School Name, Class & Section, Group (A/B/C/D), and Presentation Title.`,
    judging_criteria: "",
    faqs: [
      {
        question: 'Can I use Gamma or Tome AI to generate my slides?',
        answer: 'No. AI slide deck generators are strictly disqualified. All slides, layouts, and research must be prepared directly by the student in PowerPoint.',
      },
    ],
  },
  {
    id: 12,
    name: 'Tech Bytes (Tech Article Writing)',
    slug: 'tech-bytes',
    short_name: 'Tech Bytes',
    category: 'CREATIVE',
    event_type: 'INDIVIDUAL',
    individual_fee: 300,
    team_fee: 0,
    team_min: 1,
    team_max: 1,
    eligibility_groups: [ACADEMIC_GROUPS.A, ACADEMIC_GROUPS.B, ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D],
    submission_type: 'PHYSICAL',
    venue_detail: 'Examination Hall',
    is_active: true,
    highlight: false,
    icon: 'FileText',
    fee_display: '৳300',
    registered_count: 0,
    order: 12,
    description:
      'On-the-spot technology-related article writing in English. Secret theme announced at venue. Evaluated on depth of thought, clarity, and grammatical precision.',
    rules: `### Competition Type
**Individual On-the-Spot Writing Competition** (Grade 3 to Grade 12 — Groups A to D)

### Task
Participants will write an original technology-related article on the spot based on a topic or theme announced at the competition venue.

### Guidelines
1. **On-the-Spot Writing:** All articles must be composed in person during the allocated competition window.
2. **Language:** The article must be written in **English**. Proper grammar, punctuation, and structure must be maintained.
3. **Structure:** Must include an appropriate **Title, Introduction, Main Analysis/Discussion, and Conclusion**.
4. **Word Limit:** Specified by the organizers prior to writing. Articles falling significantly above or below the limit incur penalties.
5. **Materials:** Organizers provide official writing paper/answer sheets. Participants must bring their own pens.
6. **Identification Header:** Must include Student's Name, School, Class & Section, Group (A/B/C/D), and Article Title.`,
    judging_criteria: "",
    faqs: [],
  },
  {
    id: 13,
    name: 'Tech Meme Competition',
    slug: 'tech-memes',
    short_name: 'Tech Memes',
    category: 'CREATIVE',
    event_type: 'INDIVIDUAL',
    individual_fee: 300,
    team_fee: 0,
    team_min: 1,
    team_max: 1,
    eligibility_groups: [ACADEMIC_GROUPS.A, ACADEMIC_GROUPS.B, ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D],
    submission_type: 'ONLINE',
    venue_detail: 'Online Submission & Screening',
    is_active: true,
    highlight: false,
    icon: 'Smile',
    fee_display: '৳300',
    registered_count: 0,
    order: 13,
    description:
      'Individual submission of original programming, computer science, and digital technology humor. Every meme undergoes strict screening and plagiarism audit before judging.',
    rules: `### Competition Type
**Individual Submission-Based Competition** (Groups A to D)

### Task Description
Participants must create and submit an original technology-related meme based on programming, artificial intelligence, robotics, computer science, or digital student culture.

### Submission & Auditing Process
1. **Screening & Audit:** All submitted memes undergo a rigorous **screening and auditing process** for appropriateness, copyright compliance, and originality before shortlisting.
2. **Quantity:** Each participant may submit **one meme only**.
3. **Formats:** High-resolution JPG, JPEG, or PNG.
4. **Originality & Copyright:** Memes must be the original creative work of the participant. Direct reposts from Reddit, Instagram, or past competitions are disqualified. Standard meme templates may be utilized provided the joke/text is original.
5. **Appropriateness:** Offensive, defamatory, or discriminatory content is strictly banned.
6. **Required Info:** Submissions must include Student's Name, School, Class & Section, Group (A/B/C/D), and Meme Title/Caption.`,
    judging_criteria: "",
    faqs: [],
  },
  {
    id: 14,
    name: 'Line Robot Showcase (BDRO)',
    slug: 'line-robot',
    short_name: 'Line Robot (BDRO)',
    category: 'ROBOTICS',
    event_type: 'BOTH',
    individual_fee: 300,
    team_fee: 1000,
    team_min: 1,
    team_max: 3,
    eligibility_groups: [ACADEMIC_GROUPS.A, ACADEMIC_GROUPS.B, ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D],
    submission_type: 'PHYSICAL',
    venue_detail: 'Robotics Arena Track',
    is_active: true,
    highlight: false,
    icon: 'Cpu',
    fee_display: '৳300 (indiv) / ৳1000 (team)',
    registered_count: 0,
    order: 14,
    description:
      'BDRO Line-Following Robot race across a precision track. Robots must navigate fully autonomously and adhere to strict 25cm × 25cm × 25cm dimensional bounds.',
    rules: `### Task Description
Participants must design, build, and program an autonomous line-following robot capable of traversing a complex line track in the fastest time.

### Grade Eligibility
- **Grade 3 to Grade 12** (Group A to Group D)
- Individual (৳300) or Team of up to 3 members (৳1000)

### Technical Guidelines (BDRO Standards)
- **Dimensions:** The robot **cannot exceed 25cm × 25cm × 25cm** in width, length, and height.
- **Autonomous Operation:** The robot must operate 100% autonomously after the start button is pressed. No physical contact or wireless/electronic communication is permitted during the run.
- **Track Penalties:** If the robot leaves the black track, a time penalty will be added to the final score as decided by the judges.
- **Conduct:** Any intentional track damage or unsportsmanlike behavior results in immediate disqualification.`,
    judging_criteria: "",
    faqs: [],
  },
  {
    id: 15,
    name: 'Drone Competition (BDRO)',
    slug: 'drone-competition',
    short_name: 'Drone Competition (BDRO)',
    category: 'ROBOTICS',
    event_type: 'BOTH',
    individual_fee: 500,
    team_fee: 1000,
    team_min: 1,
    team_max: 3,
    eligibility_groups: [ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D, ACADEMIC_GROUPS.E],
    submission_type: 'STAGE',
    venue_detail: 'Open Field Drone Flight Arena',
    is_active: true,
    highlight: true,
    icon: 'Plane',
    fee_display: '৳500 (indiv) / ৳1000 (team)',
    registered_count: 0,
    order: 15,
    description:
      'BDRO Drone Obstacle Course navigation. Pilots maneuver custom drones through gates, hoops, and checkpoints. Strict flight zone boundaries and penalty rules apply.',
    rules: `### Task Description
Pilots must control and maneuver custom drones through an intricate 3D obstacle course within the carnival flight arena.

### Grade Eligibility
- **Grade 7 to 12 & University Level** (Group C to Group E)
- Individual (৳500) or Team of up to 3 members (৳1000)

### Flight Guidelines & Safety (BDRO Standards)
- **BYO Drone:** Participants must bring their own functional multirotor drones complying with safety limits.
- **Designated Flight Zone:** All drones must strictly remain inside the marked net/flight zone arena.
- **Penalties:** Missing an obstacle gate or colliding with an obstacle incurs a **5-second time penalty**.
- **Disqualification Rules:**
  • Sabotaging or colliding intentionally with other participants’ drones.
  • Flying outside the boundary of the flight zone.
  • Any participant physically entering the active flight arena without referee authorization results in instant disqualification.`,
    judging_criteria: "",
    faqs: [],
  },
  {
    id: 16,
    name: 'Coding Marathon (BDRO)',
    slug: 'coding-marathon',
    short_name: 'Coding Marathon (BDRO)',
    category: 'CODING',
    event_type: 'INDIVIDUAL',
    individual_fee: 300,
    team_fee: 0,
    team_min: 1,
    team_max: 1,
    eligibility_groups: [ACADEMIC_GROUPS.A, ACADEMIC_GROUPS.B, ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D],
    submission_type: 'LAB',
    venue_detail: 'SJIS Computer Lab',
    is_active: true,
    highlight: true,
    icon: 'Code',
    fee_display: '৳300',
    registered_count: 0,
    order: 16,
    description:
      'Algorithmic programming and competitive problem solving in the SJIS Computer Lab across junior and senior tiers (Scratch for A/B, Python/C++ for C/D).',
    rules: `### Overview
BDRO Coding Marathon tests algorithmic logic, computational efficiency, and clean code implementation.

### Segment Tier Breakdown
- **Group A (Grade 3–4):** Block-based Scratch challenges focusing on visual programming fundamentals.
- **Group B (Grade 5–6):** Intermediate Scratch algorithmic problem solving and logic puzzles.
- **Group C (Grade 7–8):** Python algorithmic challenges with automated test cases.
- **Group D (Grade 9–12 / A2):** Python and C++ competitive programming contests.

### Lab Regulations
- Contest conducted in the SJIS Computer Lab.
- External code generation assistants (ChatGPT, Copilot, Cursor) are strictly blocked and banned.
- Standard language libraries are fully permitted.`,
    judging_criteria: "",
    faqs: [],
  },
  {
    id: 17,
    name: 'Robo Showcase (Robot Display)',
    slug: 'robo-showcase',
    short_name: 'Robo Showcase',
    category: 'ROBOTICS',
    event_type: 'BOTH',
    individual_fee: 500,
    team_fee: 1000,
    team_min: 1,
    team_max: 3,
    eligibility_groups: [ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D, ACADEMIC_GROUPS.E],
    submission_type: 'STAGE',
    venue_detail: 'Robotics & Hardware Exhibition Arena',
    is_active: true,
    highlight: true,
    icon: 'Bot',
    fee_display: '৳500 (indiv) / ৳1000 (team)',
    registered_count: 0,
    order: 17,
    description:
      'Robot Display & Hardware Innovation. Showcase functional IoT, robotics, automation, and AI hardware projects live before the expert jury panel.',
    rules: `### Overview
Contestants exhibit and pitch original robotic systems, embedded prototypes, IoT apparatus, and autonomous hardware.

### Eligibility
- **Group C, D, E** (Grade 7 to University 4th Year)
- Individual (৳500) or Team of up to 3 members (৳1000)

### Presentation Rules
- Hardware must be demonstrated live in front of the judging panel.
- Teams must be prepared for a 5-minute technical presentation followed by a jury Q&A on schematics, components, code, and practical impact.`,
    judging_criteria: "",
    faqs: [],
  },
  {
    id: 18,
    name: 'Valorant (5v5 E-Sports)',
    slug: 'valorant-esports',
    short_name: 'Valorant (5v5)',
    category: 'ESPORTS',
    event_type: 'TEAM',
    individual_fee: 0,
    team_fee: 500,
    team_min: 5,
    team_max: 5,
    eligibility_groups: [ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D, ACADEMIC_GROUPS.E],
    submission_type: 'MIXED',
    venue_detail: 'Online Knockouts & Main Stage LAN (Semis/Finals)',
    is_active: true,
    highlight: true,
    icon: 'Crosshair',
    fee_display: '৳500 (team of 5)',
    registered_count: 0,
    order: 18,
    description:
      '5v5 tactical shooter championship. Online prelims leading into high-stakes Semi-Finals and Grand Finals live on auditorium Stage LAN rigs with commentary.',
    rules: `### Tournament Format
- **Team Roster:** Exactly 5 registered players per team (৳500 per team).
- **Preliminaries:** Conducted online via dedicated tournament Discord/bracket prior to LAN day.
- **Semi-Finals & Grand Finals:** Hosted live on auditorium Stage LAN gaming rigs with live audience screening and caster commentary.
- **Peripherals:** Players may bring their own mice, mechanical keyboards, mousepads, and headsets.`,
    judging_criteria: "",
    faqs: [],
  },
  {
    id: 19,
    name: 'EAFC 24 / FIFA (1v1 E-Sports)',
    slug: 'eafc-esports',
    short_name: 'EAFC 24 (1v1)',
    category: 'ESPORTS',
    event_type: 'INDIVIDUAL',
    individual_fee: 300,
    team_fee: 0,
    team_min: 1,
    team_max: 1,
    eligibility_groups: [ACADEMIC_GROUPS.A, ACADEMIC_GROUPS.B, ACADEMIC_GROUPS.C, ACADEMIC_GROUPS.D, ACADEMIC_GROUPS.E],
    submission_type: 'PHYSICAL',
    venue_detail: 'Gaming Console Arena (Fest Day)',
    is_active: true,
    highlight: true,
    icon: 'Trophy',
    fee_display: '৳300',
    registered_count: 0,
    order: 19,
    description:
      '1v1 EA Sports FC console championship on PlayStation 5 / PC LAN rigs. Fast-paced knockout brackets culminating in the main stage Grand Final.',
    rules: `### Tournament Format
- 1v1 single-elimination tournament (৳300 per participant).
- Played on official PlayStation 5 / PC consoles in the Carnival Gaming Lounge.
- Standard 6-minute halves with Tactical Defending. Extra Time and Penalty Shootouts on tie.
- Participants may bring their own certified controllers.`,
    judging_criteria: "",
    faqs: [],
  },
];
