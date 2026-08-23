<?php

namespace App\Jobs;

use App\Actions\GenerateSignedFinalPdf;
use App\Models\SignatureRequest;
use App\Services\AuditService;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class GenerateSignedFinalArtifact implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 300;

    /** @var list<int> */
    public array $backoff = [30, 120, 300];

    public function __construct(public string $signatureRequestId)
    {
        $this->onQueue(config('raf.queues.generation', 'generation'));
    }

    public function uniqueId(): string
    {
        return $this->signatureRequestId;
    }

    public function handle(GenerateSignedFinalPdf $generate, AuditService $audit): void
    {
        $signatureRequest = SignatureRequest::query()->findOrFail($this->signatureRequestId);
        if ($signatureRequest->status !== 'completed') {
            return;
        }

        $signatureRequest->update([
            'signed_final_status' => 'processing',
            'signed_final_started_at' => now(),
            'signed_final_message' => null,
        ]);
        $signatureRequest = $generate->handle($signatureRequest);

        $audit->record($signatureRequest, 'signature.signed_final_processed', [
            'status' => $signatureRequest->signed_final_status,
            'message' => $signatureRequest->signed_final_message,
        ]);
    }

    public function failed(?Throwable $exception): void
    {
        $signatureRequest = SignatureRequest::query()->find($this->signatureRequestId);
        if ($signatureRequest !== null) {
            $signatureRequest->update([
                'signed_final_status' => 'failed',
                'signed_final_message' => 'Signed-final PDF gagal diproses. Coba kembali atau hubungi administrator.',
            ]);
        }
    }
}
