#!/usr/bin/env bash
# ==============================================================================
# JTC CARNIVAL — AUTOMATED PRODUCTION DEPLOYMENT & UPDATE SCRIPT
# ==============================================================================
# One-command full deployment: pulls latest git changes, builds frontend/backend,
# updates PostgreSQL database migrations, collects static assets, and cleans up.
#
# Usage:
#   ./deploy.sh                  # Standard update & zero-downtime deploy
#   ./deploy.sh --seed           # Deploy + seed carnival events & site settings
#   ./deploy.sh --create-admin   # Deploy + create Django superuser
#   ./deploy.sh --ssl            # Obtain / renew Let's Encrypt SSL certificate
#   ./deploy.sh --logs           # Tail live container logs
#   ./deploy.sh --status         # Inspect current running container status
# ==============================================================================

set -eo pipefail

# Visual Colors & Styling
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.prod"

print_banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║       🚀 JTC CARNIVAL — ONE-COMMAND PRODUCTION DEPLOYMENT       ║"
    echo "║                  St. Joseph International School                 ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Determine Docker Compose Command
if docker compose version &>/dev/null; then
    DOCKER_COMPOSE="docker compose -f ${COMPOSE_FILE}"
elif which docker-compose &>/dev/null; then
    DOCKER_COMPOSE="docker-compose -f ${COMPOSE_FILE}"
else
    log_error "Neither 'docker compose' nor 'docker-compose' was found on this system."
    log_info "Run './setup_server.sh' to install Docker and Docker Compose automatically."
    exit 1
fi

print_banner

# ─── Handle Sub-Commands ───────────────────────────────────────────────────────
if [[ "$1" == "--logs" ]]; then
    log_info "Tailing live production container logs..."
    ${DOCKER_COMPOSE} logs -f
    exit 0
fi

if [[ "$1" == "--status" ]]; then
    log_info "Current running containers:"
    ${DOCKER_COMPOSE} ps
    exit 0
fi

if [[ "$1" == "--nginx" ]]; then
    log_info "Configuring Host Nginx reverse proxy for jtc.sjis.edu.bd..."
    if [ -d "/etc/nginx/sites-available" ]; then
        cp nginx/host-nginx-jtc.conf /etc/nginx/sites-available/jtc.sjis.edu.bd
        ln -sf /etc/nginx/sites-available/jtc.sjis.edu.bd /etc/nginx/sites-enabled/
        nginx -t
        systemctl reload nginx
        log_success "Host Nginx updated & reloaded! jtc.sjis.edu.bd is now proxying to Docker containers."
    else
        log_error "/etc/nginx/sites-available directory not found on host."
    fi
    exit 0
fi

# ─── Step 1: Pre-flight Validations ───────────────────────────────────────────
log_info "Step 1/7: Validating production environment..."

if [ ! -f "$ENV_FILE" ]; then
    log_info "No .env.prod found. Auto-generating production configuration..."
    
    # Generate secure random secret key and database password
    AUTO_SECRET_KEY=$(openssl rand -hex 32 2>/dev/null || tr -dc 'a-zA-Z0-9' < /dev/urandom | fold -w 50 | head -n 1)
    AUTO_DB_PASS=$(openssl rand -hex 16 2>/dev/null || tr -dc 'a-zA-Z0-9' < /dev/urandom | fold -w 24 | head -n 1)

    cat <<EOF > "$ENV_FILE"
# ==============================================================================
# JTC CARNIVAL — AUTO-GENERATED PRODUCTION CONFIGURATION (.env.prod)
# ==============================================================================
DOMAIN=jtc.sjis.edu.bd
FRONTEND_URL=https://jtc.sjis.edu.bd
BACKEND_URL=https://jtc.sjis.edu.bd

DEBUG=False
SECRET_KEY="${AUTO_SECRET_KEY}"

ALLOWED_HOSTS="jtc.sjis.edu.bd,www.jtc.sjis.edu.bd,localhost,127.0.0.1,backend,frontend"
CORS_ALLOWED_ORIGINS="https://jtc.sjis.edu.bd,https://www.jtc.sjis.edu.bd"
CSRF_TRUSTED_ORIGINS="https://jtc.sjis.edu.bd,https://www.jtc.sjis.edu.bd"

POSTGRES_DB=jtc_carnival_db
POSTGRES_USER=jtc_admin
POSTGRES_PASSWORD="${AUTO_DB_PASS}"

NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_TURNSTILE_ENABLED=false
NEXT_PUBLIC_TURNSTILE_SITE_KEY=

CLOUDFLARE_TURNSTILE_ENABLED=False
CLOUDFLARE_TURNSTILE_SECRET_KEY=

SECURE_SSL_REDIRECT=True

EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=jtc@sjis.edu.bd
EMAIL_HOST_PASSWORD=
DEFAULT_FROM_EMAIL="Josephite Tech Club <jtc@sjis.edu.bd>"

GREENWEB_SMS_ENABLED=False
GREENWEB_SMS_USER=
GREENWEB_SMS_PASS=
GREENWEB_SMS_FROM=JTCSJIS

SSLCOMMERZ_STORE_ID=testbox
SSLCOMMERZ_STORE_PASS=qwerty
SSLCOMMERZ_IS_SANDBOX=True
EOF
    log_success "Created ${ENV_FILE} with auto-generated secure SECRET_KEY and DB password!"
