#!/usr/bin/env bash
set -euo pipefail

echo "============================================"
echo "  InkTrust — Full Infrastructure Setup"
echo "============================================"
echo ""

# 1. Check prerequisites
echo "[1/6] Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "ERROR: Node.js is required"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "ERROR: pnpm is required (npm install -g pnpm)"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "ERROR: Docker is required"; exit 1; }
echo "  ✓ Node.js $(node -v)"
echo "  ✓ pnpm $(pnpm -v)"
echo "  ✓ Docker $(docker -v | cut -d ' ' -f3 | tr -d ',')"
echo ""

# 2. Environment setup
echo "[2/6] Setting up environment..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  ✓ Created .env from .env.example (update values before production)"
else
  echo "  ✓ .env already exists"
fi
echo ""

# 3. Docker infrastructure
echo "[3/6] Starting Docker infrastructure..."
docker compose -f infrastructure/docker/docker-compose.yml up -d
echo "  ✓ PostgreSQL, Redis, MinIO, and monitoring stack started"
echo ""

# 4. Install dependencies
echo "[4/6] Installing workspace dependencies..."
pnpm install
echo "  ✓ Dependencies installed"
echo ""

# 5. Prisma setup
echo "[5/6] Setting up Prisma database..."
pnpm db:generate
echo "  ✓ Prisma client generated"
pnpm db:migrate
echo "  ✓ Database migrations applied"
echo ""

# 6. Build
echo "[6/6] Building workspace packages..."
pnpm build:api
echo "  ✓ API server built"
echo ""

echo "============================================"
echo "  Setup complete!"
echo ""
echo "  Run 'pnpm dev' to start development servers"
echo "============================================"
