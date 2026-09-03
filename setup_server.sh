#!/usr/bin/env bash
# ==============================================================================
# JTC CARNIVAL — DIGITALOCEAN UBUNTU SERVER INITIALIZATION SCRIPT
# ==============================================================================
# Run this once on a fresh DigitalOcean Ubuntu 22.04 or 24.04 Droplet.
# It sets up Docker, Docker Compose, UFW Firewall, Fail2ban, 2GB Swap,
# and Docker daemon log rotation.
#
# Usage:
#   chmod +x setup_server.sh
#   sudo ./setup_server.sh
# ==============================================================================

set -euo pipefail

# Visual Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}[ERROR] This script must be run as root (use: sudo ./setup_server.sh)${NC}" 
   exit 1
fi

echo -e "${BLUE}${BOLD}=== Starting DigitalOcean Ubuntu Production Setup for JTC ===${NC}"

# ─── Step 1: System Update & Essential Packages ──────────────────────────────
echo -e "${BLUE}[1/6] Updating system packages...${NC}"
apt-get update && apt-get upgrade -y
apt-get install -y --no-install-recommends \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    ufw \
    fail2ban \
    htop \
    net-tools

# ─── Step 2: Configure 2GB Swap Space (Crucial for 1GB/2GB Droplets) ──────────
echo -e "${BLUE}[2/6] Configuring 2GB swap space for smooth compilation...${NC}"
if ! swapon --show | grep -q "/swapfile"; then
    fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo 'vm.swappiness=10' >> /etc/sysctl.conf
    echo 'vm.vfs_cache_pressure=50' >> /etc/sysctl.conf
    sysctl -p
    echo -e "${GREEN}Swap configured successfully.${NC}"
else
    echo -e "${YELLOW}Swap is already active.${NC}"
fi

# ─── Step 3: Install Docker & Docker Compose Plugin ──────────────────────────
echo -e "${BLUE}[3/6] Installing official Docker Engine & Docker Compose...${NC}"
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

systemctl enable docker
systemctl start docker

# ─── Step 4: Configure Docker Daemon Log Rotation ─────────────────────────────
echo -e "${BLUE}[4/6] Setting up Docker container log rotation (max 10MB per file)...${NC}"
cat <<'EOF' > /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
systemctl restart docker

# ─── Step 5: Configure UFW Firewall & Security ────────────────────────────────
echo -e "${BLUE}[5/6] Hardening UFW firewall...${NC}"
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

systemctl enable fail2ban
systemctl start fail2ban

# ─── Step 6: Make scripts executable ──────────────────────────────────────────
echo -e "${BLUE}[6/6] Finalizing permissions...${NC}"
if [ -f "deploy.sh" ]; then
    chmod +x deploy.sh
fi

echo ""
echo -e "${GREEN}══════════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${GREEN}✅ DigitalOcean Droplet Initialized Successfully!${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════════════════════${NC}"
echo -e "Next steps:"
echo -e "  1. Copy your environment file:    ${BOLD}cp .env.prod.example .env.prod${NC}"
echo -e "  2. Edit .env.prod with secrets:   ${BOLD}nano .env.prod${NC}"
echo -e "  3. Deploy the application:        ${BOLD}./deploy.sh --seed${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════════════════════${NC}"
