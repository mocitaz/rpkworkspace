<?php

namespace App\Http\Controllers;

use App\Actions\CreateDocumentVersion;
use App\Http\Requests\StoreDocumentVersionRequest;
use App\Models\Document;
use App\Models\DocumentVersion;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentVersionController extends Controller
{
    public function store(
        StoreDocumentVersionRequest $request,
        Document $document,
        CreateDocumentVersion $createVersion,
        AuditService $audit,
    ): RedirectResponse {
        $version = $createVersion->handle($document, $request->file('file'), $request->user(), $request->validated('notes'));
        $audit->record($document, 'document.version_uploaded', ['version_number' => $version->version_number], $request->user(), $request);

        return back()->with('success', 'Versi dokumen baru berhasil diunggah.');
    }

    public function download(Request $request, Document $document, DocumentVersion $version, AuditService $audit): StreamedResponse
    {
        Gate::authorize('download', $document);
        abort_unless($version->document_id === $document->getKey(), 404);
        abort_unless(Storage::disk($version->storage_disk)->exists($version->storage_path), 404);
        abort_if($version->scan_status === 'infected', 423, 'Dokumen diblokir karena terdeteksi malware.');

        if (config('raf.documents.require_clean_downloads', false)) {
            abort_unless($version->scan_status === 'clean', 423, 'Dokumen belum lolos pemindaian malware.');
        }

        $audit->record($document, 'document.downloaded', ['version_number' => $version->version_number], $request->user(), $request);

        return Storage::disk($version->storage_disk)->download($version->storage_path, $version->original_filename, [
            'Content-Type' => $version->mime_type,
            'X-Content-Type-Options' => 'nosniff',
            'Content-Disposition' => 'attachment',
        ]);
    }
}
