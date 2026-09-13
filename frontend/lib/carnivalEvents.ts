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
      'Based on the theme given on spot, use prompt to generate an image. Contestants are given a specific theme. They must generate an image that matches the style, composition, and subject of the theme as closely as possible. Open to Group B to E (Individual).',
    rules: `### Description
Based on the theme given on spot, use prompt to generate an image. Contestants are given a specific theme. They must generate an image that matches the style, composition, and subject of the theme as closely as possible.

### Grade Group
- **Group B to Group E** (Grade 5 to University Level)
- Individual participation only

### Rules and Regulations
1. **New Session:** Must start a new Chat or terminal of AI model for the competition.
2. **Safety Compliance:** Must not violate the host platform’s (major) safety guidelines (NSFW, extreme violence, etc.).
3. **Reproducibility Check:** The prompt history must match the generated image. The prompts will be test-run by judges if any suspicion arises to validate the prompts.
4. **Text-Only Rule:** The prompt history must not include any other resource (such as images or files) other than text typed by the participant. Each instruction MUST be typed by the participant completely (autocorrect and suggestions are still allowed).
5. **Submission:** Submission into the google form link provided on the time of competition.

### 🏆 Judging Criteria
- **Prompt Effectiveness:** 35 Marks
- **Accuracy of Output:** 25 Marks
- **Creativity & Innovation:** 20 Marks
- **Prompt Structure & Clarity:** 10 Marks
- **Efficiency (Fewest Effective Prompts):** 10 Marks
- **Total:** 100 Marks`,
    judging_criteria: `Prompt Effectiveness (35), Accuracy of Output (25), Creativity & Innovation (20), Prompt Structure & Clarity (10), Efficiency (10). Total: 100.`,
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
    name: 'Tech-Art Bonanza (Theme Based Digital Art & Digital Poster/Banner Submission)',
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
      'Theme-based digital art & digital poster/banner submission. Contestants will make an artwork or poster based on the given technology theme. Open to Groups A to E (Grade 3 to 12 & University Level).',
    rules: `### Rules
- **Grade:** 3 to 12 & University Level (Group A to E)
- **Task:** Contestants will make an artwork or poster based on the given technology theme.

### Guidelines
- Submit an image as well as the raw file for poster submissions (and raw files for art submissions if possible). The raw files will be used to check for authenticity.
- Submissions must be original. AI is prohibited.
- Using trademarked or copyrighted characters or assets is forbidden. Participants must use self-made assets or royalty free ones.
- Submit the submission through a pen drive.
- Participants must bring their physical artwork to the submission site on time.

### 🏆 Judgement Criteria (Marks)
- **Creativity & Originality:** 25 Marks
- **Relevance to Theme:** 30 Marks
- **Artistic Skill & Technique:** 20 Marks
- **Visual Appeal / Presentation:** 15 Marks
- **In-depth Message / Meaning:** 10 Marks
- **Total:** 100 Marks`,
    judging_criteria: `Creativity & Originality (25), Relevance to theme (30), Artistic skill & technique (20), Visual appeal/presentation (15), In-depth message/meaning (10). Total: 100.`,
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
    rules: `### 1. Rounds (2 Rounds)
#### 1. Qualifiers
- Qualifiers will be on a MCQ question paper, where participants have to fill out OMR boxes in the OMR Answer Script.
- QP will be of 20 marks and the participant will have to answer all 20 questions.
- The top 5 participants will be taken from this round.
- In case of participants from position 5 and below them having exact same marks, a verbal buzzer round will be taken of 11 questions where the person who answers the most amount of questions correctly will win the 5th place.

#### 2. Finals
- Will be an on stage buzzer round.
- Participants with the most questions answered correctly out of the first 10 questions will win the Finals.
- In the case of a draw, a series of 11 questions will be asked in a buzzer round and the participants with the most correct answers will win.

### 2. Syllabus
- Syllabus will be different and difficulty will be arranged according to the groups.
- Different groups will have different syllabus.
- Syllabus of individual groups will be uploaded soon on the Facebook and Instagram pages of JTC.`,
    judging_criteria: `Qualifiers: 20 marks MCQ OMR (Top 5 advance). Finals: 10-question stage buzzer round. Ties: 11-question sudden-death buzzer round.`,
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
    rules: `### Rules
- **Grade:** 3 to 12 (Group A to D)
- **Task:** Participants will have 3 tries to type as fast as possible in one minute on MonkeyType.

### Guidelines
- Participants are allowed to bring their own keyboards.
- The event will be held in the school computer lab. Bringing your own device (excluding keyboard) is not allowed.
- No auto-correct, macros or copy-pasting.
- 5 minutes will be given before the competition for warming up.
- Each try will be a 15 second test. The best of five tries will be chosen for judging.

### 🏆 Judging
- The participants with the 3 highest WPMs will be awarded.`,
    judging_criteria: `Highest Net Words Per Minute (WPM) on MonkeyType across 15-second speed bursts.`,
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
      'Participants will have to recreate a given webpage using HTML and CSS (including JS) in 30 minutes in the school computer lab using offline code editors.',
    rules: `### Rules
- **Grade:** 3 to 12 (Group A to D)
- **Task:** Participants will have to recreate a given webpage using HTML and CSS (including JS) in 30 minutes.

### Guidelines
- All participants must use an offline code editor.
- The event will be held in the school computer lab. Bringing your own device is not allowed.
- Any functionality in the webpage will be mentioned. Participants must recreate the functionality as accurately as possible.
- Making an extra JS file for the functionality is allowed and must be included with the webpage files.

### 🏆 Judging
- **Accuracy:** 60%
- **Functionality:** 25%
- **Code Quality & Structure:** 15%`,
    judging_criteria: `Accuracy (60%), Functionality (25%), Code Quality & Structure (15%).`,
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
      'Participants must create a video based on the theme given and submit it on the first day of the fest. Maximum 5 minutes, 1080p MP4. Submit via pendrive.',
    rules: `### Rules
- **Grade:** 3 to 12 (Group A to D)
- **Task:** Participants must create a video based on the theme given and submit it on the first day of the fest.

### General Guidelines
- The video must be based on the given theme.
- Offensive, copyrighted, or inappropriate content is prohibited.
- All footage and content must be original and theme based.
- Submit the submission through a pen drive on the first day of the fest.

### Video Format
- The Video must be not more than 5 mins.
- The resolution of the video must be 1080p and mp4 format.

### Student Information
- The submitted Folder should contain the video and in a doc file students personal information and title of the video needs to be written.

### 🏆 Judging
The videos will be judged by our judges on stage after being reviewed.
- **Creativity & Storytelling:** 25%
- **Editing, Audio & Video Quality:** 35%
- **Theme Relevance:** 40%`,
    judging_criteria: `Creativity & Storytelling (25%), Editing, Audio & Video Quality (35%), Theme Relevance (40%).`,
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
    venue_detail: 'Carnival Photo Gallery Exhibition (Day 2 Submission)',
    is_active: true,
    highlight: true,
    icon: 'Camera',
    fee_display: '৳200',
    registered_count: 0,
    order: 7,
    description:
      'Participants must take photos and submit it on the Second day of the fest. Strictly 7×9 inches (18×23 cm) laminated hardcopy submission with handwritten back-side information. Zero AI allowed.',
    rules: `### Rules
- **Grade:** 3 to 12 & University Level (Group A to E)
- **Task:** Participants must take photos and submit it on the Second day of the fest.

### Guidelines
1. **Photograph Size:**
   - The photograph must be printed in **7 × 9 inches (18 × 23 cm)** size.
   - This size is suitable for easy handling and display using clips.
   - Do not submit photographs larger than the specified size.

2. **Printing & Lamination:**
   - Each student must submit one hardcopy of the photograph.
   - The photograph must be **properly laminated by the student before submission**.
   - Do not mount the photograph on cardboard, foam board, or a frame, as the photographs will be displayed using clips.

3. **Student Information:**
   - The following information must be clearly written on the back side of the photograph then laminate it:
     • Student’s Name
     • Class & Section
     • Group A/B/C/D/E
     • Title of the Photograph
   - **IMPORTANT:** Write all student information clearly on the **BACK SIDE** of the photograph.

4. **Display:**
   - All photographs will be displayed by hanging them with clips.
   - Students are requested to ensure that the photograph is neatly printed, laminated, and ready for display.

5. **Important Note:**
   - Photographs that are not laminated, incorrectly sized, or missing student information may not be considered for the exhibition.
   - **NO AI Generated photos/photos that is downloaded from internet will be allowed.**

### 🏆 Judging
The photos will be judged by our judges on stage after being reviewed.
- **Technical Quality:** 10%
- **Composition:** 20%
- **Creativity & Originality:** 30%
- **Theme Relevance:** 40%`,
    judging_criteria: `Technical Quality (10%), Composition (20%), Creativity & Originality (30%), Theme Relevance (40%).`,
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
    rules: `### 🧠 ICT Olympiad — Technology Quiz Competition
Grade: Group A to D

### 📋 Rules & Format

#### General Rules
- This is an individual competition.
- Participants must report before the scheduled reporting time.
- Mobile phones, smartwatches, and all other electronic devices are strictly prohibited.
- No communication or discussion between participants is allowed during any round.
- Any form of cheating or unfair means will result in immediate disqualification.
- Participants must maintain discipline throughout the competition.

#### 📝 Round 1 — Written Round
- The first round will be a written quiz.
- Participants will be given 10 questions.
- The time limit will be 30 minutes.
- Total Marks: 20 (1 mark for the correct answer, 1 mark for a correct and relevant explanation).
- Participants must submit their answers within the allotted time.

#### 🔔 Round 2 — Buzzer Round
- The second round will be a buzzer round consisting of 20 questions.
- Participants must answer using the buzzer system.
- Only the 4 highest-scoring participants from Round 2 will qualify for the final round.

#### ⚡ Round 3 — Final Buzzer Round
- The final round will also be a buzzer round.
- The finalists will compete for the highest score.
- Negative marking will apply in this round.
- The top 2 scorers at the end of the final round will be declared the winners and will receive the prizes.

#### 🏆 Judging & Tie-Breaker
- Scores from each round will be recorded and used to determine qualification and final ranking.
- In case of a tie affecting qualification or prize positions, an additional tie-breaker/rapid-fire question round may be conducted.
- The judges' decision will be final and binding.`,
    judging_criteria: `Round 1: Written (20 marks). Round 2: Buzzer (top 4 advance). Round 3: Final Buzzer with negative marking (top 2 win).`,
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

