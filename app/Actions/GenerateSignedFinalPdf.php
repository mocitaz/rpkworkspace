<?php

namespace App\Actions;

use App\Models\SignatureRequest;
use App\Services\PdfRenderer;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use setasign\Fpdi\Fpdi;
use Symfony\Component\Process\ExecutableFinder;
use Symfony\Component\Process\Process;

class GenerateSignedFinalPdf
{
    public function handle(SignatureRequest $signatureRequest): SignatureRequest
    {
        $signatureRequest->loadMissing('documentVersion');
        $version = $signatureRequest->documentVersion;

        if ($version === null) {
            return $this->unavailable($signatureRequest, 'Versi dokumen sumber tidak tersedia.');
        }

        $extension = pathinfo($version->original_filename, PATHINFO_EXTENSION);
        $outputDirectory = storage_path('app/private/signing/'.Str::ulid());
        $sourcePath = $outputDirectory.'/source'.($extension !== '' ? '.'.$extension : '');
        if (! is_dir($outputDirectory)) {
            mkdir($outputDirectory, 0700, true);
        }

        try {
            $source = Storage::disk($version->storage_disk)->get($version->storage_path);
            file_put_contents($sourcePath, $source);
            $pdfPath = $this->asPdf($sourcePath, $version->original_filename);

            $signedPdf = null;
            if ($pdfPath !== null) {
                try {
                    $signedPdf = $this->stamp($pdfPath, $signatureRequest);
                } catch (\Throwable) {
                    $signedPdf = null;
                }
            }

            if ($signedPdf === null) {
                $signedPdf = app(PdfRenderer::class)->render('pdf.signature-record', [
                    'signatureRequest' => $signatureRequest,
                ]);
            }

            $disk = (string) config('raf.documents.disk', 'local');
            $path = 'signature-artifacts/'.$signatureRequest->getKey().'/signed-final.pdf';
            Storage::disk($disk)->put($path, $signedPdf);

            $signatureRequest->update([
                'signed_final_disk' => $disk,
                'signed_final_path' => $path,
                'signed_final_status' => 'completed',
                'signed_final_completed_at' => now(),
                'signed_final_message' => null,
            ]);

            return $signatureRequest->refresh();
        } catch (\Throwable $exception) {
            return $this->unavailable($signatureRequest, 'Signed-final PDF gagal dibuat: '.$exception->getMessage());
        } finally {
            foreach (glob($outputDirectory.'/*') ?: [] as $temporaryFile) {
                if (is_file($temporaryFile)) {
                    unlink($temporaryFile);
                }
            }
            if (is_dir($outputDirectory)) {
                rmdir($outputDirectory);
            }
        }
    }

    private function asPdf(string $sourcePath, string $originalFilename): ?string
    {
        if (strtolower(pathinfo($originalFilename, PATHINFO_EXTENSION)) === 'pdf') {
            return $sourcePath;
        }

        $binary = $this->officeBinary();
        if ($binary === null) {
            return null;
        }

        $outputDirectory = dirname($sourcePath);
        $process = new Process([$binary, '--headless', '--convert-to', 'pdf', '--outdir', $outputDirectory, $sourcePath]);
        $process->setTimeout((int) config('raf.signature.conversion_timeout', 180));
        $process->run();
        $pdfPath = $outputDirectory.'/'.pathinfo($sourcePath, PATHINFO_FILENAME).'.pdf';

        return $process->isSuccessful() && is_file($pdfPath) ? $pdfPath : null;
    }

