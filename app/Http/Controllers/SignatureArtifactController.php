<?php

namespace App\Http\Controllers;

use App\Models\SignatureRequest;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SignatureArtifactController extends Controller
{
    public function signedRecord(Request $request, SignatureRequest $signatureRequest, AuditService $audit): StreamedResponse
    {
        return $this->download($request, $signatureRequest, 'signed_record', 'signed-document-record', $audit);
    }

    public function certificate(Request $request, SignatureRequest $signatureRequest, AuditService $audit): StreamedResponse
    {
        return $this->download($request, $signatureRequest, 'certificate', 'signature-certificate', $audit);
    }

    public function signedFinal(Request $request, SignatureRequest $signatureRequest, AuditService $audit): StreamedResponse
    {
        return $this->download($request, $signatureRequest, 'signed_final', 'signed-final', $audit);
    }

    private function download(Request $request, SignatureRequest $signatureRequest, string $artifact, string $filenamePrefix, AuditService $audit): StreamedResponse
    {
        $signatureRequest->loadMissing('document');
        Gate::authorize('download', $signatureRequest->document);

        $disk = match ($artifact) {
            'signed_record' => $signatureRequest->signed_record_disk,
            'signed_final' => $signatureRequest->signed_final_disk,
            default => $signatureRequest->certificate_disk,
        };
        $path = match ($artifact) {
            'signed_record' => $signatureRequest->signed_record_path,
            'signed_final' => $signatureRequest->signed_final_path,
            default => $signatureRequest->certificate_path,
        };
        abort_unless(is_string($disk) && is_string($path) && Storage::disk($disk)->exists($path), 404);

        $audit->record($signatureRequest, 'signature.'.$artifact.'_downloaded', [], $request->user(), $request);

        return Storage::disk($disk)->download($path, $filenamePrefix.'-'.$signatureRequest->verification_code.'.pdf', [
            'Content-Type' => 'application/pdf',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
