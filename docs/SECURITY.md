# Security

## Access model

- Workspace access requires authentication, a verified email, and an active personnel record.
- Registration is not exposed. Administrators manage activation; users cannot delete their own accounts.
- Permissions are granular and assigned through roles. Policies enforce operations, while query scopes prevent unauthorized matters and documents from appearing in lists, search, task selectors, or related screens.
- Restricted and confidential matters require assignment as responsible partner, supervisor, or member unless the user has `matter.view.all`.

## Data protection

- Documents remain outside the public filesystem and are delivered through an authorized controller.
- Original filenames are metadata only; generated ULID paths prevent traversal and predictable URLs.
- File versions are preserved with server-detected MIME type, byte size, and SHA-256 checksum.
- Client tax identifiers use Laravel encrypted casts and are hidden from default serialization.
- Audit rows reject updates and deletes at the model layer. Production database privileges should additionally deny application-level UPDATE/DELETE on this table where operationally practical.

Matter membership is the foundation for future ethical walls. Phase 2 should add explicit deny rules, access-reason records, document-level grants, and administrator break-glass access with mandatory audit events. A deny must always override a broad role permission.

Future AI features must authorize every source before retrieval, partition indexes by access boundary, prevent cross-matter prompt context, retain traceable citations, and require human review. External processing is disabled until the firm has approved provider terms, data location, retention, and model-training policy.

## Production checklist

- Set a unique `APP_KEY`, `APP_ENV=production`, `APP_DEBUG=false`, secure session cookies, trusted proxy/host configuration, and HTTPS/HSTS at the edge.
- Use least-privilege PostgreSQL and storage credentials; rotate secrets through the deployment platform, never committed files.
- Configure real outbound mail so verification and security notifications are deliverable.
- Restrict allowed upload size/types further to firm policy. Run ClamAV with current signatures and set `RAF_REQUIRE_CLEAN_DOWNLOADS=true`; document processing must not share a public filesystem with uploaded files.
- Install and monitor Poppler (`pdftotext`) and Tesseract language packs only on the isolated queue-worker runtime. Set `RAF_EXTRACT_UNSCANNED=false` unless a documented risk decision permits pre-scan extraction.
- Run `php artisan queue:work --tries=3` under Supervisor/systemd and call `php artisan schedule:run` every minute. Alert on failed jobs and missed scheduler heartbeats.
- Configure a TLS-authenticated mail provider and verify SPF, DKIM, and DMARC before relying on invitations, password reset, or verification mail.
- Enable rate limiting, centralized security logs, monitored queue failures, encrypted backups, and tested restore procedures.
- Replace all seed credentials. Do not seed demo data in production.
- Run `composer audit`, `npm audit`, tests, static analysis, and the production asset build on every release.

## Reporting

Report vulnerabilities privately to the RAF Workspace maintainer. Include affected route or component, reproducible steps, impact, and a proposed mitigation. Do not include real client documents or secrets in a report.
