# Josephite Tech Club (JTC) — Online Registration Platform
### St. Joseph International School (SJIS)
**Official Domain**: `jtc.sjis.edu.bd`  
**Event**: SJIS Inter-School Tech Carnival 2026

---

## 🚀 Overview

A high-performance, dark-themed, glassmorphic registration platform and admin portal engineered for **Josephite Tech Club**. Supports all **19 official events**, automatic grade group eligibility enforcement (Groups A through E), multi-step registration with dynamic fee calculation, instant confirmation pass generation, SMS (GreenWeb) & Email notifications, and a full-featured custom Next.js admin management suite.

---

## 🛠 Tech Stack

- **Backend**: Python 3.14+ / Django 5 / Django REST Framework / SimpleJWT
- **Frontend**: Next.js 14 (App Router) / React 18 / TypeScript / Tailwind CSS / Framer Motion / Lucide Icons / TanStack Query
- **Databases**:
  - **Local Development**: SQLite (`backend/db.sqlite3`)
  - **Production**: PostgreSQL (automatically activated via `DATABASE_URL` environment variable)
- **Notifications**:
  - **SMS**: GreenWeb SMS API integration
  - **Email**: Django SMTP with responsive HTML template

---

## 📂 Project Structure

```
/Volumes/Drive A/SJIS/JTC/
├── backend/
│   ├── jtc_backend/            # Core Django settings, URLs, WSGI
│   ├── apps/
│   │   ├── accounts/           # User authentication & roles
│   │   ├── core/               # SiteSettings, Schools
│   │   ├── events/             # Events (19 competitions), Groups (A-E), FAQs
│   │   └── registrations/      # Participant data, payments, notifications
│   ├── templates/emails/       # HTML confirmation email
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Main Landing Page (Hero, Countdown, Showcase)
│   │   ├── events/             # Event Catalogue & [slug] details
│   │   ├── register/           # Multi-step dynamic registration & success slip
│   │   ├── verify/             # Registration code verification lookup
│   │   └── admin/              # Custom Admin Portal (Auth, Events, Regs, Schools, Settings)
│   ├── components/
│   │   ├── common/             # Navbar, Footer, Providers
│   │   ├── sections/           # Hero, EventsShowcase, EligibilityTable, RulesHighlights, FAQ, Sponsors
│   │   └── ui/                 # Button, Card, Badge, Input, Select, Countdown
│   ├── lib/
│   │   ├── api.ts              # Typed API client
│   │   └── utils.ts            # Utility helpers
│   └── package.json
│
├── run_dev.sh                  # One-command dual server launcher
└── venv/                       # Python virtual environment
```

---

## ⚡ Quick Start

### 1. Run with the single launcher script:
```bash
./run_dev.sh
```
This automatically starts:
- **Django REST API**: `http://127.0.0.1:8000`
- **Next.js Frontend**: `http://127.0.0.1:3000`

---

### 2. Manual Startup (Individual terminals):

**Terminal 1 — Backend (Django):**
```bash
cd backend
source ../venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

**Terminal 2 — Frontend (Next.js):**
```bash
cd frontend
npm run dev
```

---

## 🔑 Default Admin Credentials

- **Admin Portal URL**: [http://127.0.0.1:3000/admin](http://127.0.0.1:3000/admin) (or `/admin/login`)
- **Username**: `admin`
- **Password**: `admin123`
- **Django Standard Admin**: `http://127.0.0.1:8000/django-admin/`

---

## 🏆 Seeded Carnival Events (19 Total)

1. **AI Prompting** (Individual • ৳200 • Grp A–E • BYOD & Zero-Glitch rules)
2. **Coding Marathon** (Individual • ৳300 • Grp A–B Scratch, Grp C–D Python)
3. **Tech-art Bonanza (Digital Art & Poster)** (Individual • ৳300 • Grp A–D • Pendrive submission)
4. **SwiftType Blitz (Typing Competition)** (Individual • ৳200 • Grp A–D • Monkeytype)
5. **PowerPoint Presentation** (Individual • ৳300 • Grp A–D • Stage Presentation)
6. **Gaming Quiz** (Individual • ৳300 • Grp A–D • 3 Rounds)
7. **Webpage Creation** (Individual • ৳300 • Grp A–D • Lab code challenge)
8. **Game Sync Symphony (Montage/AMV)** (Individual • ৳300 • Grp A–D • Video editing package)
9. **Photography Competition** (Individual • ৳200 • Grp A–E • 7×9" laminated exhibition)
10. **Tech Bytes (Article Writing)** (Individual • ৳300 • Grp A–D)
11. **Tech Quiz** (Individual • ৳300 • Grp A–D • Prelims & Stage buzzer)
12. **Tech Meme Contest** (Individual • ৳300 • Grp A–E • Online)
13. **Rubik's Cube Speedcubing** (Individual • ৳200 • Grp A–D • Ao5)
14. **Treasure Hunt** (Team • ৳500 • 3 members per team)
15. **Valorant (E-Sports)** (Team • ৳500 • Online prelims + Stage LAN & FB Live)
16. **EA FC (FIFA E-Sports)** (Individual • ৳200 • LAN on Fest Day)
17. **Robo Showcase** (Individual ৳500 / Team ৳1000 max 3 • Grp C–E)
18. **Line Follower Robot (LFR)** (Individual ৳500 / Team ৳1000 max 3 • Grp B–E)
19. **Drone Competition (Design & Flight)** (Individual ৳500 / Team ৳1000 max 3 • Grp C–D)

---

## ⚙️ Production Deployment on DigitalOcean (`jtc.sjis.edu.bd`)

The application includes an automated, production-ready Docker containerization suite with Nginx reverse proxy, PostgreSQL, and a 1-command deployment pipeline.

### First-Time Server Setup (DigitalOcean Ubuntu):
```bash
# 1. Initialize Docker, Compose, Swap space, and Firewall:
chmod +x setup_server.sh deploy.sh
sudo ./setup_server.sh

# 2. Configure production credentials:
cp .env.prod.example .env.prod
nano .env.prod

# 3. Deploy & Seed initial database:
./deploy.sh --seed

# 4. Create admin account:
./deploy.sh --create-admin
```

### Daily 1-Command Production Updates:
To pull new commits, run migrations, collect static files, and update frontend + backend with zero downtime:
```bash
./deploy.sh
```

For full details on SSL certificates, database backups, and health checks, see [DEPLOYMENT.md](file:///Volumes/Drive%20A/SJIS/JTC/DEPLOYMENT.md).
