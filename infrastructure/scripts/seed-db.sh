#!/usr/bin/env bash
set -euo pipefail

echo "Seeding InkTrust database..."

pnpm --filter db-schema seed
pnpm --filter db-schema seed:audit

echo "Database seeded successfully"
