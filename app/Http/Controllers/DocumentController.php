<?php

namespace App\Http\Controllers;

use App\Actions\CreateDocumentVersion;
use App\Actions\EnsureMatterIsNotOnLegalHold;
use App\Actions\GenerateSignedFinalPdf;
use App\Http\Requests\StoreDocumentRequest;
use App\Models\Client;
use App\Models\Document;
use App\Models\Matter;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Document::class);
        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->toString();
        $matterId = $request->string('matter_id')->toString();
        $documentType = $request->string('document_type')->toString();

        $baseQuery = Document::query()->visibleTo($request->user());

        $metrics = [
            'total' => (clone $baseQuery)->count(),
            'confidential' => (clone $baseQuery)->whereIn('confidentiality_level', ['confidential', 'restricted', 'strictly_confidential'])->count(),
            'under_review' => (clone $baseQuery)->where('status', 'under_review')->count(),
            'linked_matters' => (clone $baseQuery)->whereNotNull('matter_id')->distinct('matter_id')->count('matter_id'),
        ];

        $documents = (clone $baseQuery)
            ->with(['matter:id,matter_number,title', 'client:id,display_name', 'currentVersion:id,document_id,version_number,mime_type,file_size,created_at'])
            ->when($search, fn ($query) => $query->where('title', 'like', "%{$search}%"))
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($matterId, fn ($query) => $query->where('matter_id', $matterId))
            ->when($documentType, fn ($query) => $query->where('document_type', $documentType))
            ->latest('updated_at')->paginate(20)->withQueryString();

        return Inertia::render('documents/index', [
            'documents' => $documents,
            'matters' => Matter::query()->visibleTo($request->user())->whereNotIn('status', ['closed', 'archived'])->orderBy('matter_number')->get(['id', 'matter_number', 'title', 'client_id']),
            'clients' => Client::query()->where('status', 'active')->orderBy('display_name')->get(['id', 'display_name']),
            'metrics' => $metrics,
            'filters' => $request->only(['search', 'status', 'matter_id', 'document_type']),
            'can' => ['upload' => $request->user()->can('create', Document::class)],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDocumentRequest $request, CreateDocumentVersion $createVersion, AuditService $audit): RedirectResponse
    {
        if ($request->validated('matter_id')) {
            Gate::authorize('view', Matter::query()->findOrFail($request->validated('matter_id')));
        }

        $document = DB::transaction(function () use ($request, $createVersion) {
            $data = $request->safe()->except(['file', 'notes']);
            $document = Document::query()->create([
                ...$data,
                'status' => $data['status'] ?? 'draft',
                'confidentiality_level' => $data['confidentiality_level'] ?? 'standard',
                'created_by' => $request->user()->getKey(),
            ]);
            $createVersion->handle($document, $request->file('file'), $request->user(), $request->validated('notes'));

            return $document;
        });

        $audit->record($document, 'document.uploaded', ['title' => $document->title], $request->user(), $request);

        return to_route('documents.show', $document)->with('success', 'Dokumen berhasil diunggah secara privat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Document $document): Response
    {
        Gate::authorize('view', $document);

        $document->load([
            'matter:id,matter_number,title,legal_hold_at', 'client:id,client_number,display_name',
            'creator:id,name', 'versions.uploader:id,name',
            'approvals.reviewer:id,name', 'approvals.requester:id,name',
            'signatureRequests.signers:id,signature_request_id,name,email,status,signed_at,signing_token',
            'comments' => fn ($query) => $query->whereNull('parent_id')->with([
                'user:id,name,position_title,avatar_path',
                'reactions.user:id,name',
                'replies' => fn ($r) => $r->with(['user:id,name,position_title,avatar_path', 'reactions.user:id,name'])->oldest(),
            ])->orderByDesc('is_pinned')->latest(),
        ]);

        foreach ($document->signatureRequests as $sigReq) {
            if ($sigReq->status === 'completed' && ($sigReq->signed_final_status !== 'completed' || empty($sigReq->signed_final_path))) {
                app(GenerateSignedFinalPdf::class)->handle($sigReq);
            }
        }

        return Inertia::render('documents/show', [
            'document' => $document->fresh([
                'matter:id,matter_number,title,legal_hold_at', 'client:id,client_number,display_name',
                'creator:id,name', 'versions.uploader:id,name',
                'approvals.reviewer:id,name', 'approvals.requester:id,name',
                'signatureRequests.signers:id,signature_request_id,name,email,status,signed_at,signing_token',
                'comments' => fn ($query) => $query->whereNull('parent_id')->with([
                    'user:id,name,position_title,avatar_path',
                    'reactions.user:id,name',
                    'replies' => fn ($r) => $r->with(['user:id,name,position_title,avatar_path', 'reactions.user:id,name'])->oldest(),
                ])->orderByDesc('is_pinned')->latest(),
            ]),
            'firmStaff' => User::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'email', 'position_title', 'avatar_path']),
            'can' => [
                'uploadVersion' => $request->user()->can('update', $document),
                'download' => $request->user()->can('download', $document),
                'delete' => $request->user()->can('delete', $document),
                'approve' => $request->user()->hasPermission('document.approve'),
                'signature' => $request->user()->hasPermission('signature.manage'),
            ],
            'reviewers' => $request->user()->hasPermission('document.upload')
                ? User::query()->where('is_active', true)->orderBy('name')->get(['id', 'name'])
                : [],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document, EnsureMatterIsNotOnLegalHold $hold, AuditService $audit): RedirectResponse
    {
        Gate::authorize('delete', $document);
        if ($document->matter) {
            $hold->handle($document->matter);
        }

        $title = $document->title;
        $document->delete();

        $audit->record($document, 'document.deleted', ['title' => $title], request()->user(), request());

        return to_route('documents.index')->with('success', 'Dokumen berhasil dihapus.');
    }
}
