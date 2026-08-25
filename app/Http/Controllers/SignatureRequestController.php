<?php

namespace App\Http\Controllers;

use App\Actions\CreateSignatureRequest;
use App\Http\Requests\StoreSignatureRequestRequest;
use App\Models\Document;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class SignatureRequestController extends Controller
{
    public function store(StoreSignatureRequestRequest $request, Document $document, CreateSignatureRequest $create): RedirectResponse
    {
        Gate::authorize('view', $document);

        try {
            $signatureRequest = $create->handle(
                $document->load(['currentVersion', 'versions']),
                $request->user(),
                $request->validated('signers'),
                $request->validated('mode'),
                $request->date('expires_at'),
                $request->validated('document_version_id')
            );

            return back()->with('success', 'Permintaan tanda tangan dikirim. Kode verifikasi: '.$signatureRequest->verification_code);
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
