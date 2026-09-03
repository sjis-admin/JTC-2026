# 🚀 JTC Carnival — DigitalOcean Production Deployment Handbook

This guide details the complete process for deploying and maintaining the **Josephite Tech Club (JTC)** Online Registration Platform on a DigitalOcean Ubuntu Droplet using Docker, Docker Compose, Nginx reverse proxy, and PostgreSQL.

---

## 🏗 Architecture Summary

- **Frontend**: Next.js 14 Standalone Mode on `127.0.0.1:3001`
- **Backend**: Django 5 + Gunicorn WSGI on `127.0.0.1:8001`
- **Database**: PostgreSQL 16 Alpine (Isolated internal Docker network)
- **Reverse Proxy**: Host Nginx virtual host (`/etc/nginx/sites-available/jtc.sjis.edu.bd`)
- **SSL**: Certbot via Host Nginx (`sudo certbot --nginx -d jtc.sjis.edu.bd`)
- **Automation**: One-command updates via `./deploy.sh`

---

## ⚡ Deployment on Existing Server with Other Live Sites

If your server is already running `portal.sjis.edu.bd`, `website`, etc., follow these simple steps to ensure **zero downtime or conflict** with your existing sites:

### Step 1: Clone Repository into `/var/www/jtc`
```bash
cd /var/www
git clone https://github.com/sjis-admin/JTC-2026.git jtc
cd jtc
```

### Step 2: Configure Environment Variables
```bash
cp .env.prod.example .env.prod
nano .env.prod
```
Fill in your database credentials, `SECRET_KEY`, and email/SMS keys.

### Step 3: Launch JTC Containers & Seed Database
```bash
chmod +x deploy.sh
./deploy.sh --seed
./deploy.sh --create-admin
```
*(This starts PostgreSQL, Next.js on `127.0.0.1:3001`, and Django on `127.0.0.1:8001`)*

### Step 4: Link Host Nginx Configuration
```bash
# Copy the virtual host config to host nginx
sudo cp nginx/host-nginx-jtc.conf /etc/nginx/sites-available/jtc.sjis.edu.bd

# Enable the site
sudo ln -s /etc/nginx/sites-available/jtc.sjis.edu.bd /etc/nginx/sites-enabled/

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: Issue SSL Certificate via Certbot
```bash
sudo certbot --nginx -d jtc.sjis.edu.bd -d www.jtc.sjis.edu.bd
```
*(Your existing sites `portal.sjis.edu.bd`, `website`, etc. remain completely untouched and running!)*


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
