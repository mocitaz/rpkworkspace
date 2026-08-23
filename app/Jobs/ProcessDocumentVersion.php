<?php

namespace App\Jobs;

use App\Contracts\MalwareScanner;
use App\Models\DocumentVersion;
use App\Services\DocumentTextExtractor;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class ProcessDocumentVersion implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 240;

    /** @var list<int> */
    public array $backoff = [10, 60, 300];

    public function __construct(public string $documentVersionId)
    {
        $queue = config('raf.queues.documents', 'documents');

        $this->onQueue(is_string($queue) && $queue !== '' ? $queue : 'documents');
    }

    public function uniqueId(): string
    {
        return $this->documentVersionId;
    }

    /**
     * Execute the job.
     */
    public function handle(MalwareScanner $scanner, DocumentTextExtractor $extractor): void
    {
        $version = DocumentVersion::query()->find($this->documentVersionId);

        if ($version === null) {
            return;
        }

        $processingDirectory = storage_path('app/private/processing');
        File::ensureDirectoryExists($processingDirectory, 0700, true);
        $temporaryPath = $processingDirectory.'/'.Str::ulid();
        $source = null;
        $target = null;

        try {
            $source = Storage::disk($version->storage_disk)->readStream($version->storage_path);
            $target = fopen($temporaryPath, 'wb');

            if (! is_resource($source) || ! is_resource($target)) {
                $version->update(['scan_status' => 'failed', 'scan_message' => 'File tidak dapat dibaca untuk diproses.']);

                return;
            }

            stream_copy_to_stream($source, $target);
            fclose($source);
            fclose($target);

            $version->update(['scan_status' => 'processing', 'scan_message' => null]);
            $scan = $scanner->scan($temporaryPath);
            $version->update([
                'scan_status' => $scan->status,
                'scan_message' => $scan->message,
                'scanned_at' => now(),
            ]);

            if ($scan->status === 'infected') {
                $version->update(['extraction_status' => 'blocked']);

                return;
            }

            if ($scan->status !== 'clean' && ! config('raf.documents.extraction.allow_unscanned', false)) {
                $version->update(['extraction_status' => 'blocked']);

                return;
            }

            $version->update(['extraction_status' => 'processing']);
            $result = $extractor->extract($temporaryPath, $version->mime_type, $version->original_filename);
            $version->update([
                'extraction_status' => $result['status'],
                'extracted_text' => $result['text'],
                'extraction_metadata' => $result['metadata'],
                'extracted_at' => now(),
            ]);
        } finally {
            if (is_resource($source)) {
                fclose($source);
            }

            if (is_resource($target)) {
                fclose($target);
            }

            File::delete($temporaryPath);
        }
    }

    public function failed(?Throwable $exception): void
    {
        DocumentVersion::query()->whereKey($this->documentVersionId)->update([
            'scan_status' => 'failed',
            'scan_message' => 'Pemrosesan dokumen gagal setelah beberapa percobaan.',
            'extraction_status' => 'failed',
        ]);

        Log::error('Document processing failed.', [
            'document_version_id' => $this->documentVersionId,
            'exception' => $exception !== null ? $exception::class : null,
        ]);
    }
}
