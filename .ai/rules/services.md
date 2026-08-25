---
paths:
  - 'app/Actions/GenerateSignedFinalPdf.php,app/Services/SignatureCertificateService.php'
---

# Services

## Verify signing artifact checksums
Before stamping, verify stored source bytes against both document-version and signature-request SHA-256 values. Store the final PDF SHA-256 and regenerate its certificate; DOCX conversion failures must remain retryable and preserve the source.
