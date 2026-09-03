# 🚀 JTC Carnival — DigitalOcean Production Deployment Handbook

This guide details the complete process for deploying and maintaining the **Josephite Tech Club (JTC)** Online Registration Platform on a DigitalOcean Ubuntu Droplet using Docker, Docker Compose, Nginx reverse proxy, and PostgreSQL.

---

## 🏗 Architecture Summary

- **Frontend**: Next.js 14 Standalone Mode (Node 20 Alpine)
- **Backend**: Django 5 + Django REST Framework + Gunicorn WSGI
- **Database**: PostgreSQL 16 Alpine (Isolated on internal Docker network)
- **Reverse Proxy & SSL**: Nginx 1.25 Alpine with Let's Encrypt / Cloudflare SSL
- **Automation**: One-command updates via `./deploy.sh`

---

## ⚡ First-Time Server Setup (5 Minutes)

### Step 1: Create a DigitalOcean Droplet
- **Image**: Ubuntu 22.04 LTS or 24.04 LTS
- **Plan**: Basic Droplet (Regular SSD)
  - Minimum: 1 GB RAM / 1 vCPU (with swap)
  - Recommended: 2 GB RAM / 1 or 2 vCPUs
- **Authentication**: SSH Key (Recommended) or Password
- **Firewall**: Ensure ports `22` (SSH), `80` (HTTP), and `443` (HTTPS) are allowed.

---

### Step 2: Configure DNS Records
Point your domain's DNS `A` records to your DigitalOcean Droplet IP address:
```
Type: A   | Name: @   | Value: <YOUR_DROPLET_IP> | TTL: Auto
Type: A   | Name: www | Value: <YOUR_DROPLET_IP> | TTL: Auto
```
*(Example: `jtc.sjis.edu.bd` -> `<YOUR_DROPLET_IP>`)*

---

### Step 3: Clone Repository & Run Server Initializer
SSH into your Droplet and clone the repository:

```bash
ssh root@<YOUR_DROPLET_IP>

# Clone repository
git clone https://github.com/YOUR_USERNAME/JTC.git /var/www/jtc
cd /var/www/jtc

# Make scripts executable and run server initialization
chmod +x setup_server.sh deploy.sh
sudo ./setup_server.sh
```

`setup_server.sh` will automatically:
1. Update system packages.
2. Install Docker & Docker Compose plugin.
3. Configure a 2GB Swap file for smooth Next.js production builds.
4. Configure Docker daemon log rotation (max 10MB per container).
5. Enable and harden UFW firewall (SSH, HTTP 80, HTTPS 443).

---

### Step 4: Configure Production Environment Variables

Copy the production environment template:
```bash
cp .env.prod.example .env.prod
nano .env.prod
```

Configure your actual production secrets:
```env
DOMAIN=jtc.sjis.edu.bd
FRONTEND_URL=https://jtc.sjis.edu.bd
BACKEND_URL=https://jtc.sjis.edu.bd

# Generate strong secret key
SECRET_KEY=generate_a_random_64_char_key_here

# PostgreSQL Credentials
POSTGRES_DB=jtc_carnival_db
POSTGRES_USER=jtc_admin
POSTGRES_PASSWORD=your_strong_custom_password

# Email & SMS Settings
EMAIL_HOST_USER=jtc@sjis.edu.bd
EMAIL_HOST_PASSWORD=your_app_password
GREENWEB_SMS_USER=your_user
GREENWEB_SMS_PASS=your_pass

# SSLCommerz Payment Gateway
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASS=your_store_pass
SSLCOMMERZ_IS_SANDBOX=False
```

---

### Step 5: Run Initial Deployment & Data Seed

Execute the single deployment command with `--seed`:
```bash
./deploy.sh --seed
```

This single command will:
1. Build the frontend and backend Docker containers.
2. Start all services (`db`, `backend`, `frontend`, `nginx`, `certbot`).
3. Run PostgreSQL database migrations (`manage.py migrate`).
4. Collect and hash static files (`manage.py collectstatic`).
5. Seed site settings, all 19 carnival events, and participating schools.
6. Verify service health.

---

### Step 6: Create Admin Superuser

Create your production administrator account:
```bash
./deploy.sh --create-admin
```
Follow the interactive prompts to set your username, email, and password.

---

### Step 7: Issue Free SSL Certificate (Let's Encrypt)

Once your DNS `A` records have propagated to the droplet:
```bash
./deploy.sh --ssl
```
*Note: If using Cloudflare proxy with Full/Strict SSL, Cloudflare handles the edge certificate automatically.*

---

## 🔄 Daily / Future Updates (The 1-Command Workflow)

Whenever you push new features or bug fixes to GitHub, SSH to the server and run:

```bash
cd /var/www/jtc
./deploy.sh
```

**That is all!** The script automatically:
- Pulls latest Git commits (`git pull`)
- Rebuilds Next.js and Django containers
- Restarts containers with zero/minimal downtime
- Applies new database migrations (`manage.py migrate`)
- Collects updated static assets (`manage.py collectstatic`)
- Tests container health
- Cleans up old builder image cache to save disk space

---

## 🛠 Useful Management Commands

| Action | Command |
| :--- | :--- |
| **Deploy & Update** | `./deploy.sh` |
| **View Live Logs** | `./deploy.sh --logs` |
| **Container Status** | `./deploy.sh --status` |
| **Create Superuser** | `./deploy.sh --create-admin` |
| **Re-seed Events/Settings** | `./deploy.sh --seed` |
| **Renew/Issue SSL** | `./deploy.sh --ssl` |
| **Restart Backend Only** | `docker compose -f docker-compose.prod.yml restart backend` |
| **Restart Frontend Only** | `docker compose -f docker-compose.prod.yml restart frontend` |
| **Django Shell** | `docker compose -f docker-compose.prod.yml exec backend python manage.py shell` |

---

## 💾 PostgreSQL Database Backups

### Create a manual backup:
```bash
docker compose -f docker-compose.prod.yml exec -T db pg_dump -U jtc_admin jtc_carnival_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore from a backup:
```bash
docker compose -f docker-compose.prod.yml exec -T db psql -U jtc_admin jtc_carnival_db < backup_file.sql
```

---

## 🔒 Security Best Practices Implemented

1. **Database Isolation**: PostgreSQL runs on internal network `jtc_internal` without exposing port 5432 to the internet.
2. **Non-Root Containers**: Next.js runs as `nextjs:nodejs` (UID 1001).
3. **Hardened Headers**: HSTS, CSP, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection enabled.
4. **Proxy Headers**: `SECURE_PROXY_SSL_HEADER`, `USE_X_FORWARDED_HOST`, and `CSRF_TRUSTED_ORIGINS` properly configured.
5. **Log Rotation**: Automated Docker daemon log rotation to prevent disk exhaustion.
6. **Disk Hygiene**: Automated image pruning on every deploy.
