<?php

namespace App\Http\Controllers;

use App\Actions\GenerateSignedFinalPdf;
use App\Models\SignatureRequest;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\SvgWriter;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\StreamedResponse;

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

    public function downloadSigned(string $verificationCode): StreamedResponse
    {
        $signatureRequest = SignatureRequest::query()
            ->with('document')
            ->where('verification_code', $verificationCode)
            ->firstOrFail();
        abort_unless($signatureRequest->status === 'completed', 404);

        if ($signatureRequest->signed_final_status !== 'completed' || empty($signatureRequest->signed_final_path) || ! Storage::disk((string) $signatureRequest->signed_final_disk)->exists((string) $signatureRequest->signed_final_path)) {
            app(GenerateSignedFinalPdf::class)->handle($signatureRequest);
            $signatureRequest->refresh();
        }

        $disk = (string) $signatureRequest->signed_final_disk;
        $path = (string) $signatureRequest->signed_final_path;
        if (empty($path) || ! Storage::disk($disk)->exists($path)) {
            $disk = (string) $signatureRequest->signed_record_disk;
            $path = (string) $signatureRequest->signed_record_path;
        }

        abort_unless(is_string($disk) && is_string($path) && Storage::disk($disk)->exists($path), 404);

        $safeTitle = Str::slug($signatureRequest->document?->title ?: 'dokumen');
        $filename = "{$safeTitle}-signed-{$signatureRequest->verification_code}.pdf";

        return Storage::disk($disk)->download($path, $filename, [
            'Content-Type' => 'application/pdf',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    public function downloadCertificate(string $verificationCode): StreamedResponse
    {
        $signatureRequest = SignatureRequest::query()
            ->with('document')
            ->where('verification_code', $verificationCode)
            ->firstOrFail();
        abort_unless($signatureRequest->status === 'completed', 404);

        $disk = (string) $signatureRequest->certificate_disk;
        $path = (string) $signatureRequest->certificate_path;
        abort_unless(is_string($disk) && is_string($path) && Storage::disk($disk)->exists($path), 404);

        $safeTitle = Str::slug($signatureRequest->document?->title ?: 'dokumen');
        $filename = "{$safeTitle}-sertifikat-{$signatureRequest->verification_code}.pdf";

        return Storage::disk($disk)->download($path, $filename, [
            'Content-Type' => 'application/pdf',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    public function preview(string $verificationCode): StreamedResponse
    {
        $signatureRequest = SignatureRequest::query()
            ->with(['document', 'documentVersion'])
            ->where('verification_code', $verificationCode)
            ->firstOrFail();

        $disk = null;
        $path = null;
        $filename = 'dokumen.pdf';

        if ($signatureRequest->status === 'completed') {
            if ($signatureRequest->signed_final_status !== 'completed' || empty($signatureRequest->signed_final_path) || ! Storage::disk((string) $signatureRequest->signed_final_disk)->exists((string) $signatureRequest->signed_final_path)) {
                app(GenerateSignedFinalPdf::class)->handle($signatureRequest);
                $signatureRequest->refresh();
            }

            $disk = (string) $signatureRequest->signed_final_disk;
            $path = (string) $signatureRequest->signed_final_path;
            if (empty($path) || ! Storage::disk($disk)->exists($path)) {
                $disk = (string) $signatureRequest->signed_record_disk;
                $path = (string) $signatureRequest->signed_record_path;
            }
            $filename = Str::slug($signatureRequest->document?->title ?: 'dokumen').'-signed.pdf';
        }

        if (empty($path) || ! is_string($disk) || ! Storage::disk($disk)->exists($path)) {
            $version = $signatureRequest->documentVersion;
            if ($version && Storage::disk((string) $version->storage_disk)->exists((string) $version->storage_path)) {
                $disk = (string) $version->storage_disk;
                $path = (string) $version->storage_path;
                $filename = $version->original_filename;
            }
        }

        abort_unless(is_string($disk) && is_string($path) && Storage::disk($disk)->exists($path), 404);

        return Storage::disk($disk)->response($path, $filename, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$filename.'"',
        ]);
    }
}
