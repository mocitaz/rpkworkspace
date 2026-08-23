<?php

namespace App\Http\Controllers;

use App\Actions\GenerateDocumentFromTemplate;
use App\Http\Requests\CreateDocumentTemplateVersionRequest;
use App\Http\Requests\GenerateDocumentFromTemplateRequest;
use App\Http\Requests\StoreDocumentTemplateRequest;
use App\Http\Requests\UpdateDocumentTemplateRequest;
use App\Jobs\ProcessDocumentTemplate;
use App\Models\DocumentTemplate;
use App\Models\Matter;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DocumentTemplateController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->hasPermission('template.view'), 403);

        $metrics = [
            'total' => DocumentTemplate::query()->count(),
            'active' => DocumentTemplate::query()->where('status', 'active')->count(),
            'clean_scanned' => DocumentTemplate::query()->where('scan_status', 'clean')->count(),
            'types_count' => DocumentTemplate::query()->distinct('document_type')->count('document_type'),
        ];

        return Inertia::render('templates/index', [
            'templates' => DocumentTemplate::query()->with('creator:id,name')->latest()->get(),
            'matters' => Matter::query()->visibleTo($request->user())->whereNotIn('status', ['closed', 'archived'])->orderBy('matter_number')->get(['id', 'matter_number', 'title']),
            'metrics' => $metrics,
            'can' => ['manage' => $request->user()->hasPermission('template.manage')],
        ]);
    }

    public function store(StoreDocumentTemplateRequest $request, AuditService $audit): RedirectResponse
    {
        $file = $request->file('file');
        $disk = config('raf.documents.disk', 'local');
        $path = 'templates/'.Str::ulid().'.docx';
        Storage::disk($disk)->putFileAs('templates', $file, basename($path));

        $template = DocumentTemplate::query()->create([
            ...$request->safe()->except('file'),
            'storage_disk' => $disk,
            'storage_path' => $path,
            'original_filename' => $file->getClientOriginalName(),
            'checksum' => hash_file('sha256', $file->getRealPath()),
            'created_by' => $request->user()->getKey(),
        ]);
        $template->update(['root_template_id' => $template->getKey()]);
        ProcessDocumentTemplate::dispatch((string) $template->getKey())->afterCommit();
        $audit->record($template, 'template.created', [], $request->user(), $request);

        return back()->with('success', 'Template DOCX disimpan secara privat.');
    }

    public function update(UpdateDocumentTemplateRequest $request, DocumentTemplate $template, AuditService $audit): RedirectResponse
    {
        $before = $template->only(['name', 'document_type', 'placeholders', 'status']);
        $template->update($request->validated());
        $audit->recordChange($template, 'template.updated', $before, $template->only(array_keys($before)), $request->user(), $request);

        return back()->with('success', 'Metadata template diperbarui.');
    }

    public function duplicate(Request $request, DocumentTemplate $template, AuditService $audit): RedirectResponse
    {
        abort_unless($request->user()->hasPermission('template.manage'), 403);
        $copy = $this->copyTemplate($template, $request->user()->getKey(), $template->name.' (salinan)', 1);
        $audit->record($copy, 'template.duplicated', ['source_template_id' => $template->getKey()], $request->user(), $request);

        return back()->with('success', 'Salinan template dibuat.');
    }

    public function createVersion(CreateDocumentTemplateVersionRequest $request, DocumentTemplate $template, AuditService $audit): RedirectResponse
    {
        $rootId = $template->root_template_id ?? $template->getKey();
        $nextVersion = (int) DocumentTemplate::query()->where('root_template_id', $rootId)->max('version') + 1;
        $file = $request->file('file');
        $disk = (string) config('raf.documents.disk', 'local');
        $path = 'templates/'.Str::ulid().'.docx';
        Storage::disk($disk)->putFileAs('templates', $file, basename($path));
        $template->update(['status' => 'inactive', 'superseded_at' => now()]);
        $version = DocumentTemplate::query()->create([
            'name' => $request->validated('name') ?? $template->name,
            'document_type' => $request->validated('document_type') ?? $template->document_type,
            'storage_disk' => $disk,
            'storage_path' => $path,
            'original_filename' => $file->getClientOriginalName(),
            'checksum' => hash_file('sha256', $file->getRealPath()),
            'placeholders' => $request->validated('placeholders') ?? $template->placeholders,
            'status' => 'active',
            'scan_status' => 'pending',
            'version' => $nextVersion,
            'root_template_id' => $rootId,
            'created_by' => $request->user()->getKey(),
        ]);
        ProcessDocumentTemplate::dispatch((string) $version->getKey())->afterCommit();
        $audit->record($version, 'template.version_created', ['previous_template_id' => $template->getKey(), 'version' => $nextVersion], $request->user(), $request);

        return back()->with('success', 'Versi '.$nextVersion.' template dibuat dan versi sebelumnya dinonaktifkan.');
    }

    public function generate(GenerateDocumentFromTemplateRequest $request, DocumentTemplate $template, GenerateDocumentFromTemplate $generate): RedirectResponse
    {
        abort_if($template->status !== 'active', 422, 'Template tidak aktif.');
        abort_unless($template->scan_status === 'clean', 423, 'Template belum lolos pemindaian malware.');
        $matter = Matter::query()->whereKey($request->validated('matter_id'))->sole();
        Gate::authorize('view', $matter);
        $document = $generate->handle($template, $matter, $request->user(), $request->validated('placeholders') ?? [], $request->validated('title'));

        return to_route('documents.show', $document)->with('success', 'Dokumen berhasil dihasilkan dari template.');
    }

    private function copyTemplate(DocumentTemplate $template, int $creatorId, string $name, int $version, ?string $rootTemplateId = null): DocumentTemplate
    {
        $disk = $template->storage_disk;
        $path = 'templates/'.Str::ulid().'.docx';
        Storage::disk($disk)->copy($template->storage_path, $path);

        $copy = DocumentTemplate::query()->create([
            'name' => $name,
            'document_type' => $template->document_type,
            'storage_disk' => $disk,
            'storage_path' => $path,
            'original_filename' => $template->original_filename,
            'checksum' => $template->checksum,
            'placeholders' => $template->placeholders,
            'status' => 'active',
            'scan_status' => $template->scan_status,
            'scan_message' => $template->scan_message,
            'scanned_at' => $template->scanned_at,
            'version' => $version,
            'root_template_id' => $rootTemplateId,
            'created_by' => $creatorId,
        ]);

        if ($copy->root_template_id === null) {
            $copy->update(['root_template_id' => $copy->getKey()]);
        }

        return $copy;
    }
}
