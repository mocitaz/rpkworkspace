<?php

use App\Contracts\MalwareScanner;
use App\Data\ScanResult;
use App\Jobs\ProcessDocumentVersion;
use App\Models\Document;
use App\Models\DocumentVersion;
use App\Models\Matter;
use App\Services\DocumentTextExtractor;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

it('previews clean PDFs inline and blocks infected files', function () {
    Storage::fake('local');
    $user = rafUser(['matter.view', 'document.view', 'document.download']);
    $matter = Matter::factory()->recycle($user)->create();
    $matter->members()->attach($user, ['role' => 'member']);
    $document = Document::factory()->recycle([$matter, $user])->create(['matter_id' => $matter->getKey(), 'created_by' => $user->getKey()]);
    $version = DocumentVersion::factory()->recycle([$document, $user])->create(['document_id' => $document->getKey(), 'uploaded_by' => $user->getKey(), 'scan_status' => 'clean']);
    Storage::disk('local')->put($version->storage_path, '%PDF-1.4 test');

    $this->actingAs($user)->get(route('documents.versions.preview', [$document, $version]))
        ->assertSuccessful()
        ->assertHeader('content-disposition', 'inline');

    $version->update(['scan_status' => 'infected']);
    $this->actingAs($user)->get(route('documents.versions.preview', [$document, $version]))->assertStatus(423);
});

it('queues processing and records clean scan plus extracted native text', function () {
    Storage::fake('local');
    Queue::fake();
    $user = rafUser(['matter.view', 'document.view', 'document.upload']);
    $matter = Matter::factory()->recycle($user)->create();
    $matter->members()->attach($user, ['role' => 'member']);
    $document = Document::factory()->recycle([$matter, $user])->create(['matter_id' => $matter->getKey(), 'created_by' => $user->getKey()]);
    $version = DocumentVersion::factory()->recycle([$document, $user])->create([
        'document_id' => $document->getKey(),
        'uploaded_by' => $user->getKey(),
        'mime_type' => 'text/plain',
        'original_filename' => 'memo.txt',
        'scan_status' => 'pending',
        'extraction_status' => 'pending',
    ]);
    Storage::disk('local')->put($version->storage_path, 'Isi memo rahasia');

    $this->actingAs($user)->post(route('documents.versions.process', [$document, $version]))->assertSessionHasNoErrors();
    Queue::assertPushed(ProcessDocumentVersion::class, fn (ProcessDocumentVersion $job) => $job->documentVersionId === $version->getKey());

    app()->instance(MalwareScanner::class, new class implements MalwareScanner
    {
        public function scan(string $path): ScanResult
        {
            return new ScanResult('clean', 'Tidak ada malware yang terdeteksi.');
        }
    });
    (new ProcessDocumentVersion($version->getKey()))->handle(app(MalwareScanner::class), app(DocumentTextExtractor::class));

    expect($version->fresh()->scan_status)->toBe('clean')
        ->and($version->fresh()->extraction_status)->toBe('completed')
        ->and($version->fresh()->extracted_text)->toContain('Isi memo rahasia');
});
