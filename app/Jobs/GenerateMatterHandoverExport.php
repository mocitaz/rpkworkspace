<?php

namespace App\Jobs;

use App\Models\AuditLog;
use App\Models\ConflictCheck;
use App\Models\Correspondence;
use App\Models\Document;
use App\Models\Expense;
use App\Models\Invoice;
use App\Models\Matter;
use App\Models\MatterExport;
use App\Models\Payment;
use App\Models\Quotation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;
use ZipArchive;

class GenerateMatterHandoverExport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    /** @var list<int> */
    public array $backoff = [10, 60, 300];

    /**
     * Create a new job instance.
     */
    public function __construct(public string $matterExportId)
    {
        $this->onQueue(config('raf.queues.exports', 'exports'));
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $export = MatterExport::query()->with(['matter.documents.currentVersion', 'matter.correspondences.documents', 'matter.invoices.lineItems', 'matter.quotations.lineItems', 'matter.payments.allocations', 'matter.expenses', 'matter.conflictChecks'])->findOrFail($this->matterExportId);
        $temporaryFile = tempnam(sys_get_temp_dir(), 'raf-handover-');

        if ($temporaryFile === false) {
            throw new \RuntimeException('Tidak dapat menyiapkan export handover.');
        }

        try {
            $archive = new ZipArchive;
            if ($archive->open($temporaryFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
                throw new \RuntimeException('Tidak dapat membuat bundel handover.');
            }

            $matter = $export->matter;
            $archive->addFromString('metadata/matter.json', json_encode($matter->toArray(), JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));
            $archive->addFromString('metadata/correspondence.json', json_encode($matter->correspondences->toArray(), JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));
            $archive->addFromString('metadata/finance.json', json_encode([
                'invoices' => $matter->invoices,
                'quotations' => $matter->quotations,
                'payments' => $matter->payments,
                'expenses' => $matter->expenses,
            ], JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));
            $archive->addFromString('metadata/conflict-checks.json', json_encode($matter->conflictChecks->toArray(), JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));
            $auditLogs = $this->auditTrailFor($matter);
            $archive->addFromString('metadata/audit-log.json', json_encode($auditLogs, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));
            $archive->addFromString('metadata/audit-coverage.json', json_encode([
                'records' => $auditLogs->count(),
                'subjects' => $auditLogs->map(fn (AuditLog $log) => [$log->subject_type, $log->subject_id])->unique()->values(),
                'audit_chain' => [
                    'first_entry_hash' => $auditLogs->last()?->entry_hash,
                    'latest_entry_hash' => $auditLogs->first()?->entry_hash,
                ],
            ], JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));

            $manifest = ['generated_at' => now()->toIso8601String(), 'documents' => [], 'excluded_documents' => []];
            foreach ($matter->documents as $document) {
                $version = $document->currentVersion;
                if ($version === null || $version->scan_status !== 'clean') {
                    $manifest['excluded_documents'][] = [
                        'document_id' => $document->getKey(),
                        'reason' => $version === null ? 'missing_current_version' : 'scan_'.$version->scan_status,
                    ];

                    continue;
                }

                $contents = Storage::disk($version->storage_disk)->get($version->storage_path);
                $path = 'documents/'.Str::slug($document->title).'-v'.$version->version_number.'-'.$version->original_filename;
                $archive->addFromString($path, $contents);
                $manifest['documents'][] = [
                    'document_id' => $document->getKey(),
                    'version' => $version->version_number,
                    'path' => $path,
                    'checksum' => hash('sha256', $contents),
                    'source_checksum' => $version->checksum,
                ];
            }
            $manifestJson = json_encode($manifest, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR);
            $archive->addFromString('metadata/manifest.json', $manifestJson);

            $archive->close();
            $disk = config('raf.documents.disk', 'local');
            $path = 'exports/'.$matter->getKey().'/'.Str::ulid().'.zip';
            $archiveContents = file_get_contents($temporaryFile);

            if ($archiveContents === false) {
                throw new \RuntimeException('Bundel handover tidak dapat dibaca.');
            }

            Storage::disk($disk)->put($path, $archiveContents);

            $export->update([
                'status' => 'completed',
                'storage_disk' => $disk,
                'storage_path' => $path,
                'checksum' => hash_file('sha256', $temporaryFile),
                'manifest_checksum' => hash('sha256', $manifestJson),
                'file_size' => filesize($temporaryFile),
                'completed_at' => now(),
            ]);
        } catch (Throwable $exception) {
            $export->update(['status' => 'failed', 'failure_message' => Str::limit($exception->getMessage(), 1000)]);
            throw $exception;
        } finally {
            if (is_file($temporaryFile)) {
                unlink($temporaryFile);
            }
        }
    }

    public function failed(?Throwable $exception): void
    {
        MatterExport::query()->whereKey($this->matterExportId)->update([
            'status' => 'failed',
            'failure_message' => Str::limit($exception?->getMessage() ?? 'Export handover gagal.', 1000),
        ]);
    }

    /** @return Collection<int, AuditLog> */
    private function auditTrailFor(Matter $matter): Collection
    {
        $subjects = collect([
            [MatterExport::class, $matter->exports()->pluck('id')],
            [$matter->getMorphClass(), collect([$matter->getKey()])],
            [Document::class, $matter->documents()->pluck('id')],
            [Correspondence::class, $matter->correspondences()->pluck('id')],
            [ConflictCheck::class, $matter->conflictChecks()->pluck('id')],
            [Invoice::class, $matter->invoices()->pluck('id')],
            [Quotation::class, $matter->quotations()->pluck('id')],
            [Payment::class, $matter->payments()->pluck('id')],
            [Expense::class, $matter->expenses()->pluck('id')],
        ])->filter(fn (array $subject) => $subject[1]->isNotEmpty());

        return AuditLog::query()->where(function ($query) use ($subjects) {
            foreach ($subjects as [$type, $ids]) {
                $query->orWhere(fn ($nested) => $nested->where('subject_type', $type)->whereIn('subject_id', $ids));
            }
        })->latest()->get();
    }
}
