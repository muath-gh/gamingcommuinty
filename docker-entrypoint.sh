#!/bin/sh
set -e

export DATABASE_URL="mysql://root:rootpassword@mysql:3306/gaming_community"

echo "==> Waiting for MySQL to be ready..."
until npx prisma db push --accept-data-loss; do
  echo "    MySQL not ready yet, retrying in 3s..."
  sleep 3
done

echo "==> Database ready."
echo "==> Starting Next.js..."
exec npm start