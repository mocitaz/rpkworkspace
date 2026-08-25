<?php

namespace App\Http\Controllers;

use App\Actions\GenerateSignedFinalPdf;
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
            ->with([
                'document.matter:id,matter_number,title',
                'document.client:id,client_number,display_name',
                'documentVersion:id,document_id,checksum,version_number,original_filename,file_size,mime_type',
                'signers' => fn ($q) => $q->orderBy('signing_order')->orderBy('id'),
            ])
            ->where('verification_code', $verificationCode)
            ->firstOrFail();

        if ($signatureRequest->status === 'completed' && ($signatureRequest->signed_final_status !== 'completed' || empty($signatureRequest->signed_final_path))) {
            app(GenerateSignedFinalPdf::class)->handle($signatureRequest);
            $signatureRequest->refresh();
        }

        return view('signature.verify', compact('signatureRequest'));
    }

    public function qr(string $verificationCode): Response
    {
        $signatureRequest = SignatureRequest::query()->where('verification_code', $verificationCode)->firstOrFail();
        $result = (new SvgWriter)->write(new QrCode(data: route('signature.verify', $signatureRequest->verification_code), size: 320, margin: 10));

        return response($result->getString(), 200, ['Content-Type' => $result->getMimeType(), 'Cache-Control' => 'public, max-age=3600']);
    }
}
