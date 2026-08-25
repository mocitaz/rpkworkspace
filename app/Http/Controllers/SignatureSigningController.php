<?php

namespace App\Http\Controllers;

use App\Actions\SignSignatureRequest as SignSignatureRequestAction;
use App\Http\Requests\SignSignatureRequest;
use App\Models\SignatureSigner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SignatureSigningController extends Controller
{
    public function show(string $token): View
    {
        $signer = SignatureSigner::query()->with(['signatureRequest.document', 'signatureRequest.documentVersion'])->where('signing_token', $token)->firstOrFail();

        return view('signature.sign', compact('signer'));
    }

    public function pdf(string $token): StreamedResponse
    {
        $signer = SignatureSigner::query()->with(['signatureRequest.documentVersion'])->where('signing_token', $token)->firstOrFail();
        $version = $signer->signatureRequest->documentVersion;
        abort_unless($version && Storage::disk((string) $version->storage_disk)->exists((string) $version->storage_path), 404);

        return Storage::disk((string) $version->storage_disk)->response((string) $version->storage_path, $version->original_filename, [
            'Content-Type' => $version->mime_type ?: 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$version->original_filename.'"',
        ]);
    }

    public function store(SignSignatureRequest $request, string $token, SignSignatureRequestAction $sign): RedirectResponse
    {
        $signer = SignatureSigner::query()->where('signing_token', $token)->firstOrFail();
        $signatureRequest = $sign->handle($signer, $request->validated('accepted_name'), $request);

        return to_route('signature.verify', $signatureRequest->verification_code)
            ->with('success', 'Tanda tangan elektronik resmi RPK berhasil dibubuhkan.');
    }
}
