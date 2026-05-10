#!/usr/bin/env bash
set -euo pipefail

echo "WARNING: This will reset the InkTrust database and delete all data!"
read -p "Are you sure? (y/N): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
  echo "Cancelled"
  exit 0
fi

pnpm --filter db-schema migrate:reset
pnpm --filter db-schema seed

echo "Database reset and re-seeded"