### How it works:
- **Round 1 — QR Hunt:** Place QR codes given in a paper to each team. Scanning each QR code reveals the room location on the 2nd and 3rd floor or SJIS building.
- **Round 2 — Tech Puzzle:** Give teams a simple coding/debugging challenge. This will be presented in the form of printed paper in the designated rooms. The correct output gives them a number.
- **Round 3 — Hidden Message:** Give them an image containing a hidden message using visual clues.
- **Round 4 — Encryption Challenge:** Teams solve a riddle to obtain a decryption. Entering it on a webpage reveals a URL.
- **Final Round — The Treasure:** The URL provides a combination of Key and box number that opens the treasure box on stage that has the Bitcoin.`,
    judging_criteria: `Speed and accuracy across 5 phases: QR Hunt, Tech Puzzle, Hidden Message, Encryption Challenge, and Stage Treasure Chest Unlock.`,
    faqs: [
      {
        question: 'How many members can be in a Treasure Hunt team?',
        answer: 'Teams consist of 2 to 4 participants from Groups A to D.',
      },
    ],
  },
  {
    id: 10,
    name: 'Rubik’s Showdown (3×3 Speedcube)',
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
      'Official 3×3 Rubik’s Cube speed solving showdown. Standard 3×3 cubes scrambled by organizers. Fastest valid solving times take the podium. Open to Grade 3 to 12 (Group A to D).',
    rules: `### Category
