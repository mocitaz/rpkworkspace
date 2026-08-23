<?php

namespace App\Http\Controllers;

use App\Actions\SignSignatureRequest as SignSignatureRequestAction;
use App\Http\Requests\SignSignatureRequest;
use App\Models\SignatureSigner;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class SignatureSigningController extends Controller
{
    public function show(string $token): View
    {
        $signer = SignatureSigner::query()->with(['signatureRequest.document'])->where('signing_token', $token)->firstOrFail();

        return view('signature.sign', compact('signer'));
    }

    public function store(SignSignatureRequest $request, string $token, SignSignatureRequestAction $sign): RedirectResponse
    {
        $signer = SignatureSigner::query()->where('signing_token', $token)->firstOrFail();
        $signatureRequest = $sign->handle($signer, $request->validated('accepted_name'), $request);

        return to_route('signature.verify', $signatureRequest->verification_code)
            ->with('success', 'Penerimaan internal RAF berhasil dicatat.');
    }
}
