<?php

namespace App\Services;

use App\Models\SignatureRequest;
use Illuminate\Support\Facades\Storage;

class SignatureCertificateService
{
    public function __construct(private PdfRenderer $pdfRenderer) {}

    public function generate(SignatureRequest $signatureRequest): SignatureRequest
    {
        $signatureRequest->loadMissing(['document.matter', 'document.client', 'documentVersion', 'signers']);
        $disk = (string) config('raf.documents.disk', 'local');
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

        return $signatureRequest->refresh();
    }
}