**3x3 Rubik’s Cube**

### Grade Eligibility
- **Grade 3 to 12** (Group A to D)

### Task
Participants must solve a standard 3×3 Rubik’s Cube within the given time. The participant with the fastest valid solving time will be ranked higher.

### Guidelines
1. **Cube Requirements:**
   - The competition will be conducted using a standard 3×3 Rubik’s Cube.
   - Participants may bring their own 3×3 cube unless instructed otherwise by the organizers.
   - The cube must be in proper working condition.
   - Any electronic or specially modified cube that provides an unfair advantage will not be allowed.
   - The organizers reserve the right to inspect the cube before the competition.

2. **Scrambling the Cube:**
   - Each participant's cube will be scrambled before the competition.
   - The scrambling process will be conducted by the event organizers or judges to ensure fairness.
   - Participants must not observe or interfere with the scrambling process.

3. **Competition Procedure:**
   - Participants must wait for the official signal before starting.
   - Timing will begin according to the instructions of the judges.
   - Participants must stop immediately after completing the cube.
   - A cube will be considered solved only when all six faces are completely solved with their respective colours.

4. **Timing:**
   - The official timing system will be used to record each participant's solving time.
   - Each participant will be given the number of attempts determined by the organizers.
   - The best valid solving time will be considered for the final ranking.
   - The judges' recorded time will be considered final.

5. **Fair Play:**
   - Participants must solve the cube without any external assistance.
   - The use of mobile phones, smart devices, notes, algorithms, or any other solving guides during the competition is strictly prohibited.
   - Participants must not receive assistance from spectators or other participants.
   - Any participant found using unfair means may be immediately disqualified.

