# Roadmap

## Phase 1 — implemented

- Personnel-only authentication, email verification, optional TOTP/passkeys, active-session disable checks
- Administrator-led invitations, user activation, role assignment, and permission editor
- Clients, contacts, practice areas, matters, parties, members, notes, tasks, deadlines, and calendar events
- Matter confidentiality scopes and sequential annual matter numbering
- Private document storage with immutable versions, checksums, authorized download, PDF/image preview, DOCX text preview, malware-scan status, OCR, and text extraction
- Dashboard, grouped navigation, command palette, global search, filterable audit viewer, in-app assignment/deadline notifications, and responsive Indonesian UI
- Full client and matter editing, including matter team membership; monthly interactive calendar plus list view

## Phase 2 — documents and finance

- Party/note/event workflows, reusable task templates, document review/approval states, retention/legal-hold policies, and object storage
- Conflict-check intake and production hardening of malware/OCR services (isolated workers, monitoring, content-disarm policy)
- Time capture, rates, billing, expenses, matter budgets, PostgreSQL concurrency, and browser end-to-end suites in CI

## Phase 3 — client experience

- Lead intake, conflict checks, proposals, and engagement letters
- Client portal with segregated access, secure exchange, client approvals, and e-sign integration
- Communication history and external access auditing

## Phase 4 — RAF intelligence

- Semantic search over authorized extracted text, source-grounded matter summaries, and timeline generation
- Contract review, precedent search, drafting assistance, and controlled AI document generation
- Provider policy controls, evaluation suites, and mandatory human-review UX

## Phase 5 — advanced legal workflows

- Litigation evidence, issue matrices, hearing briefs, and chronology tooling
- Due-diligence rooms, request lists, findings, and report generation
- Contract lifecycle, regulatory watch, SSO/SCIM, SIEM integration, and formal assurance reviews

Every phase should preserve server-side authorization, append-only auditability, private-by-default storage, reversible migrations, and backward-compatible document history.
