<?php

use App\Models\Document;
use App\Models\Matter;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

it('stores document versions privately without overwriting the prior file', function () {
    Storage::fake('local');
    $user = rafUser(['matter.view', 'document.view', 'document.upload', 'document.download']);
    $matter = Matter::factory()->recycle($user)->create();

    $this->actingAs($user)->post(route('documents.store'), [
        'matter_id' => $matter->getKey(), 'title' => 'Legal Opinion', 'document_type' => 'legal_opinion',
        'status' => 'draft', 'confidentiality_level' => 'standard',
        'file' => UploadedFile::fake()->create('opinion-v1.pdf', 100, 'application/pdf'),
    ])->assertSessionHasNoErrors();

    $document = Document::query()->firstOrFail();
    $firstVersion = $document->versions()->firstOrFail();
    Storage::disk('local')->assertExists($firstVersion->storage_path);
    expect($firstVersion->storage_path)->toStartWith('documents/'.$document->getKey().'/')
        ->and($firstVersion->storage_path)->not->toContain('opinion-v1.pdf');

    $this->actingAs($user)->post(route('documents.versions.store', $document), [
        'file' => UploadedFile::fake()->create('opinion-v2.pdf', 120, 'application/pdf'),
        'notes' => 'Revisi kedua',
    ])->assertSessionHasNoErrors();

    $versions = $document->versions()->orderBy('version_number')->get();
    expect($versions)->toHaveCount(2)
        ->and($versions[0]->storage_path)->not->toBe($versions[1]->storage_path)
        ->and($versions[0]->checksum)->not->toBeEmpty();
    Storage::disk('local')->assertExists($versions[0]->storage_path);
    Storage::disk('local')->assertExists($versions[1]->storage_path);
});

it('denies an unauthorized document download', function () {
    Storage::fake('local');
    $owner = rafUser(['matter.view', 'document.view', 'document.upload', 'document.download']);
    $outsider = rafUser([]);
    $matter = Matter::factory()->recycle($owner)->create();
    $this->actingAs($owner)->post(route('documents.store'), [
        'matter_id' => $matter->getKey(), 'title' => 'Restricted File', 'status' => 'draft',
        'confidentiality_level' => 'restricted', 'file' => UploadedFile::fake()->create('file.pdf', 10, 'application/pdf'),
    ]);
    $document = Document::query()->firstOrFail();
    $version = $document->versions()->firstOrFail();

    $this->actingAs($outsider)->get(route('documents.versions.download', [$document, $version]))->assertForbidden();
});

it('uploads general pdf documents seamlessly without matter_id and with strictly_confidential or default status', function () {
    Storage::fake('local');
    $user = rafUser(['document.view', 'document.upload', 'document.download']);

    $response = $this->actingAs($user)->post(route('documents.store'), [
        'title' => 'Surat Kuasa Khusus',
        'document_type' => 'Surat Kuasa',
        'matter_id' => '',
        'client_id' => '',
        'confidentiality_level' => 'strictly_confidential',
        'notes' => 'Draf surat kuasa asli ditandatangani basah.',
        'file' => UploadedFile::fake()->create('surat_kuasa.pdf', 250, 'application/pdf'),
    ]);

    $response->assertSessionHasNoErrors();
    $document = Document::query()->where('title', 'Surat Kuasa Khusus')->firstOrFail();
    expect($document->status)->toBe('draft')
        ->and($document->confidentiality_level)->toBe('strictly_confidential')
        ->and($document->matter_id)->toBeNull()
        ->and($document->versions)->toHaveCount(1);

    $version = $document->versions->first();
    expect($version->original_filename)->toBe('surat_kuasa.pdf')
        ->and($version->mime_type)->toBe('application/pdf')
        ->and($version->notes)->toBe('Draf surat kuasa asli ditandatangani basah.');

    Storage::disk('local')->assertExists($version->storage_path);

    $previewResponse = $this->actingAs($user)->get(route('documents.versions.preview', [$document, $version]));
    $previewResponse->assertOk()
        ->assertHeader('Content-Type', 'application/pdf');
});