    private function stamp(string $sourcePath, SignatureRequest $signatureRequest): string
    {
        $outputDir = dirname($sourcePath);
        $qrPath = $outputDir.'/verification.png';
        $verificationUrl = route('signature.verify', $signatureRequest->verification_code);
        $result = (new PngWriter)->write(new QrCode(data: $verificationUrl, size: 260, margin: 0));
        $result->saveToFile($qrPath);

        $signatureRequest->loadMissing('signers');

        // Extract visual signature PNGs for all signed signers
        $signerData = [];
        foreach ($signatureRequest->signers as $signer) {
            if ($signer->status !== 'signed') {
                continue;
            }

            $sigPath = null;
            if (is_string($signer->signature_data) && str_contains($signer->signature_data, ';base64,')) {
                [, $base64] = explode(';base64,', $signer->signature_data, 2);
                $decoded = base64_decode($base64);
                if ($decoded !== false && strlen($decoded) > 50) {
                    $sigPath = $outputDir.'/visual_sig_'.$signer->getKey().'.png';
                    file_put_contents($sigPath, $decoded);
                }
            }

            $signerData[] = [
                'name' => $signer->name,
                'signed_at' => $signer->signed_at ? $signer->signed_at->translatedFormat('d/m/Y H:i') : now()->translatedFormat('d/m/Y H:i'),
                'page' => $signer->page_number,
                'pos_x' => $signer->position_x,
                'pos_y' => $signer->position_y,
                'sig_path' => $sigPath,
            ];
        }

        $pdf = new Fpdi;
        $pageCount = $pdf->setSourceFile($sourcePath);

        for ($page = 1; $page <= $pageCount; $page++) {
            $template = $pdf->importPage($page);
            $size = $pdf->getTemplateSize($template);
            if (! is_array($size)) {
                throw new \RuntimeException('Ukuran halaman PDF sumber tidak dapat dibaca.');
            }
            $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
            $pdf->useTemplate($template);

            // Find signers targeted on this page, or fallback to last page if no page specified
            $pageSigners = array_filter($signerData, function ($s) use ($page, $pageCount) {
                $targetPage = $s['page'] ? (int) $s['page'] : $pageCount;

                return $targetPage === $page;
            });

            foreach ($pageSigners as $signerItem) {
                // Determine placement coordinates
                $stampW = 54; // mm
                $stampH = 22; // mm

                if ($signerItem['pos_x'] !== null && $signerItem['pos_y'] !== null) {
                    // Convert percentage to mm coordinates bounded inside printable area
                    $x = ($size['width'] * ((float) $signerItem['pos_x'])) / 100;
                    $y = ($size['height'] * ((float) $signerItem['pos_y'])) / 100;
                    $x = max(8, min($size['width'] - $stampW - 8, $x));
                    $y = max(8, min($size['height'] - $stampH - 8, $y));
                } else {
                    // Default to bottom right
                    $x = $size['width'] - $stampW - 12;
                    $y = $size['height'] - $stampH - 12;
                }

                // Draw sleek signature badge frame
                $pdf->SetFillColor(255, 255, 255);
                $pdf->SetDrawColor(15, 23, 42); // slate-900
                $pdf->Rect($x, $y, $stampW, $stampH, 'DF');

                // Draw Official QR Code on right of badge
                $qrSize = 15;
                $pdf->Image($qrPath, $x + $stampW - $qrSize - 2, $y + ($stampH - $qrSize) / 2, $qrSize, $qrSize, 'PNG');

                // If visual signature image exists, draw it
                if ($signerItem['sig_path'] && is_file($signerItem['sig_path'])) {
                    $pdf->Image($signerItem['sig_path'], $x + 2, $y + 1.5, 33, 12, 'PNG');
                }

                // Signer name and date caption
                $pdf->SetTextColor(15, 23, 42);
                $pdf->SetFont('Helvetica', 'B', 6.5);
                $pdf->SetXY($x + 2, $y + $stampH - 8);
                $pdf->Cell(34, 3, substr($signerItem['name'], 0, 22), 0, 0, 'L');

                $pdf->SetFont('Helvetica', '', 5.5);
                $pdf->SetTextColor(100, 116, 139);
                $pdf->SetXY($x + 2, $y + $stampH - 4.5);
                $pdf->Cell(34, 3, 'RPK E-Sign: '.$signerItem['signed_at'], 0, 0, 'L');
            }

            // If last page and no signers were placed, or for corporate seal
            if ($page === $pageCount && empty($signerData)) {
                $stampHeight = 18;
                $pdf->SetFillColor(255, 255, 255);
                $pdf->SetDrawColor(30, 30, 30);
                $pdf->Rect(10, max(10, $size['height'] - ($stampHeight + 10)), $size['width'] - 20, $stampHeight, 'DF');
                $pdf->SetTextColor(20, 20, 20);
                $pdf->SetFont('Helvetica', 'B', 8);
                $pdf->SetXY(14, $size['height'] - ($stampHeight + 6));
                $pdf->Cell(0, 4, 'RPK LAW FIRM · DIGITAL E-SIGN SEAL');
                $pdf->SetFont('Helvetica', '', 7);
                $pdf->SetXY(14, $size['height'] - ($stampHeight + 1));
                $pdf->Cell(0, 4, 'Verification: '.$verificationUrl);
                $pdf->SetXY(14, $size['height'] - ($stampHeight - 4));
                $pdf->Cell(0, 4, 'Checksum: '.$signatureRequest->document_checksum);

                $pdf->Image($qrPath, $size['width'] - 25, $size['height'] - ($stampHeight + 7), 13, 13, 'PNG');
            }
        }

        return $pdf->Output('S');
    }

    private function unavailable(SignatureRequest $signatureRequest, string $message): SignatureRequest
    {
        $signatureRequest->update([
            'signed_final_status' => 'unavailable',
            'signed_final_completed_at' => now(),
            'signed_final_message' => $message,
        ]);

        return $signatureRequest->refresh();
    }

    private function officeBinary(): ?string
    {
        $configured = config('raf.signature.libreoffice_binary', 'soffice');
        if (! is_string($configured) || $configured === '') {
            return null;
        }

        return is_executable($configured) ? $configured : (new ExecutableFinder)->find($configured);
    }
}
