# PANDUAN DEPLOYMENT PRODUCTION (RPK LEGAL WORKSPACE)
## Firma Hukum Roni, Putra & Kusumah (RPK Law Firm)

Dokumen ini berisi panduan teknis langkah demi langkah untuk melakukan deployment **RPK Legal Workspace** ke server produksi (Ubuntu/Debian VPS, Cloud Server, atau Dedicated Hosting).

---

## 1. SPESIFIKASI & PRASYARAT SERVER PRODUKSI

| Komponen | Spesifikasi Minimal / Rekomendasi |
| :--- | :--- |
| **Sistem Operasi** | Ubuntu 22.04 LTS / 24.04 LTS atau Debian 12 |
| **PHP Runtime** | **PHP 8.4+** (Ekstensi: `bcmath`, `ctype`, `curl`, `dom`, `fileinfo`, `gd`, `intl`, `json`, `mbstring`, `openssl`, `pdo_pgsql` / `pdo_mysql`, `tokenizer`, `xml`, `zip`) |
| **Database** | **PostgreSQL 15+** (Disarankan) atau **MySQL 8.0+** |
| **Node.js Runtime** | Node.js **v20.x+ LTS** & NPM v10+ |
| **Web Server** | Nginx (direkomendasikan) atau Apache 2.4 |
| **Process Manager** | Supervisor (untuk antrean Queue Worker) |
| **Tools Tambahan** | `libreoffice` (konversi DOCX ke PDF), `pdftotext` (poppler-utils), `tesseract-ocr` (opsional untuk OCR) |

---

## 2. CHECKLIST PERSIAPAN ENVIRONMENT (.env PRODUCTION)

Buat atau sesuaikan file `.env` di server produksi:

```env
APP_NAME="RPK Law Firm Workspace"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://workspace.rpklawoffice.com

RAF_FIRM_NAME="RPK Law Firm"
RAF_FIRM_CODE=RPK
RAF_TIMEZONE=Asia/Jakarta
RAF_FINANCE_CURRENCY=IDR
RAF_INVOICE_PREFIX=INV
RAF_QUOTATION_PREFIX=QT
RAF_ENGAGEMENT_LETTER_PREFIX=EL
RAF_EXPORT_BUNDLE_PREFIX=EXP

# Antrean Queue
QUEUE_CONNECTION=database
RAF_QUEUE_DOCUMENTS=documents
RAF_QUEUE_NOTIFICATIONS=notifications
RAF_QUEUE_GENERATION=generation
RAF_QUEUE_EXPORTS=exports

# Verifikasi & Keamanan Tanda Tangan
RAF_SIGNATURE_VERIFICATION_URL_PATH=verify/signature
RAF_SIGNATURE_REMINDER_INTERVAL_HOURS=24
RAF_LIBREOFFICE_BINARY=soffice
RAF_SIGNATURE_CONVERSION_TIMEOUT=180
RAF_DOCUMENT_DISK=local
RAF_REQUIRE_CLEAN_DOWNLOADS=true

# Database PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=rpk_workspace_prod
DB_USERNAME=rpk_db_user
DB_PASSWORD=GantiDenganPasswordSangatKuat!

# Sesi & Cache
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=true
CACHE_STORE=database

# Konfigurasi Email Resmi (SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org (atau SMTP Provider Anda)
MAIL_PORT=587
MAIL_USERNAME=postmaster@mg.rpklawoffice.com
MAIL_PASSWORD=SecretSmtpPassword
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="contact@rpklawoffice.com"
MAIL_FROM_NAME="RPK Law Firm"

# Vite Production Asset
VITE_APP_NAME="${APP_NAME}"
```

---

## 3. LANGKAH-LANGKAH DEPLOYMENT (EKSEKUSI SERVER)

Jalankan perintah berikut secara berurutan di direktori proyek:

### Langkah 1: Clone / Tarik Source Code
```bash
git pull origin main
```

### Langkah 2: Install PHP Dependencies (Tanpa Dev Tools)
```bash
composer install --no-dev --optimize-autoloader --no-interaction
```

### Langkah 3: Generate Application Key (Jika Baru Pertama Kali Setup)
```bash
php artisan key:generate --force
```

### Langkah 4: Jalankan Migrasi Database
```bash
php artisan migrate --force
```

*(Opsional untuk inisialisasi awal akun resmi RPK):*
```bash
php artisan db:seed --class=DatabaseSeeder --force
```

### Langkah 5: Buat Symbolic Link Storage
```bash
php artisan storage:link
```

### Langkah 6: Install Node Dependencies & Build Asset Frontend
```bash
npm ci
npm run build
```

### Langkah 7: Optimasi & Caching Laravel (Production Boost)
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### Langkah 8: Atur Hak Akses Folder (Permissions)
```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

---

## 4. KONFIGURASI NGINX (WEB SERVER)

Contoh blok konfigurasi Nginx untuk domain `workspace.rpklawoffice.com`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name workspace.rpklawoffice.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name workspace.rpklawoffice.com;
    root /var/www/rpkworkspace/public;

    # SSL Certificates (Let's Encrypt / Certbot)
    ssl_certificate /etc/letsencrypt/live/workspace.rpklawoffice.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/workspace.rpklawoffice.com/privkey.pem;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    index index.php index.html;
    charset utf-8;

    client_max_body_size 50M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## 5. KONFIGURASI QUEUE WORKER (SUPERVISOR)

RPK Workspace memproses antrean tanda tangan digital, email notifikasi, dan ekspor berkas perkara secara asynchronous di background.

Buat file konfigurasi supervisor: `/etc/supervisor/conf.d/rpk-worker.conf`

```ini
[program:rpk-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/rpkworkspace/artisan queue:work database --sleep=3 --tries=3 --max-time=3600 --timeout=180
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/rpkworkspace/storage/logs/worker.log
stopwaitsecs=3600
```

Jalankan Supervisor:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start rpk-worker:*
```

---

## 6. KONFIGURASI CRON SCHEDULER (PENANDA INVOICE OVERDUE & NOTIFIKASI SIDANG)

Buka crontab user `www-data`:
```bash
sudo crontab -u www-data -e
```

Tambahkan baris scheduler berikut:
```cron
* * * * * cd /var/www/rpkworkspace && php artisan schedule:run >> /dev/null 2>&1
```

Scheduler ini secara otomatis akan menjalankan:
- Pengingat agenda sidang & tenggat waktu (`deadline reminders`).
- Pembaruan status invoice jatuh tempo menjadi `Overdue` (`raf:mark-overdue-invoices`).

---

## 7. SKRIP DEPLOYMENT OTOMATIS (ONE-CLICK DEPLOY SCRIPT)

Anda dapat membuat file `deploy.sh` di root project:

```bash
#!/usr/bin/env bash
set -e

echo "🚀 Memulai deployment RPK Legal Workspace..."

# Masuk ke Maintenance Mode
php artisan down --render="errors::503" --retry=60 || true

# Tarik perubahan kode terbaru
git pull origin main

# Install composer
composer install --no-dev --optimize-autoloader --no-interaction

# Build asset
npm ci
npm run build

# Migrasi Database
php artisan migrate --force

# Bersihkan & Bangun Cache
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Restart Queue Worker
php artisan queue:restart

# Keluar dari Maintenance Mode
php artisan up

echo "✅ Deployment Sukses! RPK Workspace siap digunakan di Production."
```

Beri izin eksekusi:
```bash
chmod +x deploy.sh
```

---

*Dokumen ini disusun untuk tim teknis dan administrator infrastruktur Firma Hukum Roni, Putra & Kusumah.*
