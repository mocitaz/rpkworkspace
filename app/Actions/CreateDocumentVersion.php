<?php

namespace App\Actions;

use App\Jobs\ProcessDocumentVersion;
use App\Models\Document;
use App\Models\DocumentVersion;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class CreateDocumentVersion
{
    public function __construct(private EnsureMatterIsNotOnLegalHold $legalHold) {}

    public function handle(Document $document, UploadedFile $file, User $uploader, ?string $notes = null): DocumentVersion
    {
        $document->loadMissing('matter');
        $this->legalHold->handle($document->matter);
        $disk = config('raf.documents.disk', 'local');

        if (! is_string($disk) || $disk === '') {
            throw new \UnexpectedValueException('The document storage disk must be a non-empty string.');
        }
        $path = 'documents/'.$document->getKey().'/'.Str::ulid();
        $checksum = hash_file('sha256', $file->getRealPath());

        Storage::disk($disk)->putFileAs(dirname($path), $file, basename($path));

        try {
            $version = DB::transaction(function () use ($document, $file, $uploader, $notes, $disk, $path, $checksum) {
                $lockedDocument = Document::query()->lockForUpdate()->whereKey($document->getKey())->firstOrFail();
                $versionNumber = ((int) $lockedDocument->versions()->max('version_number')) + 1;

                $version = $lockedDocument->versions()->create([
                    'version_number' => $versionNumber,
                    'original_filename' => $file->getClientOriginalName(),
                    'storage_disk' => $disk,
                    'storage_path' => $path,
                    'mime_type' => $file->getMimeType() ?: 'application/octet-stream',
                    'file_size' => $file->getSize(),
                    'checksum' => $checksum,
                    'uploaded_by' => $uploader->getKey(),
                    'notes' => $notes,
                ]);

                $lockedDocument->update(['current_version_id' => $version->getKey()]);

                return $version;
            }, 3);

            ProcessDocumentVersion::dispatch((string) $version->getKey())->afterCommit();

            return $version;
        } catch (Throwable $exception) {
            Storage::disk($disk)->delete($path);
            throw $exception;
        }
    }
}
