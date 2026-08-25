<?php

namespace App\Actions;

use App\Jobs\GenerateSignedFinalArtifact;
use App\Models\SignatureRequest;
use App\Services\SignatureCertificateService;

class GenerateSignatureArtifacts
{
    public function __construct(
        private SignatureCertificateService $certificates,
    ) {}

    public function handle(SignatureRequest $signatureRequest): SignatureRequest
    {
        $signatureRequest = $this->certificates->generate($signatureRequest);

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
