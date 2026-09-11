'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Sparkles,
  Gamepad2,
  Laptop,
  Cpu,
  Camera,
  FileText,
  Music,
  Zap,
  Users,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Tv,
  ShieldCheck,
  CheckCircle2,
  Palette,
  Video,
  Info,
  FileCheck,
} from 'lucide-react';

type DayKey = 'day1' | 'day2' | 'day3';
type GroupFilter = 'ALL' | 'Group A' | 'Group B' | 'Group C' | 'Group D';

interface GroupSlot {
  group: string;
  time: string;
  venue?: string;
  room?: string;
  notes?: string;
}

interface TimelineEvent {
  title: string;
  category: 'FLAGSHIP' | 'ROBOTICS' | 'ESPORTS' | 'CONTEST' | 'SUBMISSION' | 'WORKSHOP' | 'CEREMONY' | 'CULTURAL' | 'BREAK';
  mainTime: string;
  venue: string;
  waitingRoom?: string;
  note?: string;
  groupSlots?: GroupSlot[];
  isOngoing?: boolean;
}

interface OngoingItem {
  title: string;
  time: string;
  venue: string;
  format?: string;
  tag: string;
}

export default function CarnivalTimeline() {
  const [activeDay, setActiveDay] = useState<DayKey>('day1');
  const [selectedGroup, setSelectedGroup] = useState<GroupFilter>('ALL');

  // Day 1 Data
  const day1Ongoing: OngoingItem[] = [
    {
      title: 'St. Joseph Students Exclusive Submission Counters',
      time: '11:45 AM – 04:30 PM',
      venue: 'SJIS Media Wing & Art Hall (Level 2 & Ground)',
      format: 'Laminated Photo Prints, Digital Media & USB Pen Drive Drop-offs',
      tag: 'JOSEPHITE EXCLUSIVE',
    },
    {
      title: 'Grand Inauguration Ceremony & Red Carpet Assembly',
      time: '09:00 AM – 11:45 AM',
      venue: 'SJIS Main Auditorium & Ceremonial Stage',
      format: 'Official Opening, Dignitary Speeches & Digital Torch Lighting',
      tag: 'CEREMONY',
    },
    {
      title: 'Robotics Arena Track Testing & Hardware Inspection',
      time: '12:00 PM – 05:00 PM',
      venue: 'Room N-204 (Robotics Track Arena) & SJIS Basement',
      format: 'LFR Official Track Testing & Robot Exhibition Stall Allotment',
      tag: 'ROBOTICS',
    },
  ];

  const day1Events: TimelineEvent[] = [
    {
      title: 'Grand Carnival Inauguration & Opening Ceremony',
      category: 'CEREMONY',
      mainTime: '09:00 AM – 11:45 AM',
      venue: 'SJIS Main Auditorium & Ceremonial Stage',
      note: 'Dignitary reception, national anthem, presidential address, and official ribbon cutting.',
    },
    {
      title: 'St. Joseph Students Submission: Phase 1 (Groups A & B)',
      category: 'SUBMISSION',
      mainTime: '11:45 AM – 01:00 PM',
      venue: 'Art & Media Hall (Ground Floor)',
      waitingRoom: 'Room S-301',
      note: 'Strictly for internal St. Joseph contestants. Laminated 7×9 photos & USB digital art.',
      groupSlots: [
        { group: 'Group A', time: '11:45 AM – 12:20 PM', venue: 'Art & Media Hall' },
        { group: 'Group B', time: '12:20 PM – 01:00 PM', venue: 'Art & Media Hall' },
      ],
    },
    {
      title: 'Lunch, Dhuhr Prayer & Refreshment Break',
      category: 'BREAK',
      mainTime: '01:00 PM – 02:00 PM',
      venue: 'SJIS Cafeteria & Prayer Hall',
      note: 'Submission counters and auditorium paused for afternoon prayer and lunch service.',
    },
    {
      title: 'St. Joseph Students Submission: Phase 2 (Groups C, D & E)',
      category: 'SUBMISSION',
      mainTime: '02:00 PM – 04:30 PM',
      venue: 'Media Lab & Audiovisual Wing (Level 2)',
      waitingRoom: 'Room S-305',
      note: 'Exclusive to St. Joseph students. Digital art layered files, meme exports, video montages & photos.',
      groupSlots: [
        { group: 'Group C', time: '02:00 PM – 02:50 PM', venue: 'Media Lab (Level 2)' },
        { group: 'Group D', time: '02:50 PM – 03:40 PM', venue: 'Media Lab (Level 2)' },
        { group: 'Group E', time: '03:40 PM – 04:30 PM', venue: 'Media Lab (Level 2)' },
      ],
    },
    {
      title: 'Robotics Track Calibration & Inspection (St. Joseph Teams)',
      category: 'ROBOTICS',
      mainTime: '02:30 PM – 05:00 PM',
      venue: 'Robotics Track Arena (Room N-204) & Basement',
      note: 'Chassis dimension verification (≤25cm), sensor calibration on vinyl track & stall setup.',
      groupSlots: [
        { group: 'Group B', time: '02:30 PM – 03:15 PM', room: 'Room N-204' },
        { group: 'Group C', time: '03:15 PM – 04:00 PM', room: 'Room N-204' },
        { group: 'Group D', time: '04:00 PM – 05:00 PM', room: 'Room N-204' },
      ],
    },
    {
      title: 'Delegate Credential & Kit Distribution (Internal Josephites)',
      category: 'CONTEST',
      mainTime: '11:45 AM – 04:30 PM',
      venue: 'JTC Central Helpdesk (Admin Lobby)',
      note: 'Collect official carnival badge, participant laminate, and arena access passes.',
      groupSlots: [
        { group: 'Group A', time: '11:45 AM – 12:45 PM', venue: 'Admin Lobby Desk' },
        { group: 'Group B', time: '12:45 PM – 01:45 PM', venue: 'Admin Lobby Desk' },
        { group: 'Group C', time: '02:00 PM – 03:00 PM', venue: 'Admin Lobby Desk' },
        { group: 'Group D', time: '03:00 PM – 04:00 PM', venue: 'Admin Lobby Desk' },
        { group: 'Group E', time: '04:00 PM – 04:30 PM', venue: 'Admin Lobby Desk' },
      ],
    },
  ];

  // Day 1 Inauguration Ceremony Steps
  const day1InaugurationSteps = [
    { time: '09:00 AM – 09:30 AM', title: 'Red Carpet Reception & Assembly', desc: 'Arrival of Revered Holy Cross Brothers, Chief Guest, JTC Executives & School Delegates.' },
    { time: '09:30 AM – 09:40 AM', title: 'National Anthem & St. Joseph Hymn', desc: 'Opening solemn invocation and college hymn rendered by the St. Joseph Student Choir.' },
    { time: '09:40 AM – 09:55 AM', title: 'Welcome Address & JTC 2026 Trailer Premiere', desc: 'Opening keynote by Siam Ulla Aziz (President, JTC) with exclusive festival trailer launch.' },
    { time: '09:55 AM – 10:15 AM', title: 'Address by Chief Convener', desc: 'Speech by Snigdha K. Paul (Chief Convener) outlining competitive integrity and arena setup.' },
    { time: '10:15 AM – 10:35 AM', title: 'Speech of Vice Principal', desc: 'Inspirational message by Brother Bikash Victor Rozario, CSC, Vice Principal.' },
    { time: '10:35 AM – 11:05 AM', title: 'Inaugural Keynote by Chief Guest', desc: 'Keynote address by the Distinguished Chief Guest & presentation of commemorative floral tributes.' },
    { time: '11:05 AM – 11:25 AM', title: 'Inaugural Address by Principal', desc: 'Official festival opening declaration and blessings by Brother Chandon B. Gomes, CSC, Principal.' },
    { time: '11:25 AM – 11:45 AM', title: 'Digital Torch Lighting & Ribbon Cutting', desc: 'Ceremonial digital torch activation & grand inauguration ribbon cutting marking Day 1 kickoff.' },
  ];

  // Day 1 Dedicated St. Joseph Submission Desks
  const day1SubmissionDesks = [
    {
      station: 'Station 01',
      title: 'Captura (Photography Prints Desk)',
      venue: 'Art & Media Hall (Ground Floor)',
      format: 'Physical 7×9 in Laminated Prints',
      icon: Camera,
      badge: 'Group A, B, C, D, E',
      desc: 'Submit properly laminated 7×9 inches photographs. Write Name, Class, Section, Group, and Title on the back before laminating.',
    },
    {
      station: 'Station 02',
      title: 'Tech-Art Bonanza & Tech Meme USB Drop',
      venue: 'Media Lab Submission Desk (Level 2)',
      format: 'High-Res PNG + Raw Layered Source Files',
      icon: Palette,
      badge: 'Group A, B, C, D, E',
      desc: 'Submit project via physical USB drive in folder labeled [Name_Roll_Group]. Include raw layered file (.psd, .ai, .procreate) for authenticity verification.',
    },
    {
      station: 'Station 03',
      title: 'Game Sync Symphony (Video Montage)',
      venue: 'Audiovisual Screening Room N-201',
      format: '1080p MP4 (Max 5 Mins)',
      icon: Video,
      badge: 'Group A, B, C, D',
      desc: 'Video montage submissions turned in via USB drive. Judges perform initial codec verification & staging for Day 3 main auditorium projection.',
    },
    {
      station: 'Station 04',
      title: 'Robotics Track Calibration & Inspection',
      venue: 'Room N-204 & Basement Arena',
      format: 'LFR Dimension Check (≤25cm) & Free Trial',
      icon: Cpu,
      badge: 'Group B, C, D',
      desc: 'Pre-event dimensional audit and test runs on the official vinyl track. Teams secure booth allocations in the Basement Hardware Showcase.',
    },
  ];

  // Day 2 Data
  const day2Ongoing: OngoingItem[] = [
    {
      title: 'Robot Display & Hardware Showcase',
      time: 'Whole Day (09:00 AM – 06:00 PM)',
      venue: 'SJIS Basement Arena',
      format: 'Live Exhibition',
      tag: 'ROBOTICS',
    },
    {
      title: 'Gaming Championship: Valorant & EA Sports FC',
      time: '10:00 AM – 05:00 PM',
      venue: 'New Building-1 (Dedicated Gaming Zone)',
      format: 'LAN Knockout Stage',
      tag: 'ESPORTS',
    },
    {
      title: 'Contestant Submissions Window (Digital Art, Montage, Memes & Photos)',
      time: '09:30 AM – 01:00 PM',
      venue: 'Media Lab Submission Desk',
      format: 'Soft Copy (Pendrive/Cloud) & Hard Copy for Photography',
      tag: 'SUBMISSION',
    },
  ];

  const day2Events: TimelineEvent[] = [
    {
      title: "Rubik's Cube Speedcubing Championship",
      category: 'CONTEST',
      mainTime: '09:40 AM – 11:00 AM',
      venue: 'Main Stage Arena',
      note: 'Followed by Celebrity Fun Interaction Session',
      groupSlots: [
        { group: 'Group B', time: '09:40 AM – 10:00 AM', venue: 'Stage' },
        { group: 'Group A', time: '10:00 AM – 10:20 AM', venue: 'Stage' },
        { group: 'Group C', time: '10:20 AM – 10:40 AM', venue: 'Stage' },
        { group: 'Group D', time: '10:40 AM – 11:00 AM', venue: 'Stage' },
      ],
    },
    {
      title: 'Tech Article Writing',
      category: 'CONTEST',
      mainTime: '09:40 AM – 11:00 AM',
      venue: 'Room S-305 (Indoor Academic Wing)',
      groupSlots: [
        { group: 'Group A', time: '09:40 AM – 10:00 AM', room: 'Room S-305' },
        { group: 'Group B', time: '10:00 AM – 10:20 AM', room: 'Room S-305' },
        { group: 'Group D', time: '10:20 AM – 10:40 AM', room: 'Room S-305' },
        { group: 'Group C', time: '10:40 AM – 11:00 AM', room: 'Room S-305' },
      ],
    },
    {
      title: 'HTML Web Page Creation',
      category: 'CONTEST',
      mainTime: '09:40 AM – 11:00 AM',
      venue: 'Main Computer Lab',
      waitingRoom: 'Room N-318',
      groupSlots: [
        { group: 'Group D', time: '09:40 AM – 10:00 AM', venue: 'Computer Lab' },
        { group: 'Group C', time: '10:00 AM – 10:20 AM', venue: 'Computer Lab' },
        { group: 'Group A', time: '10:20 AM – 10:40 AM', venue: 'Computer Lab' },
        { group: 'Group B', time: '10:40 AM – 11:00 AM', venue: 'Computer Lab' },
      ],
    },
    {
      title: 'Gaming Quiz (Oral Stage Rounds)',
      category: 'ESPORTS',
      mainTime: '11:00 AM – 01:00 PM',
      venue: 'Room S-303 (Oral Defense Room)',
      groupSlots: [
        { group: 'Group A', time: '11:00 AM – 11:30 AM', room: 'Room S-303' },
        { group: 'Group B', time: '11:30 AM – 12:00 PM', room: 'Room S-303' },
        { group: 'Group C', time: '12:00 PM – 12:30 PM', room: 'Room S-303' },
        { group: 'Group D', time: '12:30 PM – 01:00 PM', room: 'Room S-303' },
      ],
    },
    {
      title: 'Typing Contest (SwiftType Blitz)',
      category: 'CONTEST',
      mainTime: '11:00 AM – 01:00 PM',
      venue: 'Computer Lab',
      waitingRoom: 'Room N-318',
      groupSlots: [
        { group: 'Group C', time: '11:00 AM – 11:30 AM', venue: 'Computer Lab' },
        { group: 'Group D', time: '11:30 AM – 12:00 PM', venue: 'Computer Lab' },
        { group: 'Group B', time: '12:00 PM – 12:30 PM', venue: 'Computer Lab' },
        { group: 'Group A', time: '12:30 PM – 01:00 PM', venue: 'Computer Lab' },
      ],
    },
    {
      title: 'Lunch, Prayer & Refreshment Break',
      category: 'BREAK',
      mainTime: '01:00 PM – 02:30 PM',
      venue: 'SJIS Cafeteria & Prayer Hall',
      note: 'All competitive arenas paused for afternoon prayer and contestants lunch.',
    },
    {
      title: 'AI Prompting Challenge (Live LLM Arena)',
      category: 'FLAGSHIP',
      mainTime: '02:40 PM – 05:00 PM',
      venue: 'Computer Lab',
      waitingRoom: 'Room N-318',
      groupSlots: [
        { group: 'Group C', time: '02:40 PM – 03:10 PM', venue: 'Computer Lab' },
        { group: 'Group D', time: '03:15 PM – 03:45 PM', venue: 'Computer Lab' },
        { group: 'Group B', time: '03:50 PM – 04:20 PM', venue: 'Computer Lab' },
        { group: 'Group A', time: '04:25 PM – 05:00 PM', venue: 'Computer Lab' },
      ],
    },
    {
      title: 'PowerPoint Presentation Jury Defense',
      category: 'CONTEST',
      mainTime: '02:40 PM – 05:00 PM',
      venue: 'Rooms S-303 & S-305',
      groupSlots: [
        { group: 'Group A', time: '02:40 PM – 03:10 PM', room: 'Room S-303' },
        { group: 'Group B', time: '03:15 PM – 03:45 PM', room: 'Room S-303' },
        { group: 'Group C', time: '03:50 PM – 04:20 PM', room: 'Room S-305' },
        { group: 'Group D', time: '04:25 PM – 05:00 PM', room: 'Room S-305' },
      ],
    },
    {
      title: 'Treasure Hunt (Groups A & B)',
      category: 'CONTEST',
      mainTime: '02:40 PM – 04:20 PM',
      venue: 'Campus Grounds, Stage & Designated Classrooms',
      note: 'Cross-campus cipher solving and physical exploration missions.',
      groupSlots: [
        { group: 'Group B', time: '02:40 PM – 03:10 PM', venue: 'Campus Grounds' },
        { group: 'Group A', time: '03:15 PM – 03:45 PM', venue: 'Campus Grounds' },
        { group: 'Group B', time: '03:50 PM – 04:20 PM', venue: 'Round 2 / Final Checkpoints' },
        { group: 'Group A', time: '03:50 PM – 04:20 PM', venue: 'Round 2 / Final Checkpoints' },
      ],
    },
    {
      title: 'Tech Art Bonanza (Digital Art Presentation)',
      category: 'FLAGSHIP',
      mainTime: '04:30 PM – 06:00 PM',
      venue: 'Main Stage Arena',
      note: 'Live on-stage defense & projection of digital artwork submissions.',
      groupSlots: [
        { group: 'Group A', time: '04:30 PM – 04:50 PM', venue: 'Stage' },
        { group: 'Group B', time: '04:55 PM – 05:15 PM', venue: 'Stage' },
        { group: 'Group C', time: '05:20 PM – 05:40 PM', venue: 'Stage' },
        { group: 'Group D', time: '05:40 PM – 06:00 PM', venue: 'Stage' },
      ],
    },
  ];

  // Day 3 Data
  const day3Ongoing: OngoingItem[] = [
    {
      title: 'Robot Display & Hardware Showcase',
      time: '09:00 AM – 01:00 PM',
      venue: 'SJIS Basement Arena',
      format: 'Public Exhibition',
      tag: 'ROBOTICS',
    },
    {
      title: 'Photography Exhibition Gallery',
      time: '09:00 AM – 01:00 PM',
      venue: 'SJIS Basement Exhibition Hall',
      format: 'Physical Prints Display',
      tag: 'EXHIBITION',
    },
    {
      title: 'Gaming Competition Finals: Valorant & EA Sports FC',
      time: '10:00 AM – 05:00 PM',
      venue: 'New Building-1 (Dedicated Gaming Zone)',
      format: 'Grand Finals & Live Casters',
      tag: 'ESPORTS',
    },
  ];

  const day3Events: TimelineEvent[] = [
    {
      title: 'Photography Jury Evaluation & Scoring',
      category: 'CONTEST',
      mainTime: '09:40 AM – 11:00 AM',
      venue: 'Basement Exhibition Hall',
      groupSlots: [
        { group: 'Group D', time: '09:40 AM – 10:00 AM', venue: 'Basement' },
        { group: 'Group C', time: '10:00 AM – 10:20 AM', venue: 'Basement' },
        { group: 'Group B', time: '10:20 AM – 10:40 AM', venue: 'Basement' },
        { group: 'Group A', time: '10:40 AM – 11:00 AM', venue: 'Basement' },
      ],
    },
    {
      title: 'Tech Meme Showcase & Defense',
      category: 'CONTEST',
      mainTime: '09:40 AM – 11:00 AM',
      venue: 'Main Stage Arena',
      groupSlots: [
        { group: 'Group A', time: '09:40 AM – 10:00 AM', venue: 'Stage' },
        { group: 'Group B', time: '10:00 AM – 10:20 AM', venue: 'Stage' },
        { group: 'Group D', time: '10:20 AM – 10:40 AM', venue: 'Stage' },
        { group: 'Group C', time: '10:40 AM – 11:00 AM', venue: 'Stage' },
      ],
    },
    {
      title: 'Tech Quiz (Academic Elimination & Finals)',
      category: 'CONTEST',
      mainTime: '09:40 AM – 11:00 AM',
      venue: 'Room N-203',
      waitingRoom: 'Room N-202',
      groupSlots: [
        { group: 'Group A', time: '09:40 AM – 10:00 AM', room: 'Room N-203' },
        { group: 'Group B', time: '10:00 AM – 10:20 AM', room: 'Room N-203' },
        { group: 'Group D', time: '10:20 AM – 10:40 AM', room: 'Room N-203' },
        { group: 'Group C', time: '10:40 AM – 11:00 AM', room: 'Room N-203' },
      ],
    },
    {
      title: 'Line Follower Robot (LFR) Autonomous Track Trials',
      category: 'ROBOTICS',
      mainTime: '09:40 AM – 11:00 AM',
      venue: 'Room N-204 (Robotics Track Arena)',
      groupSlots: [
        { group: 'Group B', time: '09:40 AM – 10:00 AM', room: 'Room N-204' },
        { group: 'Group A', time: '10:00 AM – 10:20 AM', room: 'Room N-204' },
        { group: 'Group C', time: '10:20 AM – 10:40 AM', room: 'Room N-204' },
        { group: 'Group D', time: '10:40 AM – 11:00 AM', room: 'Room N-204' },
      ],
    },
    {
      title: 'Coding Marathon (Algorithmic / Scratch Programming)',
      category: 'FLAGSHIP',
      mainTime: '09:40 AM – 11:00 AM',
      venue: 'Computer Lab',
      groupSlots: [
        { group: 'Group C', time: '09:40 AM – 10:00 AM', venue: 'Computer Lab' },
        { group: 'Group D', time: '10:00 AM – 10:20 AM', venue: 'Computer Lab' },
        { group: 'Group A', time: '10:20 AM – 10:40 AM', venue: 'Computer Lab' },
        { group: 'Group B', time: '10:40 AM – 11:00 AM', venue: 'Computer Lab' },
      ],
    },
    {
      title: 'Special Interactive Tech Workshop by VTutor',
      category: 'WORKSHOP',
      mainTime: '11:00 AM – 12:00 PM',
      venue: 'Room S-301',
      note: 'Hands-on practical skill session led by official learning partner VTutor.',
    },
    {
      title: 'Game Sync Symphony (Gaming Video Montage Defense)',
      category: 'CONTEST',
      mainTime: '11:00 AM – 01:00 PM',
      venue: 'Computer Lab',
      groupSlots: [
        { group: 'Group C', time: '11:00 AM – 11:30 AM', venue: 'Computer Lab' },
        { group: 'Group D', time: '11:30 AM – 12:00 PM', venue: 'Computer Lab' },
        { group: 'Group B', time: '12:00 PM – 12:30 PM', venue: 'Computer Lab' },
        { group: 'Group A', time: '12:30 PM – 01:00 PM', venue: 'Computer Lab' },
      ],
    },
    {
      title: 'Drone Obstacle Flight Competition',
      category: 'ROBOTICS',
      mainTime: '11:50 AM – 01:00 PM',
      venue: 'Main Stage / Open Flight Arena',
      groupSlots: [
        { group: 'Group C', time: '11:50 AM – 12:20 PM', venue: 'Flight Arena' },
        { group: 'Group D', time: '12:25 PM – 01:00 PM', venue: 'Flight Arena' },
      ],
    },
    {
      title: 'Treasure Hunt (Groups C & D)',
      category: 'CONTEST',
      mainTime: '11:30 AM – 01:00 PM',
      venue: 'Campus Grounds, Stage & Designated Classrooms',
      note: 'Advanced mystery quests & technological puzzle stations across campus.',
      groupSlots: [
        { group: 'Group C', time: '11:30 AM – 12:15 PM', venue: 'Campus Grounds' },
        { group: 'Group D', time: '12:15 PM – 01:00 PM', venue: 'Campus Grounds' },
      ],
    },
    {
      title: 'Lunch, Prayer & Closing Ceremony Preparations',
      category: 'BREAK',
      mainTime: '01:00 PM – 03:00 PM',
      venue: 'SJIS Cafeteria & Prayer Hall',
      note: 'Contestants and guests assemble in Main Auditorium by 02:45 PM.',
    },
  ];

  // Closing Ceremony Timeline
  const closingCeremonySteps = [
    { time: '03:00 PM – 03:05 PM', title: 'Guard of Honour', desc: 'Guests received with floral tribute on stage' },
    { time: '03:05 PM – 03:10 PM', title: 'National Anthem, Josephite Song & Speech of Vice Principal', desc: 'Speech by Br. Bikash Victor Rozario, CSC (Crest presentation)' },
    { time: '03:10 PM – 03:15 PM', title: 'Musical Performance', desc: 'Special vocal and instrumental performance' },
    { time: '03:15 PM – 03:20 PM', title: 'Speech of President, JTC', desc: 'Address by Siam Ulla Aziz, President of Josephite Tech Club' },
    { time: '03:20 PM – 03:30 PM', title: 'Speech of Chief Guest', desc: 'Keynote address & presentation of honorary crest' },
    { time: '03:30 PM – 03:35 PM', title: 'Cultural Dance Performance', desc: 'St. Joseph student cultural presentation' },
    { time: '03:35 PM – 03:40 PM', title: 'Speech of Chief Convener, JTC', desc: 'Address by Snigdha K. Paul, Chief Convener (Crest presentation)' },
    { time: '03:45 PM – 03:55 PM', title: 'Speech of Special Guest', desc: 'Distinguished guest address & honorary crest handover' },
    { time: '03:55 PM – 04:00 PM', title: 'Speech of Chief Advisor', desc: 'Address by the Chief Advisor of Josephite Tech Club' },
    { time: '04:05 PM – 04:10 PM', title: 'Grand Cultural Dance', desc: 'Special thematic dance performance' },
    { time: '04:10 PM – 04:15 PM', title: 'Vote of Thanks by Principal', desc: 'Official concluding remarks by Brother Chandon B. Gomes, CSC, Principal' },
    { time: '04:20 PM – 06:00 PM', title: 'Grand Award & Prize Giving Ceremony', desc: 'Distribution of Champion Crests, Medals, Certificates & Best Institution Shield across all 17 arenas' },
  ];

  // Cultural Program
  const culturalProgramSteps = [
    { time: '06:00 PM – 06:15 PM', title: 'High-Tech Fashion Show', duration: '15 Mins', icon: Sparkles },
    { time: '06:15 PM – 06:30 PM', title: 'Spectacular Laser Light Show', duration: '15 Mins', icon: Zap },
    { time: '06:30 PM – 07:30 PM', title: 'Live Music Concert', duration: '1 Hour', icon: Music },
    { time: '07:30 PM – 07:40 PM', title: 'Grand Carnival Finale & Farewell', duration: '10 Mins', icon: Trophy },
  ];

  // Filter events by group
  const filteredEvents = useMemo(() => {
    const list = activeDay === 'day1' ? day1Events : activeDay === 'day2' ? day2Events : activeDay === 'day3' ? day3Events : [];
    if (selectedGroup === 'ALL') return list;

    return list.filter((ev) => {
      if (ev.category === 'BREAK' || ev.category === 'CEREMONY') return true;
      if (!ev.groupSlots || ev.groupSlots.length === 0) return true;
      return ev.groupSlots.some((slot) => slot.group.toLowerCase() === selectedGroup.toLowerCase());
    });
  }, [activeDay, selectedGroup, day1Events, day2Events, day3Events]);

  const getCategoryBadgeClass = (category: TimelineEvent['category']) => {
    switch (category) {
      case 'FLAGSHIP':
        return 'bg-gold/20 text-gold border-gold/50';
      case 'ROBOTICS':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'ESPORTS':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'CONTEST':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'WORKSHOP':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'SUBMISSION':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'CEREMONY':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'CULTURAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'BREAK':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      default:
        return 'bg-surface text-slate-300 border-surface-border';
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto" id="schedule">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-gold uppercase mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>Official Event Itinerary</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
          3-Day Carnival Schedule
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-3">
          Organized by <strong className="text-white">Josephite Tech Club (JTC)</strong> • October 1st, 2nd, & 3rd, 2026
        </p>
      </div>

      {/* Day Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        {[
          { id: 'day1', label: 'Day 1 • Oct 1 (Thu)', subtitle: '09:00 AM – 05:00 PM • Inauguration & Submissions' },
          { id: 'day2', label: 'Day 2 • Oct 2 (Fri)', subtitle: '09:00 AM – 06:00 PM • Competitions' },
          { id: 'day3', label: 'Day 3 • Oct 3 (Sat)', subtitle: '09:00 AM – 08:00 PM • Finals & Gala' },
        ].map((tab) => {
          const isActive = activeDay === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveDay(tab.id as DayKey);
                setSelectedGroup('ALL');
              }}
              className={`px-5 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer flex flex-col items-center gap-1 text-center ${
                isActive
                  ? 'bg-gradient-to-r from-gold via-yellow-400 to-amber-500 text-slate-950 shadow-xl shadow-gold/25 font-black scale-105 border-transparent'
                  : 'bg-surface/80 text-slate-300 border border-surface-border hover:border-gold/50 hover:text-white'
              }`}
            >
              <span className="leading-tight">{tab.label}</span>
              <span className={`text-[10px] font-mono font-normal ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                {tab.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* ALL DAYS CONTENT */}
      <div className="space-y-8">
        {/* Day Overview Banner */}
        <div className="p-6 rounded-2xl bg-surface/90 border border-surface-border backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="gold" size="sm">
                {activeDay === 'day1' ? 'Day 01 • Thursday' : activeDay === 'day2' ? 'Day 02 • Friday' : 'Day 03 • Saturday'}
              </Badge>
              <span className="text-xs font-mono text-slate-400">
                {activeDay === 'day1' ? 'Oct 1, 2026' : activeDay === 'day2' ? 'Oct 2, 2026' : 'Oct 3, 2026'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display">
              {activeDay === 'day1'
                ? 'Grand Inauguration Ceremony & Exclusive St. Joseph Student Submissions'
                : activeDay === 'day2'
                ? 'Major Competitions, Lab Contests & On-Stage Presentations'
                : 'Championship Finals, Grand Closing Ceremony & Cultural Gala'}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5 text-gold-light">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                St. Joseph International School Premises
              </span>
              <span className="flex items-center gap-1.5 text-sky-300">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                {activeDay === 'day1' ? '09:00 AM – 05:00 PM' : activeDay === 'day2' ? '09:00 AM – 06:00 PM' : '09:00 AM – 08:00 PM'}
              </span>
            </div>
          </div>

          {/* Group Filter Pills */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-gold" /> Filter by Academic Group:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(['ALL', 'Group A', 'Group B', 'Group C', 'Group D'] as GroupFilter[]).map((grp) => (
                <button
                  key={grp}
                  onClick={() => setSelectedGroup(grp)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedGroup === grp
                      ? 'bg-gold text-slate-950 shadow-md shadow-gold/20 font-black'
                      : 'bg-surface-elevated text-slate-300 hover:text-white hover:bg-surface-border border border-surface-border'
                  }`}
                >
                  {grp === 'ALL' ? 'All Groups' : grp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ongoing Arenas & Submissions Showcase */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-gold flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5" /> Full-Day Ongoing Arenas & Submission Windows
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(activeDay === 'day1' ? day1Ongoing : activeDay === 'day2' ? day2Ongoing : day3Ongoing).map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-surface-elevated/90 border border-surface-border hover:border-gold/40 transition-colors flex flex-col justify-between gap-2.5"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-surface border border-surface-border text-gold">
                        {item.tag}
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gold" /> {item.time}
                      </span>
                    </div>
                    <h5 className="font-bold text-white text-sm leading-snug">{item.title}</h5>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1 pt-2 border-t border-surface-border/60">
                    <div className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{item.venue}</span>
                    </div>
                    {item.format && (
                      <div className="text-[11px] text-gold-light italic">
                        {item.format}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitions Timeline Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-gold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Scheduled Contests & Arena Segments
              </h4>
              {selectedGroup !== 'ALL' && (
                <span className="text-xs font-mono text-sky-400">
                  Showing events for {selectedGroup}
                </span>
              )}
            </div>

            {filteredEvents.length === 0 ? (
              <div className="p-8 rounded-xl bg-surface/50 border border-surface-border text-center text-slate-400 text-sm">
                No events found matching your filter. Select "All Groups" to see all segments.
              </div>
            ) : (
              filteredEvents.map((ev, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    ev.category === 'BREAK'
                      ? 'bg-surface/50 border-dashed border-slate-700'
                      : 'bg-surface-elevated/90 border-surface-border hover:border-gold/40'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="px-3 py-1 rounded-lg bg-surface border border-gold/30 text-gold font-mono text-xs font-bold inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{ev.mainTime}</span>
                        </div>
                        <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold border ${getCategoryBadgeClass(ev.category)}`}>
                          {ev.category}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                          {ev.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 mt-1">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                            <span>{ev.venue}</span>
                          </div>
                          {ev.waitingRoom && (
                            <div className="flex items-center gap-1 text-amber-300 font-mono">
                              <span>Waiting Room: {ev.waitingRoom}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {ev.note && (
                        <p className="text-xs text-slate-300 italic bg-surface/60 px-3 py-1.5 rounded-lg border border-surface-border inline-block">
                          ℹ️ {ev.note}
                        </p>
                      )}
                    </div>

                    {/* Right: Group Slots Grid */}
                    {ev.groupSlots && ev.groupSlots.length > 0 && (
                      <div className="lg:w-96 shrink-0 bg-surface/80 p-3 rounded-xl border border-surface-border/80">
                        <div className="text-[11px] font-mono uppercase font-bold text-slate-400 mb-2 flex items-center justify-between">
                          <span>Group Slots</span>
                          <span>Time & Room</span>
                        </div>
                        <div className="space-y-1.5">
                          {ev.groupSlots.map((slot, sIdx) => {
                            const isHighlighted = selectedGroup !== 'ALL' && slot.group.toLowerCase() === selectedGroup.toLowerCase();
                            return (
                              <div
                                key={sIdx}
                                className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                                  isHighlighted
                                    ? 'bg-gold/20 border-gold text-gold font-bold'
                                    : 'bg-surface-elevated/80 border-surface-border text-slate-200'
                                }`}
                              >
                                <span className="font-bold flex items-center gap-1">
                                  {isHighlighted && <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />}
                                  {slot.group}
                                </span>
                                <div className="text-right font-mono text-[11px]">
                                  <span className="text-slate-300 font-semibold">{slot.time}</span>
                                  {slot.room && <span className="text-amber-400 ml-1">({slot.room})</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DAY 1 EXCLUSIVE: INAUGURATION PROGRAM & JOSEPHITE SUBMISSION PROTOCOL */}
          {activeDay === 'day1' && (
            <div className="pt-6 space-y-8">
              {/* Grand Inauguration Program Itinerary */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-surface via-sjis-royal/40 to-surface-elevated border border-gold/40 shadow-xl shadow-amber-500/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-surface-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="gold" size="sm">
                        Auditorium Grand Opening
                      </Badge>
                      <span className="text-xs font-mono text-gold-light">09:00 AM – 11:45 AM</span>
                    </div>
                    <h3 className="text-2xl font-black text-white font-display mt-1">
                      Grand Carnival Inauguration Program
                    </h3>
                  </div>
                  <Badge variant="champagne" size="md">
                    Ceremonial Order & Dignitary Addresses
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {day1InaugurationSteps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3.5 rounded-xl bg-surface/80 border border-surface-border flex items-start gap-3 hover:border-gold/30 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gold/15 text-gold flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 border border-gold/30">
                        {sIdx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-gold-light">{step.time}</span>
                        </div>
                        <h5 className="font-bold text-white text-sm">{step.title}</h5>
                        <p className="text-xs text-slate-400">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exclusive St. Joseph Submission Desks & Protocol Hub */}
              <div className="p-6 sm:p-8 rounded-2xl bg-surface-elevated border border-gold/30 shadow-xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-surface-border relative z-10">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        Internal Submission Day
                      </span>
                      <span className="text-xs font-mono text-slate-400">11:45 AM – 04:30 PM</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                      St. Joseph Students Exclusive Submission Desks
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
                      Day 1 is strictly reserved for <strong className="text-white">St. Joseph International School students</strong> to turn in physical and digital project submissions, conduct track trials, and receive official delegate accreditation before external teams arrive.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface/90 border border-amber-500/30 text-amber-200 text-xs max-w-xs shrink-0 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold mb-0.5">External Institutions:</strong>
                      Submissions for guest schools/colleges open on <span className="text-gold font-bold">Day 2 Morning (09:30 AM – 01:00 PM)</span> at Central Registration.
                    </div>
                  </div>
                </div>

                {/* 4 Dedicated Submission Stations */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6 relative z-10">
                  {day1SubmissionDesks.map((station, sIdx) => {
                    const Icon = station.icon;
                    return (
                      <div
                        key={sIdx}
                        className="p-5 rounded-xl bg-surface/90 border border-surface-border hover:border-gold/50 transition-all flex flex-col justify-between space-y-4 group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center border border-gold/30 group-hover:scale-105 transition-transform">
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-surface border border-surface-border">
                              {station.station}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface border border-amber-500/30 text-gold-light font-semibold">
                              {station.badge}
                            </span>
                            <h5 className="font-bold text-white text-base mt-2 leading-snug">{station.title}</h5>
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed">
                            {station.desc}
                          </p>
                        </div>

                        <div className="space-y-1.5 pt-3 border-t border-surface-border text-xs">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                            <span className="truncate">{station.venue}</span>
                          </div>
                          <div className="text-[11px] font-mono text-amber-300">
                            {station.format}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Checklist / Directives for Josephites */}
                <div className="p-4 rounded-xl bg-surface/80 border border-surface-border relative z-10">
                  <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-gold mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Mandatory Josephite Submission Checklist:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="text-gold font-bold">•</span>
                      <span><strong>Student ID:</strong> Keep St. Joseph ID card or College Roll card ready at verification.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gold font-bold">•</span>
                      <span><strong>USB Drive Label:</strong> Save folder as <code>[Name]_[Class]_[Roll]_[Event]</code>.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gold font-bold">•</span>
                      <span><strong>7×9 Photo Print:</strong> Strictly laminated; back signed with Name, Class, Group & Title.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gold font-bold">•</span>
                      <span><strong>Signed Receipt:</strong> Retain the JTC stamped counter-slip for Day 3 award claims.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DAY 3 EXCLUSIVE: CLOSING CEREMONY & CULTURAL PROGRAM */}
          {activeDay === 'day3' && (
            <div className="pt-6 space-y-8">
              {/* Grand Closing Ceremony Itinerary */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-surface via-sjis-royal/40 to-surface-elevated border border-gold/40 shadow-xl shadow-amber-500/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-surface-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="gold" size="sm">
                        Auditorium Grand Ceremony
                      </Badge>
                      <span className="text-xs font-mono text-gold-light">03:00 PM – 06:00 PM</span>
                    </div>
                    <h3 className="text-2xl font-black text-white font-display mt-1">
                      Grand Closing & Award Ceremony
                    </h3>
                  </div>
                  <Badge variant="champagne" size="md">
                    Stage Gala & Crest Handover
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {closingCeremonySteps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3.5 rounded-xl bg-surface/80 border border-surface-border flex items-start gap-3 hover:border-gold/30 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gold/15 text-gold flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 border border-gold/30">
                        {sIdx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-gold-light">{step.time}</span>
                        </div>
                        <h5 className="font-bold text-white text-sm">{step.title}</h5>
                        <p className="text-xs text-slate-400">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cultural Program Finale */}
              <div className="p-6 sm:p-8 rounded-2xl bg-surface-elevated border border-surface-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-surface-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="purple" size="sm">
                        Carnival Grand Finale
                      </Badge>
                      <span className="text-xs font-mono text-slate-300">06:00 PM – 08:00 PM</span>
                    </div>
                    <h3 className="text-2xl font-black text-white font-display mt-1">
                      Grand Cultural Program
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">Open to all participants & guests</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {culturalProgramSteps.map((prog, pIdx) => {
                    const Icon = prog.icon;
                    return (
                      <div
                        key={pIdx}
                        className="p-5 rounded-xl bg-surface/90 border border-surface-border hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/40">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-mono font-bold text-gold px-2.5 py-0.5 rounded-full bg-surface border border-surface-border">
                            {prog.duration}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] font-mono text-slate-400">{prog.time}</span>
                          <h5 className="font-bold text-white text-base mt-0.5">{prog.title}</h5>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
    </section>
  );
}