6. **Participant Conduct:**
   - Participants must report to the competition venue on time.
   - Participants must follow the instructions of the judges and event organizers.
   - Any disruptive or inappropriate behaviour may result in disqualification.

7. **Judging & Results:**
   - Participants will be ranked according to their fastest valid solving time.
   - In the case of a tie, additional attempts or tie-breaking rules may be applied by the judges.
   - The decision of the judges and organizers will be final.

### IMPORTANT NOTE
- **Only standard 3×3 Rubik’s Cubes will be allowed for this competition.**
- Participants must ensure that their cubes are in proper working condition.
- Any form of cheating or external assistance will result in immediate disqualification.
- The decision of the judges will be final.`,
    judging_criteria: `Ranked by fastest valid solving time on standard 3×3 Rubik's Cube. Best of official attempts.`,
    faqs: [
      {
        question: 'Can I use a magnetic 3x3 cube?',
        answer: 'Yes, factory magnetic 3x3 speedcubes are allowed, provided they have no electronic sensors or Bluetooth connectivity.',
      },
    ],
  },
  {
    id: 11,
    name: 'PowerPoint Presentation Competition',
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
**Individual Competition** (Grade 3 to 12 — Group A to D)

### Presentation Topics (Choose only one Topic for the submission according to the Group)
#### 🔹 Group-A:
1. Introduction to Computer
2. History of Computer
3. History of Internet

#### 🔹 Group-B:
1. Introduction to coding
2. 3D printing in education, medicine and industry
3. Wearable technology

#### 🔹 Group-C:
1. The magic of animation
2. Technology in space
3. The technology behind virtual reality (AR vs VR)

#### 🔹 Group-D:
1. The anatomy of a Digital Footprint
2. Generative AI vs Human Creativity
3. Cybersecurity Threats and Prevention

### Task
Participants will work individually to create and present a PowerPoint presentation based on the theme/topic provided by the event organizers. The theme/topic and detailed instructions will be announced later. The same theme/topic will be applicable to all participating individuals.

### Guidelines
1. **Individual Participation:** Each participant must compete individually and independently.
2. **Theme & Topic:** Strictly based on the given theme/topic.
3. **Presentation Requirements:** Created using Microsoft PowerPoint. Clear, well-organized, visually appealing.
4. **Number of Slides & Presentation Time:** Announced later by the organizers. Exceeding time limit may result in mark deductions.
5. **Submission:** Must be submitted in **.pptx format**.
6. **Originality & Fair Play:** **AI-generated presentations or fully AI-generated content will not be allowed.**
7. **Student’s Information:** Participant’s Name, School Name, Class & Section, Group (A/B/C/D), Title of the Presentation.

### 🏆 Judging Criteria
Groups will be evaluated based on:
- Relevance to the given theme/topic
- Creativity and originality
- Quality and accuracy of content
- Slide design and visual appeal
- Effective use of Microsoft PowerPoint features
- Teamwork and coordination
- Presentation and communication skills
- Organization and clarity
- Time management

### IMPORTANT NOTE
- This is an Individual competition.
- The presentation must be created using Microsoft PowerPoint.
- AI-generated presentations or fully AI-generated content will not be allowed.
- The decision of the judges and event organizers will be final.`,
    judging_criteria: `Relevance, Creativity & Originality, Quality & Accuracy, Slide Design, PowerPoint Features, Presentation & Communication, Organization & Clarity, Time Management.`,
    faqs: [
      {
        question: 'Can I use Gamma or Tome AI to generate my slides?',
        answer: 'No. AI slide deck generators are strictly disqualified. All slides, layouts, and research must be prepared directly by the student in PowerPoint.',
      },
    ],
  },
  {
    id: 12,
    name: 'Tech Bytes (Tech Article Writing Competition)',
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
      'On-the-spot technology-related article writing in English. Topic announced at venue. Evaluated on depth of thought, clarity, and grammatical precision.',
    rules: `### Competition Type
**Individual Competition** (Grade 3 to 12 — Group A to D)

### Task
Participants will write a technology-related article on the spot based on a topic or theme provided by the event organizers. The topic/theme will be announced at the competition venue, and participants will be required to complete their article within the allocated time.

### Guidelines
1. **Topic & Theme:** Provided on the day of the competition. Must remain relevant to technology.
2. **On-the-Spot Writing:** Completed within allocated time limit.
3. **Writing Format:** Clear and well-organized with appropriate Title, Introduction, Main Content, and Conclusion.
4. **Language:** Must be written in **English**. Proper grammar, spelling, punctuation, and sentence structure.
5. **Word Limit:** Announced by organizers before competition.
6. **Writing Materials:** Bring own writing materials; organizers provide writing paper or answer sheets.
7. **Student Information:** Student's Name, Class & Section, Group (A/B/C/D), Title of the Article.

### 🏆 Judging Criteria
Participants will be evaluated based on:
- Relevance to the given topic
- Quality and depth of ideas
- Creativity and expression
- Organization and structure
- Language and grammar
- Clarity and presentation

### IMPORTANT NOTE
- This is an on-the-spot writing competition.
- The topic/theme will be announced at the competition venue.
- All articles must be written in English.
- The decision of the judges and event organizers will be final.`,
    judging_criteria: `Relevance to given topic, Quality and depth of ideas, Creativity and expression, Organization and structure, Language and grammar, Clarity and presentation.`,
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
      'Individual submission of original programming, computer science, and digital technology humor. Every meme undergoes strict screening and audit before judging.',
    rules: `### Competition Type
**Individual / Submission-Based Competition** (Grade 3 to 12 — Group A to D)

### Task
Participants must create and submit a technology-related meme based on a topic, theme, or concept related to technology, computers, programming, artificial intelligence, robotics, digital life, or other relevant technology-related subjects. All submitted memes will first go through a screening and auditing process to ensure that the content is appropriate before being shortlisted for judging.

### Guidelines
1. **Meme Content:** Related to technology, humorous, creative, understandable, and suitable for a general audience. Offensive or inappropriate content will not be accepted.
2. **Submission:** Each participant may submit one meme only before the deadline.
3. **Meme Format:** Clear and high-quality digital format (JPG, JPEG, or PNG).
4. **Originality & Copyright:** Original creative work of the participant. No direct copying from another person, website, or social media. Permitted templates allowed with appropriate credit.
5. **Content Screening & Auditing:** All submissions screened and audited before judging.
6. **Student Information:** Student's Name, Class & Section, Group (A/B/C/D), Title or Caption of the Meme.

### 🏆 Judging Criteria
Shortlisted memes will be evaluated based on:
- Creativity and humour
- Relevance to technology
- Originality of concept
- Clarity of the message
- Visual presentation
- Effective use of text and imagery
- Overall impact and audience engagement

### IMPORTANT NOTE
- This is a submission-based competition.
- All submissions will be screened and audited for content appropriateness before judging.
- The submitted meme must be the participant's original creative work.
- The decision of the judges and event organizers will be final.`,
    judging_criteria: `Creativity and humour, Relevance to technology, Originality of concept, Clarity of message, Visual presentation, Effective use of text and imagery, Overall impact.`,
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
    rules: `### Rules
- **Grade:** 3 to 12 (Group A to D)
- **Task:** Participants must design and make a line-following robot. In the event the robots will have to traverse a line course.

### Guidelines
- The robot cannot exceed dimensions 25cm × 25cm × 25cm.
- The robot must move autonomously after the run starts. No physical contact or electronic communication with the robot is allowed.
- If the robot leaves the track, a time penalty will be applied as decided by the judges.
- Any misconduct will result in disqualification.

### 🏆 Judging
- The robots with the fastest times will be awarded.
- Ties will be handled by preferring the smaller/lighter robot.`,
    judging_criteria: `Fastest line course completion time. Strict 25cm × 25cm × 25cm dimension compliance. Ties: smaller/lighter robot preferred.`,
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
    rules: `### Rules
- **Grade:** 7 to 12 & University Level (Group C to E)
- **Task:** Participants must control drones and navigate through an obstacle course.

### Guidelines
- Participants must bring their own drones. Drones must comply with the specifications mentioned below.
- All drones must stay in the designated competition area.
- Missing a checkpoint or colliding with an obstacle will result in a 5 second time penalty.
- Sabotaging other participants’ drones, colliding with them or leaving the flight zone will result in disqualification.
- Participants entering the flight zone will be disqualified.

### 🏆 Judging
- The drones with the fastest times will be awarded.
- Ties will be handled by redoing the course.`,
    judging_criteria: `Fastest obstacle course completion time. 5-second penalty per missed checkpoint or obstacle collision. Ties: redoing course.`,
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
    judging_criteria: `Correctness of test cases, execution time, and algorithmic complexity.`,
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
    judging_criteria: `Innovation, technical complexity, working prototype demonstration, and presentation defense.`,
    faqs: [],
  },
];
