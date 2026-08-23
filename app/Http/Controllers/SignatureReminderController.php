<?php

namespace App\Http\Controllers;

use App\Actions\ResendSignatureReminder;
use App\Http\Requests\StoreSignatureReminderRequest;
use App\Models\SignatureRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class SignatureReminderController extends Controller
{
    public function store(StoreSignatureReminderRequest $request, SignatureRequest $signatureRequest, ResendSignatureReminder $remind): RedirectResponse
    {
        $signatureRequest->loadMissing('document');
        Gate::authorize('view', $signatureRequest->document);
        $count = $remind->handle($signatureRequest, $request->user());

        return back()->with('success', $count.' reminder tanda tangan masuk ke antrean.');
    }
}
