<?php

namespace App\Actions;

use App\Jobs\GenerateSignedFinalArtifact;
use App\Models\SignatureRequest;
use App\Services\PdfRenderer;
use Illuminate\Support\Facades\Storage;

class GenerateSignatureArtifacts
{
    public function __construct(
        private PdfRenderer $pdfRenderer,
    ) {}

    public function handle(SignatureRequest $signatureRequest): SignatureRequest
    {
        $signatureRequest->loadMissing(['document.matter', 'document.client', 'documentVersion', 'signers']);
        $disk = (string) config('raf.documents.disk');
        $basePath = 'signature-artifacts/'.$signatureRequest->getKey();
        $signedRecordPath = $basePath.'/signed-record.pdf';
        $certificatePath = $basePath.'/certificate.pdf';

        Storage::disk($disk)->put($signedRecordPath, $this->pdfRenderer->render('pdf.signature-record', [
            'signatureRequest' => $signatureRequest,
        ]));
        Storage::disk($disk)->put($certificatePath, $this->pdfRenderer->render('pdf.signature-certificate', [
            'signatureRequest' => $signatureRequest,
        ]));

        $signatureRequest->update([
            'signed_record_disk' => $disk,
            'signed_record_path' => $signedRecordPath,
            'certificate_disk' => $disk,
            'certificate_path' => $certificatePath,
        ]);

        $signatureRequest->update([
            'signed_final_status' => 'queued',
            'signed_final_message' => 'Signed-final PDF sedang diproses.',
            'signed_final_started_at' => null,
            'signed_final_completed_at' => null,
        ]);
        GenerateSignedFinalArtifact::dispatch((string) $signatureRequest->getKey())->afterCommit();

        return $signatureRequest->refresh();
    }
}
