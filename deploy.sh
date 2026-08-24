#!/usr/bin/env bash
set -e

echo "=================================================="
echo "🚀 Memulai Deployment RPK Legal Workspace (Prod)"
echo "=================================================="

# 1. Maintenance Mode
echo "🛑 Mengaktifkan Maintenance Mode..."
php artisan down --render="errors::503" --retry=60 || true

# 2. Update Codebase
echo "📥 Menarik kode terbaru dari Git..."
git pull origin main || true

# 3. PHP Dependencies
echo "📦 Menginstal PHP Dependencies (Production)..."
composer install --no-dev --optimize-autoloader --no-interaction

# 4. Frontend Build
echo "⚡ Mengompilasi Asset Frontend (Vite/React)..."
npm ci
npm run build

# 5. Database Migration
echo "🗄️ Menjalankan Database Migrations..."
php artisan migrate --force

# 6. Storage Symlink
echo "🔗 Memastikan Storage Link terpasang..."
php artisan storage:link || true

# 7. Production Caches
echo "🧹 Membangun Cache Optimasi Laravel..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# 8. Restart Queues
echo "🔄 Merestart Queue Worker..."
php artisan queue:restart || true

# 9. Exit Maintenance Mode
echo "🟢 Menonaktifkan Maintenance Mode..."
php artisan up

echo "=================================================="
echo "✅ Deployment Sukses! RPK Workspace siap digunakan."
echo "=================================================="
