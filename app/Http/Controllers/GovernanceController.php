<?php

namespace App\Http\Controllers;

use App\Actions\ArchiveMatter;
use App\Actions\CreateDocumentVersion;
use App\Actions\EnsureMatterIsNotOnLegalHold;
use App\Actions\LogCorrespondence;
use App\Actions\PlaceMatterOnLegalHold;
use App\Actions\RequestMatterExport;
use App\Actions\ResolveConflictCheck;
use App\Actions\RunConflictCheck;
use App\Http\Requests\ResolveConflictCheckRequest;
use App\Http\Requests\StoreConflictCheckRequest;
use App\Http\Requests\StoreCorrespondenceAttachmentRequest;
use App\Http\Requests\StoreCorrespondenceRequest;
use App\Http\Requests\UpdateMatterGovernanceRequest;
use App\Models\Client;
use App\Models\ConflictCheck;
use App\Models\Correspondence;
use App\Models\Document;
use App\Models\Matter;
use App\Models\MatterExport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class GovernanceController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Matter::class);
        abort_unless($request->user()->hasPermission('correspondence.view') || $request->user()->hasPermission('conflict.view') || $request->user()->hasPermission('archive.view'), 403);

        $matters = Matter::query()->visibleTo($request->user())->with('client:id,display_name')->latest('updated_at')->limit(50)->get();
        $matterIds = $matters->pluck('id');

        $metrics = [
            'total_correspondences' => Correspondence::query()->whereIn('matter_id', $matterIds)->count(),
            'conflict_checks' => ConflictCheck::query()->where(fn ($query) => $query->whereIn('matter_id', $matterIds)->orWhereNull('matter_id'))->count(),
            'pending_conflicts' => ConflictCheck::query()->where(fn ($query) => $query->whereIn('matter_id', $matterIds)->orWhereNull('matter_id'))->where('decision', 'pending')->where('status', '!=', 'clear')->count(),
            'legal_holds' => Matter::query()->whereIn('id', $matterIds)->whereNotNull('legal_hold_at')->count(),
            'archived' => Matter::query()->whereIn('id', $matterIds)->whereNotNull('archived_at')->count(),
        ];

        return Inertia::render('governance/index', [
            'matters' => $matters,
            'metrics' => $metrics,
            'correspondences' => $request->user()->hasPermission('correspondence.view')
                ? Correspondence::query()->whereIn('matter_id', $matterIds)
                    ->with('matter:id,matter_number,title')
                    ->when($request->string('matter_id')->toString(), fn ($query, $matterId) => $query->where('matter_id', $matterId))
                    ->when($request->string('direction')->toString(), fn ($query, $direction) => $query->where('direction', $direction))
                    ->when($request->string('source')->toString(), fn ($query, $source) => $query->where('source', $source))
                    ->when($request->string('search')->trim()->toString(), fn ($query, $search) => $query->where(fn ($nested) => $nested->where('subject', 'like', "%{$search}%")->orWhere('body', 'like', "%{$search}%")))
                    ->when($request->date('from'), fn ($query, $from) => $query->whereDate('occurred_at', '>=', $from))
                    ->when($request->date('to'), fn ($query, $to) => $query->whereDate('occurred_at', '<=', $to))
                    ->latest('occurred_at')->limit(50)->get()
                : [],
            'conflictChecks' => $request->user()->hasPermission('conflict.view')
                ? ConflictCheck::query()->where(fn ($query) => $query->whereIn('matter_id', $matterIds)->orWhereNull('matter_id'))->with('matter:id,matter_number,title')->latest()->limit(20)->get()
                : [],
            'exports' => MatterExport::query()->whereIn('matter_id', $matterIds)->with('matter:id,matter_number,title')->latest()->limit(20)->get(),
            'documents' => $request->user()->hasPermission('document.view')
                ? Document::query()->whereIn('matter_id', $matterIds)->orderBy('title')->get(['id', 'matter_id', 'title'])
                : [],
            'filters' => $request->only(['matter_id', 'direction', 'source', 'search', 'from', 'to']),
            'can' => [
                'correspondence' => $request->user()->hasPermission('correspondence.manage'),
                'conflict' => $request->user()->hasPermission('conflict.manage'),
                'conflictApprove' => $request->user()->hasPermission('conflict.approve'),
                'archive' => $request->user()->hasPermission('archive.manage'),
                'legalHold' => $request->user()->hasPermission('archive.legal_hold.manage'),
            ],
        ]);
    }

    public function storeCorrespondence(StoreCorrespondenceRequest $request, LogCorrespondence $log): RedirectResponse
    {
        $matter = Matter::query()->whereKey($request->validated('matter_id'))->firstOrFail();
        Gate::authorize('view', $matter);
        $attributes = $request->validated();
        $attributes['from_addresses'] = $this->addresses($attributes['from_addresses']);
        $attributes['to_addresses'] = $this->addresses($attributes['to_addresses']);
        $log->handle($matter, $attributes, $request->user());

        return back()->with('success', 'Correspondence berhasil dicatat.');
    }

    public function showCorrespondence(Request $request, Correspondence $correspondence): Response
    {
        Gate::authorize('view', $correspondence->matter);
        abort_unless($request->user()->hasPermission('correspondence.view'), 403);

        return Inertia::render('governance/correspondence-show', [
            'correspondence' => $correspondence->load([
                'matter:id,matter_number,title', 'client:id,display_name', 'creator:id,name',
                'documents.currentVersion:id,document_id,original_filename,mime_type,file_size',
            ]),
            'canUploadAttachment' => $request->user()->hasPermission('correspondence.manage') && $request->user()->hasPermission('document.upload'),
        ]);
    }

    public function storeCorrespondenceAttachment(StoreCorrespondenceAttachmentRequest $request, Correspondence $correspondence, CreateDocumentVersion $createVersion, EnsureMatterIsNotOnLegalHold $hold, AuditService $audit): RedirectResponse
    {
        Gate::authorize('view', $correspondence->matter);
        $hold->handle($correspondence->matter);
        $file = $request->file('file');
        $document = Document::query()->create([
            'matter_id' => $correspondence->matter_id,
            'client_id' => $correspondence->client_id,
            'title' => $request->validated('title') ?? pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'document_type' => 'correspondence_attachment',
            'confidentiality_level' => 'restricted',
            'created_by' => $request->user()->getKey(),
        ]);
        $createVersion->handle($document, $file, $request->user(), 'Lampiran correspondence '.$correspondence->getKey().'.');
        $correspondence->documents()->syncWithoutDetaching([$document->getKey()]);
        $audit->record($correspondence, 'correspondence.attachment_uploaded', ['document_id' => $document->getKey()], $request->user(), $request);

        return back()->with('success', 'Lampiran correspondence diunggah dan dijadwalkan untuk pemindaian.');
    }

    public function storeConflictCheck(StoreConflictCheckRequest $request, RunConflictCheck $run): RedirectResponse
    {
        try {
            $matter = $request->validated('matter_id') ? Matter::query()->whereKey($request->validated('matter_id'))->firstOrFail() : null;
            if ($matter !== null) {
                Gate::authorize('view', $matter);
            }
            $client = $request->validated('client_id') ? Client::query()->whereKey($request->validated('client_id'))->firstOrFail() : $matter?->client;
            $check = $run->handle($request->user(), (array) $request->validated('names'), $client, $matter);

            return back()->with('success', 'Conflict check selesai: '.str($check->status)->replace('_', ' ')->title().'.');
        } catch (\Throwable $e) {
            return back()->withErrors(['names' => $e->getMessage()]);
        }
    }

    public function resolveConflictCheck(ResolveConflictCheckRequest $request, ConflictCheck $conflictCheck, ResolveConflictCheck $resolve): RedirectResponse
    {
        if ($conflictCheck->matter !== null) {
            Gate::authorize('view', $conflictCheck->matter);
        }
        $resolve->handle($conflictCheck, $request->user(), $request->validated('decision'), $request->validated('decision_note'));

        return back()->with('success', 'Keputusan conflict check disimpan.');
    }

    public function placeLegalHold(UpdateMatterGovernanceRequest $request, Matter $matter, PlaceMatterOnLegalHold $legalHold): RedirectResponse
    {
        Gate::authorize('view', $matter);
        abort_unless($request->user()->hasPermission('archive.legal_hold.manage'), 403);
        $legalHold->handle($matter, $request->user(), $request->validated('reason'));

        return back()->with('success', 'Legal hold diterapkan.');
    }

    public function releaseLegalHold(UpdateMatterGovernanceRequest $request, Matter $matter, PlaceMatterOnLegalHold $legalHold): RedirectResponse
    {
        Gate::authorize('view', $matter);
        abort_unless($request->user()->hasPermission('archive.legal_hold.manage'), 403);
        $legalHold->handle($matter, $request->user(), $request->validated('reason'), false);

        return back()->with('success', 'Legal hold dilepas.');
    }

    public function archive(UpdateMatterGovernanceRequest $request, Matter $matter, ArchiveMatter $archive): RedirectResponse
    {
        Gate::authorize('archive', $matter);
        $archive->handle($matter, $request->user());

        return back()->with('success', 'Matter diarsipkan.');
    }

    public function requestExport(UpdateMatterGovernanceRequest $request, Matter $matter, RequestMatterExport $export): RedirectResponse
    {
        Gate::authorize('view', $matter);
        abort_unless($request->user()->hasPermission('archive.manage'), 403);
        $export->handle($matter, $request->user());

        return back()->with('success', 'Handover bundle sedang dibuat.');
    }

    public function downloadExport(Request $request, MatterExport $matterExport): StreamedResponse
    {
        Gate::authorize('view', $matterExport->matter);
        abort_unless($request->user()->hasPermission('archive.view'), 403);
        abort_unless($matterExport->status === 'completed' && is_string($matterExport->storage_disk) && is_string($matterExport->storage_path), 404);

        return Storage::disk($matterExport->storage_disk)->download($matterExport->storage_path, 'handover-'.$matterExport->matter->matter_number.'.zip', [
            'Content-Type' => 'application/zip',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    /** @return list<string> */
    private function addresses(string $addresses): array
    {
        return array_values(collect(explode(',', $addresses))->map(fn (string $address) => str($address)->trim()->toString())->filter()->all());
    }
}