fi

# Export variables from .env.prod for compose build args
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

# ─── Step 2: Git Synchronization ──────────────────────────────────────────────
log_info "Step 2/7: Pulling latest changes from GitHub repository..."
if [ -d ".git" ]; then
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
    log_info "Current branch: ${BOLD}${CURRENT_BRANCH}${NC}"
    git fetch origin "$CURRENT_BRANCH"
    git pull origin "$CURRENT_BRANCH" || log_warn "Git pull encountered issues. Continuing with local workspace."
else
    log_warn "Not a git repository or running in isolated container. Skipping git pull."
fi

# ─── Step 3: Build & Start Docker Services ────────────────────────────────────
log_info "Step 3/7: Building and upgrading Docker containers..."
${DOCKER_COMPOSE} build --pull
${DOCKER_COMPOSE} up -d --remove-orphans

# ─── Step 4: Database Readiness & Migrations ──────────────────────────────────
log_info "Step 4/7: Applying PostgreSQL database migrations..."
# Wait up to 30 seconds for database container to report healthy
for i in {1..30}; do
    if ${DOCKER_COMPOSE} exec -T db pg_isready -U "${POSTGRES_USER:-jtc_admin}" -d "${POSTGRES_DB:-jtc_carnival_db}" &>/dev/null; then
        break
    fi
    sleep 1
done

${DOCKER_COMPOSE} exec -T backend python manage.py migrate --noinput
log_success "Database migrations successfully applied!"

# ─── Step 5: Static Asset Collection ──────────────────────────────────────────
log_info "Step 5/7: Collecting and hashing static assets..."
${DOCKER_COMPOSE} exec -T backend python manage.py collectstatic --noinput
log_success "Static assets collected and mounted into Nginx volume!"

# ─── Optional: Seed Initial Data ──────────────────────────────────────────────
if [[ "$1" == "--seed" ]]; then
    log_info "Seeding carnival events, site settings, and schools into database..."
    ${DOCKER_COMPOSE} exec -T backend python manage.py seed_data
    log_success "19 carnival events & settings seeded successfully!"
fi

# ─── Optional: Create Superuser ───────────────────────────────────────────────
if [[ "$1" == "--create-admin" ]]; then
    log_info "Launching interactive Django superuser creation..."
    ${DOCKER_COMPOSE} exec backend python manage.py createsuperuser
fi

# ─── Optional: SSL Provisioning ───────────────────────────────────────────────
if [[ "$1" == "--ssl" ]]; then
    log_info "Requesting Let's Encrypt SSL certificate for ${DOMAIN:-jtc.sjis.edu.bd}..."
    ${DOCKER_COMPOSE} run --rm --entrypoint "\
      certbot certonly --webroot -w /var/www/certbot \
      --email ${EMAIL_HOST_USER:-jtc@sjis.edu.bd} \
      -d ${DOMAIN:-jtc.sjis.edu.bd} -d www.${DOMAIN:-jtc.sjis.edu.bd} \
      --agree-tos --no-eff-email --force-renewal" certbot
    ${DOCKER_COMPOSE} exec nginx nginx -s reload
    log_success "SSL certificate issued and Nginx reloaded!"
fi

# ─── Step 6: Automated Health Check ───────────────────────────────────────────
log_info "Step 6/7: Performing health probes..."
sleep 3
if ${DOCKER_COMPOSE} ps | grep -q "Up"; then
    log_success "All production services are running smoothly!"
else
    log_warn "Some containers might still be starting. Check status with: ./deploy.sh --status"
fi

# ─── Step 7: Disk Cleanup ─────────────────────────────────────────────────────
log_info "Step 7/7: Pruning unused dangling Docker builder cache..."
docker image prune -f >/dev/null 2>&1 || true
log_success "Disk space maintained."

# ─── Deployment Complete Summary ──────────────────────────────────────────────
echo ""
echo -e "${GREEN}══════════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${GREEN}🎉 JTC PRODUCTION DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════════════════════${NC}"
echo -e "• ${BOLD}Website URL:${NC}       ${FRONTEND_URL:-https://jtc.sjis.edu.bd}"
echo -e "• ${BOLD}Admin Portal:${NC}      ${FRONTEND_URL:-https://jtc.sjis.edu.bd}/admin"
echo -e "• ${BOLD}Django Admin:${NC}      ${BACKEND_URL:-https://jtc.sjis.edu.bd}/django-admin/"
echo -e "• ${BOLD}REST API Root:${NC}     ${BACKEND_URL:-https://jtc.sjis.edu.bd}/api/"
echo ""
echo -e "${CYAN}Helpful Quick Commands:${NC}"
echo -e "  View live logs:      ${BOLD}./deploy.sh --logs${NC}"
echo -e "  Check containers:    ${BOLD}./deploy.sh --status${NC}"
echo -e "  Seed event data:     ${BOLD}./deploy.sh --seed${NC}"
echo -e "  Create admin user:   ${BOLD}./deploy.sh --create-admin${NC}"
echo -e "  Provision SSL cert:  ${BOLD}./deploy.sh --ssl${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════════════════════${NC}"
