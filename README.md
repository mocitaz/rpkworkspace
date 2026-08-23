# RAF Workspace

Private legal practice management for RPK Law Firm. Phase 1 covers personnel access, role-based authorization, clients and contacts, matters, tasks and deadlines, calendar events, private versioned documents, global search, and immutable audit records.

## Stack

- PHP 8.3+, Laravel 13, Fortify, Pest 4, Larastan
- PostgreSQL 15+ in deployed environments (SQLite is supported for fast local tests)
- React 19, TypeScript, Inertia 3, Tailwind CSS 4, shadcn/Radix UI
- Private Laravel filesystem storage; no public document URLs

## Local setup

Requirements: PHP 8.3 or newer with PostgreSQL and file-info extensions, Composer 2, Node.js 22+, npm, and PostgreSQL 15+.

```bash
cp .env.example .env
composer install
npm install
php artisan key:generate
php artisan migrate --seed
npm run build
composer run dev
```

Create the PostgreSQL database named by `DB_DATABASE` and update `DB_USERNAME` / `DB_PASSWORD` before migrating. During UI development, `composer run dev` runs the Laravel server, queue worker, log viewer, and Vite together.

The seed is development-only. All seeded users use the password `password`:

| Role | Email |
| --- | --- |
| Administrator | `admin@raf.local` |
| Managing Partner | `anggara@raf.local` |
| Partner | `reza@raf.local` |
| Associate | `fajar@raf.local` |

Never run the demo seeder against a production database or reuse its credentials.

## Queues and private storage

The default database queue is migration-ready. Run a worker separately when not using `composer run dev`:

```bash
php artisan queue:work --tries=3
```

`RAF_DOCUMENT_DISK` selects the private Laravel filesystem disk. Local document bytes live under `storage/app/private`; do not create a public symlink for them. A production S3-compatible disk should use private ACLs and authorized, short-lived delivery only.

## VPS / production runtime requirements

Before enabling the document-processing features in production, provision the following services and keep them monitored:

- A persistent queue worker managed by Supervisor or systemd: `php artisan queue:work --tries=3`.
- A scheduler trigger every minute: `php artisan schedule:run`; it dispatches deadline reminders hourly.
- A real mail provider with `MAIL_MAILER`, sender identity, TLS credentials, and DNS records (SPF/DKIM/DMARC) for invitations, password setup, and email verification.
- ClamAV (`clamscan`) with fresh signatures for malware scanning; set `RAF_CLAMAV_BINARY`, `RAF_CLAMAV_TIMEOUT`, and set `RAF_REQUIRE_CLEAN_DOWNLOADS=true` after validation.
- Poppler (`pdftotext`) for PDF text extraction and Tesseract with Indonesian and English language data for OCR; configure `RAF_PDFTOTEXT_BINARY`, `RAF_TESSERACT_BINARY`, and `RAF_OCR_LANGUAGES=ind+eng`.
- Private, durable storage (`RAF_DOCUMENT_DISK`) outside the public web root, plus encrypted PostgreSQL and storage backups restored together in drills.

Run document processing in a staging environment first. Keep `RAF_EXTRACT_UNSCANNED=false` in production unless the firm explicitly accepts extraction before a clean malware result.

## Architecture overview

Server-rendered Laravel routes and Inertia form submissions share the same policy, validation, and transaction boundaries. Core records use Eloquent relationships and ULIDs where externally exposed. Multi-step matter/document workflows live in Actions; search and audit behavior live in Services. React pages remain presentation clients and receive only server-authorized records.

## Quality checks

```bash
composer run lint:check
vendor/bin/phpstan analyse --memory-limit=1G
php artisan test
npm run lint:check
npm run format:check
npm run types:check
npm run build
```

## Operational notes

- Public registration and self-service account deletion are disabled. Administrators provision and disable personnel.
- Email verification and active-account middleware protect every workspace route.
- Matter visibility is applied in policies and query scopes; restricted/confidential matters are limited to assigned personnel unless a role has `matter.view.all`.
- Document filenames are generated internally. Every version stores the detected MIME type, byte size, and SHA-256 checksum.
- Keep `APP_DEBUG=false`, serve only over TLS, run queues under a supervisor, and back up PostgreSQL and private storage together.

See [Architecture](docs/ARCHITECTURE.md), [Security](docs/SECURITY.md), and [Roadmap](docs/ROADMAP.md).
