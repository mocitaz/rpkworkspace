<?php

namespace App\Http\Controllers;

use App\Models\SignatureRequest;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\SvgWriter;
use Illuminate\Http\Response;
use Illuminate\View\View;

class SignatureVerificationController extends Controller
{
    public function show(string $verificationCode): View
    {
        $signatureRequest = SignatureRequest::query()
            ->with(['document:id,title', 'documentVersion:id,checksum,version_number', 'signers:id,signature_request_id,name,status,signed_at'])
            ->where('verification_code', $verificationCode)
            ->firstOrFail();

        return view('signature.verify', compact('signatureRequest'));
    }

    public function qr(string $verificationCode): Response
    {
        $signatureRequest = SignatureRequest::query()->where('verification_code', $verificationCode)->firstOrFail();
        $result = (new SvgWriter)->write(new QrCode(data: route('signature.verify', $signatureRequest->verification_code), size: 320, margin: 10));

        return response($result->getString(), 200, ['Content-Type' => $result->getMimeType(), 'Cache-Control' => 'public, max-age=3600']);
    }
}
