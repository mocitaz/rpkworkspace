<?php

namespace App\Http\Controllers;

use App\Actions\ResolveDocumentApproval;
use App\Actions\SubmitDocumentForApproval;
use App\Models\Document;
use App\Models\DocumentApproval;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class DocumentApprovalController extends Controller
{
    public function store(Request $request, Document $document, SubmitDocumentForApproval $submit): RedirectResponse
    {
        Gate::authorize('update', $document);
        $data = $request->validate(['reviewer_id' => ['required', 'exists:users,id'], 'note' => ['nullable', 'string', 'max:2000']]);
        $reviewer = User::query()->whereKey($data['reviewer_id'])->sole();
        $submit->handle($document, $request->user(), $reviewer, $data['note'] ?? null);

        return back()->with('success', 'Dokumen dikirim untuk review.');
    }

    public function resolve(Request $request, DocumentApproval $approval, ResolveDocumentApproval $resolve): RedirectResponse
    {
        Gate::authorize('view', $approval->document);
        abort_unless($request->user()->hasPermission('document.approve'), 403);
        $data = $request->validate(['approved' => ['required', 'boolean'], 'note' => ['nullable', 'string', 'max:2000']]);
        $resolve->handle($approval, $request->user(), (bool) $data['approved'], $data['note'] ?? null);

        return back()->with('success', 'Keputusan review disimpan.');
    }
}
