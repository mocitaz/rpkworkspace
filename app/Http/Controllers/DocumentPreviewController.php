<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessDocumentVersion;
use App\Models\Document;
use App\Models\DocumentVersion;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentPreviewController extends Controller
{
    public function show(
        Request $request,
        Document $document,
        DocumentVersion $version,
        AuditService $audit,
    ): StreamedResponse {
        Gate::authorize('download', $document);
        $this->assertVersionIsAccessible($document, $version);
        abort_unless(
            $version->mime_type === 'application/pdf'
            || str_starts_with($version->mime_type, 'image/')
            || str_starts_with($version->mime_type, 'text/'),
            415
        );

        $audit->record($document, 'document.previewed', ['version_number' => $version->version_number], $request->user(), $request);

        return Storage::disk($version->storage_disk)->response($version->storage_path, $version->original_filename, [
            'Content-Type' => $version->mime_type,
            'Content-Disposition' => 'inline',
            'X-Content-Type-Options' => 'nosniff',
            'Content-Security-Policy' => "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'",
            'Cache-Control' => 'private, no-store, max-age=0',
        ]);
    }

    public function process(Document $document, DocumentVersion $version): RedirectResponse
    {
        Gate::authorize('update', $document);
        abort_unless($version->document_id === $document->getKey(), 404);

        $version->update([
            'scan_status' => 'pending',
            'scan_message' => null,
            'scanned_at' => null,
            'extraction_status' => 'pending',
            'extracted_at' => null,
        ]);
        ProcessDocumentVersion::dispatch((string) $version->getKey())->afterCommit();

        return back()->with('success', 'Pemindaian dan ekstraksi dokumen dijadwalkan ulang.');
    }

    private function assertVersionIsAccessible(Document $document, DocumentVersion $version): void
    {
        abort_unless($version->document_id === $document->getKey(), 404);
        abort_unless(Storage::disk($version->storage_disk)->exists($version->storage_path), 404);
        abort_if($version->scan_status === 'infected', 423, 'Dokumen diblokir karena terdeteksi malware.');
    }
}
