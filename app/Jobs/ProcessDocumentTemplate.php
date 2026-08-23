<?php

namespace App\Jobs;

use App\Contracts\MalwareScanner;
use App\Models\DocumentTemplate;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class ProcessDocumentTemplate implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 180;

    /** @var list<int> */
    public array $backoff = [10, 60, 300];

    public function __construct(public string $templateId)
    {
        $this->onQueue(config('raf.queues.documents', 'documents'));
    }

    public function uniqueId(): string
    {
        return $this->templateId;
    }

    public function handle(MalwareScanner $scanner): void
    {
        $template = DocumentTemplate::query()->find($this->templateId);
        if ($template === null) {
            return;
        }

        $directory = storage_path('app/private/processing');
        File::ensureDirectoryExists($directory, 0700, true);
        $temporaryPath = $directory.'/'.Str::ulid().'.docx';

        try {
            $source = Storage::disk($template->storage_disk)->readStream($template->storage_path);
            $target = fopen($temporaryPath, 'wb');
            if (! is_resource($source) || ! is_resource($target)) {
                $template->update(['scan_status' => 'failed', 'scan_message' => 'Template tidak dapat dibaca untuk dipindai.']);

                return;
            }

            stream_copy_to_stream($source, $target);
            fclose($source);
            fclose($target);

            $template->update(['scan_status' => 'processing', 'scan_message' => null]);
            $scan = $scanner->scan($temporaryPath);
            $template->update([
                'scan_status' => $scan->status,
                'scan_message' => $scan->message,
                'scanned_at' => now(),
            ]);
        } finally {
            if (isset($source) && is_resource($source)) {
                fclose($source);
            }
            if (isset($target) && is_resource($target)) {
                fclose($target);
            }
            File::delete($temporaryPath);
        }
    }

    public function failed(?Throwable $exception): void
    {
        DocumentTemplate::query()->whereKey($this->templateId)->update([
            'scan_status' => 'failed',
            'scan_message' => 'Pemindaian template gagal setelah beberapa percobaan.',
        ]);

        Log::error('Template processing failed.', [
            'template_id' => $this->templateId,
            'exception' => $exception !== null ? $exception::class : null,
        ]);
    }
}
