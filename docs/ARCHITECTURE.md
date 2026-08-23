# Architecture

## Request flow

Laravel owns routing, authentication, validation, authorization, transactions, and persistence. Inertia sends typed page props to React; React never determines access to protected records. Wayfinder generates TypeScript route and controller bindings from server routes.

All workspace routes pass through `auth`, active-user, and `verified` middleware. Form Requests validate writes, policies authorize record operations, and the `visibleTo` scopes on matters and documents constrain collection queries and related-module selectors.

Fortify owns password reset, email verification, two-factor authentication, and passkeys. Public registration is disabled. Internal users are a separate identity boundary from the future client portal; external clients must not be modeled as ordinary personnel with a client role.

## Domain model

- `User` receives permissions through many-to-many `Role` assignments.
- `Client` owns contacts, matters, and client-level documents.
- `Matter` is ULID-addressed and links its client, practice area, responsible partner, supervisor, members, parties, tasks, deadlines, events, notes, and documents.
- `Document` is metadata. `DocumentVersion` is the immutable stored-file record; `current_version_id` points to the latest accepted version.
- `AuditLog` is append-only and records actor, event, polymorphic subject, metadata, request IP, user agent, and timestamp.

Core business records exposed in URLs use ULIDs. Foreign keys, uniqueness constraints, and targeted indexes enforce database integrity. Statuses are application-managed strings to keep future migrations reversible. No Phase 1 money tables exist; future monetary values must use integer minor units with an explicit currency, never floating point.

## Critical transactions

`CreateMatter` locks the current annual sequence row and issues numbers in the form `RAF-YYYY-NNNN`. The unique database constraint is the final collision guard.

`CreateDocumentVersion` writes to a generated private path, locks the document while allocating the next version number, calculates SHA-256, creates the immutable version row, and atomically updates the current-version pointer. Database uniqueness protects `(document_id, version_number)`; failed database work removes the newly written file.

## Storage and deployment

The configured `RAF_DOCUMENT_DISK` must be private. Downloads are streamed only after policy authorization and include a `nosniff` response header. Production should use durable object storage or an encrypted private volume, PostgreSQL, Redis-backed cache/queues where available, and a queue supervisor.

Deployments should run dependency installation, frontend compilation, `php artisan migrate --force`, cache warm-up, worker restart, and smoke tests. Database and document backups form one recovery unit because version metadata and bytes must remain synchronized.

## Audit and queues

`AuditService` produces structured, human-renderable events without document contents or credentials. The model rejects mutation; production database privileges can harden this further. Database-backed queues are configured for future conversion, malware scanning, OCR, extraction, mail, generation, and indexing so those operations do not grow inside HTTP controllers.

## Search boundary

`GlobalSearchService` is the single initial aggregation boundary. It queries authorized matters, clients, contacts, and documents with bounded results. It can later delegate to PostgreSQL full-text search, Scout, or hybrid semantic retrieval without changing command-palette and search-page contracts.

## Future document generation

Document templates, template versions, allowlisted variables, and generated-document provenance belong beside—but separate from—uploaded documents. A future `DocumentGenerationService` should resolve a strict typed data map, then delegate DOCX/PDF output to driver adapters. Templates must never execute arbitrary PHP or user expressions. Generated output enters the same private document/version and audit pipeline.

## Future AI boundary

Provider-specific SDKs should sit behind an `AIProviderInterface`, with application services such as document analysis and matter intelligence controlling retrieval. Authorization must run before context assembly; matter boundaries must remain intact; source references and provider/data-retention policy must be recorded. Results are draft assistance for human review, never authoritative legal advice.

## Future client portal and billing

The client portal requires a separate authentication guard, invitation lifecycle, narrow matter/document grants, and independently auditable secure sharing. It must not inherit internal personnel permissions.

Billing remains a distinct future module containing time entries, rates, fee arrangements, budgets, invoices, invoice items, expenses, payments, and immutable financial postings. Currency and integer minor-unit rules will be established before its first migration.
