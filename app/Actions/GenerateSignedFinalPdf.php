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

        $signatureRequest->loadMissing(['document', 'signers']);

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
                    $im = @imagecreatefromstring($decoded);
                    if ($im !== false) {
                        imagesavealpha($im, true);
                        $cropped = function_exists('imagecropauto') ? @imagecropauto($im, IMG_CROP_TRANSPARENT) : false;
                        if ($cropped !== false) {
                            imagedestroy($im);
                            $im = $cropped;
                            imagesavealpha($im, true);
                        }
                        imagepng($im, $sigPath);
                        imagedestroy($im);
                    } else {
                        file_put_contents($sigPath, $decoded);
                    }
                }
            }

            $signerData[] = [
                'name' => $signer->accepted_name ?: $signer->name,
                'signed_at' => $signer->signed_at ? $signer->signed_at->translatedFormat('d/m/Y H:i') : now()->translatedFormat('d/m/Y H:i'),
                'page' => $signer->page_number,
                'pos_x' => $signer->position_x,
                'pos_y' => $signer->position_y,
                'layout' => $signer->stamp_layout ?: 'sig_left',
                'name_pos' => $signer->name_position ?: 'bottom',
                'title' => $signer->signer_title,
                'sig_path' => $sigPath,
            ];
        }

        $pdf = new Fpdi;
        $docTitle = $signatureRequest->document?->title ?: 'Dokumen Bertanda Tangan';
        $pdf->SetTitle($docTitle, true);
        $pdf->SetAuthor('RPK Law Firm', true);
        $pdf->SetCreator('RPK Law Firm Workspace', true);
        $pdf->SetSubject('Dokumen Resmi Bertanda Tangan Digital - '.$signatureRequest->verification_code, true);

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
                // Determine placement coordinates & size
                $stampW = 66; // mm
                $stampH = 26; // mm

                if ($signerItem['pos_x'] !== null && $signerItem['pos_y'] !== null) {
                    $x = ($size['width'] * ((float) $signerItem['pos_x'])) / 100;
                    $y = ($size['height'] * ((float) $signerItem['pos_y'])) / 100;
                    $x = max(5, min($size['width'] - $stampW - 5, $x));
                    $y = max(5, min($size['height'] - $stampH - 5, $y));
                } else {
                    $x = $size['width'] - $stampW - 12;
                    $y = $size['height'] - $stampH - 12;
                }

                // Draw clean white background card with refined border
                $pdf->SetFillColor(255, 255, 255);
                $pdf->SetDrawColor(218, 225, 233); // soft slate border
                $pdf->SetLineWidth(0.3);
                $pdf->Rect($x, $y, $stampW, $stampH, 'DF');

                $isQrLeft = $signerItem['layout'] === 'qr_left';
                $isNameTop = $signerItem['name_pos'] === 'top';

                $qrSize = 20; // mm
                $qrX = $isQrLeft ? $x + 3 : $x + $stampW - $qrSize - 3;
                $qrY = $y + ($stampH - $qrSize) / 2;

                $contentX = $isQrLeft ? $x + $qrSize + 5.5 : $x + 3.5;
                $contentW = $stampW - $qrSize - 8;

                // QR Code Container Frame
                $pdf->SetFillColor(248, 250, 252);
                $pdf->SetDrawColor(226, 232, 240);
                $pdf->SetLineWidth(0.2);
                $pdf->Rect($qrX, $qrY, $qrSize, $qrSize, 'DF');

                // Draw QR Code inside framed container
                $pdf->Image($qrPath, $qrX + 1, $qrY + 1, $qrSize - 2, $qrSize - 2, 'PNG');

                if ($isNameTop) {
                    // Name on Top
                    $pdf->SetTextColor(15, 23, 42);
                    $pdf->SetFont('Helvetica', 'B', 7.5);
                    $pdf->SetXY($contentX, $y + 2.5);
                    $pdf->Cell($contentW, 3.5, substr($signerItem['name'], 0, 28), 0, 0, 'L');

                    if ($signerItem['title']) {
                        $pdf->SetFont('Helvetica', '', 5.5);
                        $pdf->SetTextColor(100, 116, 139);
                        $pdf->SetXY($contentX, $y + 6);
                        $pdf->Cell($contentW, 2.5, substr($signerItem['title'], 0, 32), 0, 0, 'L');
                    }

                    // Divider line under name
                    $pdf->SetDrawColor(241, 245, 249);
                    $pdf->SetLineWidth(0.2);
                    $pdf->Line($contentX, $y + 9, $contentX + $contentW, $y + 9);

                    // Signature Image with STRICT aspect ratio preservation (No Distortion)
                    if ($signerItem['sig_path'] && is_file($signerItem['sig_path'])) {
                        $imgInfo = @getimagesize($signerItem['sig_path']);
                        if ($imgInfo && $imgInfo[0] > 0 && $imgInfo[1] > 0) {
                            $imgW = (float) $imgInfo[0];
                            $imgH = (float) $imgInfo[1];
                            $maxW = $contentW;
                            $maxH = 14.5;

                            $scale = min($maxW / $imgW, $maxH / $imgH);
                            $targetW = max(4, $imgW * $scale);
                            $targetH = max(3, $imgH * $scale);

                            // Center signature in slot
                            $sigX = $contentX + ($maxW - $targetW) / 2;
                            $sigY = $y + 10 + ($maxH - $targetH) / 2;

                            $pdf->Image($signerItem['sig_path'], $sigX, $sigY, $targetW, $targetH, 'PNG');
                        }
                    }
                } else {
                    // Signature Image on Top with STRICT aspect ratio preservation (No Distortion)
                    if ($signerItem['sig_path'] && is_file($signerItem['sig_path'])) {
                        $imgInfo = @getimagesize($signerItem['sig_path']);
                        if ($imgInfo && $imgInfo[0] > 0 && $imgInfo[1] > 0) {
                            $imgW = (float) $imgInfo[0];
                            $imgH = (float) $imgInfo[1];
                            $maxW = $contentW;
                            $maxH = 14;

                            $scale = min($maxW / $imgW, $maxH / $imgH);
                            $targetW = max(4, $imgW * $scale);
                            $targetH = max(3, $imgH * $scale);

                            // Center signature in slot
                            $sigX = $contentX + ($maxW - $targetW) / 2;
                            $sigY = $y + 2 + ($maxH - $targetH) / 2;

                            $pdf->Image($signerItem['sig_path'], $sigX, $sigY, $targetW, $targetH, 'PNG');
                        }
                    }

                    // Divider line above name
                    $pdf->SetDrawColor(241, 245, 249);
                    $pdf->SetLineWidth(0.2);
                    $pdf->Line($contentX, $y + 17, $contentX + $contentW, $y + 17);

                    // Name on Bottom
                    $pdf->SetTextColor(15, 23, 42);
                    $pdf->SetFont('Helvetica', 'B', 7.5);
                    $pdf->SetXY($contentX, $y + 18);
                    $pdf->Cell($contentW, 3.5, substr($signerItem['name'], 0, 28), 0, 0, 'L');

                    if ($signerItem['title']) {
                        $pdf->SetFont('Helvetica', '', 5.5);
                        $pdf->SetTextColor(100, 116, 139);
                        $pdf->SetXY($contentX, $y + 21.5);
                        $pdf->Cell($contentW, 2.5, substr($signerItem['title'], 0, 32), 0, 0, 'L');
                    }
                }
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
