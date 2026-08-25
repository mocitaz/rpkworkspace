---
paths:
  - 'app/Models/{Matter,Document,DocumentVersion,MatterEvidence,Correspondence}.php'
---

# Models

## Legal hold blocks deletion at model layer
Records belonging to a matter with legal_hold_at set must reject model deletion, including direct delete/forceDelete paths. UI disabling and controller checks are defense in depth, not the primary invariant.
