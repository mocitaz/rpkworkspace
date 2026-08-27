<?php

namespace App\Actions;

use App\Models\SignatureRequest;
use App\Services\SignatureCertificateService;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use setasign\Fpdi\Fpdi;
use Symfony\Component\Process\ExecutableFinder;
use Symfony\Component\Process\Process;

class GenerateSignedFinalPdf
{
    public function __construct(private SignatureCertificateService $certificates) {}

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
            $sourceChecksum = hash('sha256', $source);
            if (! hash_equals((string) $version->checksum, $sourceChecksum)
                || ! hash_equals((string) $signatureRequest->document_checksum, $sourceChecksum)) {
                return $this->unavailable($signatureRequest, 'Checksum SHA-256 dokumen sumber tidak cocok. Proses dihentikan untuk menjaga integritas berkas.');
            }
            file_put_contents($sourcePath, $source);

            if (strtolower($extension) !== 'pdf' && $this->officeBinary() === null) {
                return $this->unavailable($signatureRequest, 'Dokumen Word belum dapat dikonversi karena LibreOffice headless tidak tersedia. Berkas sumber tetap aman dan dapat diproses ulang setelah LibreOffice dipasang.');
            }
            $pdfPath = $this->asPdf($sourcePath, $version->original_filename);

            $signedPdf = null;
            if ($pdfPath === null) {
                return $this->unavailable($signatureRequest, 'Konversi dokumen sumber ke PDF tidak tersedia.');
            }

            try {
                $signedPdf = $this->stamp($pdfPath, $signatureRequest);
            } catch (\Throwable $e) {
                return $this->unavailable($signatureRequest, 'Gagal menyematkan tanda tangan ke berkas PDF: '.$e->getMessage());
            }

            $disk = (string) config('raf.documents.disk', 'local');
            $path = 'signature-artifacts/'.$signatureRequest->getKey().'/signed-final.pdf';
            Storage::disk($disk)->put($path, $signedPdf);
            $signedFinalChecksum = hash('sha256', $signedPdf);

            $signatureRequest->update([
                'signed_final_disk' => $disk,
                'signed_final_path' => $path,
                'signed_final_checksum' => $signedFinalChecksum,
                'signed_final_status' => 'completed',
                'signed_final_completed_at' => now(),
                'signed_final_message' => null,
            ]);

            $this->certificates->generate($signatureRequest->refresh());

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
                'stamp_width' => $signer->stamp_width ?: 58.0,
                'stamp_height' => $signer->stamp_height ?: 30.0,
                'show_qr' => $signer->show_qr ?? true,
                'show_name' => $signer->show_name ?? true,
                'show_title' => $signer->show_title ?? true,
                'show_border' => $signer->show_border ?? true,
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
                // Determine placement coordinates & dynamic size
                $stampW = (float) ($signerItem['stamp_width'] ?? 58.0);
                $stampH = (float) ($signerItem['stamp_height'] ?? 30.0);
                $showQr = (bool) ($signerItem['show_qr'] ?? true);
                $showName = (bool) ($signerItem['show_name'] ?? true);
                $showTitle = (bool) ($signerItem['show_title'] ?? true);
                $showBorder = (bool) ($signerItem['show_border'] ?? true);
                $layout = (string) ($signerItem['layout'] ?? 'sig_left');
                $namePos = (string) ($signerItem['name_pos'] ?? 'bottom');

                if ($signerItem['pos_x'] !== null && $signerItem['pos_y'] !== null) {
                    $x = ($size['width'] * ((float) $signerItem['pos_x'])) / 100;
                    $y = ($size['height'] * ((float) $signerItem['pos_y'])) / 100;
                    $x = max(3, min($size['width'] - $stampW - 3, $x));
                    $y = max(3, min($size['height'] - $stampH - 3, $y));
                } else {
                    $x = $size['width'] - $stampW - 10;
                    $y = $size['height'] - $stampH - 10;
                }

                // Draw clean white background card with refined border if enabled
                if ($showBorder) {
                    $pdf->SetFillColor(255, 255, 255);
                    $pdf->SetDrawColor(218, 225, 233); // soft slate border
                    $pdf->SetLineWidth(0.25);
                    $pdf->Rect($x, $y, $stampW, $stampH, 'DF');
                }

                $isQrLeft = $layout === 'qr_left';
                $isNameTop = $namePos === 'top';

                if ($showQr && $layout !== 'sig_only') {
                    $qrSize = min(18.0, min($stampW * 0.36, $stampH * 0.78));
                    $qrMargin = 2.0;
                    $qrX = $isQrLeft ? $x + $qrMargin : $x + $stampW - $qrSize - $qrMargin;
                    $qrY = $y + ($stampH - $qrSize) / 2;

                    $contentX = $isQrLeft ? $x + $qrSize + 3.5 : $x + 2.5;
                    $contentW = $stampW - $qrSize - 6.0;

                    // QR Code Container Frame
                    $pdf->SetFillColor(248, 250, 252);
                    $pdf->SetDrawColor(226, 232, 240);
                    $pdf->SetLineWidth(0.15);
                    $pdf->Rect($qrX, $qrY, $qrSize, $qrSize, 'DF');

                    // Draw QR Code inside framed container
                    $pdf->Image($qrPath, $qrX + 0.8, $qrY + 0.8, $qrSize - 1.6, $qrSize - 1.6, 'PNG');
                } else {
                    // Full width signature block without QR
                    $contentX = $x + 2.5;
                    $contentW = $stampW - 5.0;
                }

                // Render Name & Title vs Signature
                if ($showName && $namePos !== 'none') {
                    $nameHeight = ($showTitle && $signerItem['title']) ? 7.0 : 4.5;
                    $sigAvailableH = max(8.0, $stampH - $nameHeight - 3.5);

                    if ($isNameTop) {
                        // Name on Top
                        $pdf->SetTextColor(15, 23, 42);
                        $pdf->SetFont('Helvetica', 'B', 7.0);
                        $pdf->SetXY($contentX, $y + 1.8);
                        $pdf->Cell($contentW, 3.2, substr($signerItem['name'], 0, 30), 0, 0, 'L');

                        if ($showTitle && $signerItem['title']) {
                            $pdf->SetFont('Helvetica', '', 5.2);
                            $pdf->SetTextColor(100, 116, 139);
                            $pdf->SetXY($contentX, $y + 5.0);
                            $pdf->Cell($contentW, 2.2, substr($signerItem['title'], 0, 34), 0, 0, 'L');
                        }

                        // Divider line under name
                        $pdf->SetDrawColor(241, 245, 249);
                        $pdf->SetLineWidth(0.15);
                        $lineY = $y + $nameHeight + 1.5;
                        $pdf->Line($contentX, $lineY, $contentX + $contentW, $lineY);

                        // Signature Image below name
                        if ($signerItem['sig_path'] && is_file($signerItem['sig_path'])) {
                            $imgInfo = @getimagesize($signerItem['sig_path']);
                            if ($imgInfo && $imgInfo[0] > 0 && $imgInfo[1] > 0) {
                                $imgW = (float) $imgInfo[0];
                                $imgH = (float) $imgInfo[1];
                                $maxW = $contentW;
                                $maxH = $sigAvailableH;

                                $scale = min($maxW / $imgW, $maxH / $imgH);
                                $targetW = max(3, $imgW * $scale);
                                $targetH = max(3, $imgH * $scale);

                                $sigX = $contentX + ($maxW - $targetW) / 2;
                                $sigY = $lineY + 1.0 + ($maxH - $targetH) / 2;

                                $pdf->Image($signerItem['sig_path'], $sigX, $sigY, $targetW, $targetH, 'PNG');
                            }
                        }
                    } else {
                        // Signature on Top, Name on Bottom
                        $lineY = $y + $stampH - $nameHeight - 1.5;

                        if ($signerItem['sig_path'] && is_file($signerItem['sig_path'])) {
                            $imgInfo = @getimagesize($signerItem['sig_path']);
                            if ($imgInfo && $imgInfo[0] > 0 && $imgInfo[1] > 0) {
                                $imgW = (float) $imgInfo[0];
                                $imgH = (float) $imgInfo[1];
                                $maxW = $contentW;
                                $maxH = $sigAvailableH;

                                $scale = min($maxW / $imgW, $maxH / $imgH);
                                $targetW = max(3, $imgW * $scale);
                                $targetH = max(3, $imgH * $scale);

                                $sigX = $contentX + ($maxW - $targetW) / 2;
                                $sigY = $y + 1.5 + ($maxH - $targetH) / 2;

                                $pdf->Image($signerItem['sig_path'], $sigX, $sigY, $targetW, $targetH, 'PNG');
                            }
                        }

                        // Divider line above name
                        $pdf->SetDrawColor(241, 245, 249);
                        $pdf->SetLineWidth(0.15);
                        $pdf->Line($contentX, $lineY, $contentX + $contentW, $lineY);

                        // Name on Bottom
                        $pdf->SetTextColor(15, 23, 42);
                        $pdf->SetFont('Helvetica', 'B', 7.0);
                        $pdf->SetXY($contentX, $lineY + 1.0);
                        $pdf->Cell($contentW, 3.2, substr($signerItem['name'], 0, 30), 0, 0, 'L');

                        if ($showTitle && $signerItem['title']) {
                            $pdf->SetFont('Helvetica', '', 5.2);
                            $pdf->SetTextColor(100, 116, 139);
                            $pdf->SetXY($contentX, $lineY + 4.2);
                            $pdf->Cell($contentW, 2.2, substr($signerItem['title'], 0, 34), 0, 0, 'L');
                        }
                    }
                } else {
                    // Signature only (No name text) -> Takes full height
                    if ($signerItem['sig_path'] && is_file($signerItem['sig_path'])) {
                        $imgInfo = @getimagesize($signerItem['sig_path']);
                        if ($imgInfo && $imgInfo[0] > 0 && $imgInfo[1] > 0) {
                            $imgW = (float) $imgInfo[0];
                            $imgH = (float) $imgInfo[1];
                            $maxW = $contentW;
                            $maxH = $stampH - 3.0;

                            $scale = min($maxW / $imgW, $maxH / $imgH);
                            $targetW = max(3, $imgW * $scale);
                            $targetH = max(3, $imgH * $scale);

                            $sigX = $contentX + ($maxW - $targetW) / 2;
                            $sigY = $y + ($stampH - $targetH) / 2;

                            $pdf->Image($signerItem['sig_path'], $sigX, $sigY, $targetW, $targetH, 'PNG');
                        }
                    }
                }
            }

        }

        if (empty($signerData)) {
            $pdf->AddPage('P', 'A4');
            $pdf->SetTextColor(20, 20, 20);
            $pdf->SetFont('Helvetica', 'B', 14);
            $pdf->SetXY(20, 28);
            $pdf->Cell(170, 8, 'RPK LAW FIRM - DIGITAL E-SIGN SEAL', 0, 1, 'C');
            $pdf->SetFont('Helvetica', '', 9);
            $pdf->SetXY(20, 50);
            $pdf->MultiCell(130, 6, 'Verification: '.$verificationUrl."\nSource SHA-256: ".$signatureRequest->document_checksum);
            $pdf->Image($qrPath, 155, 45, 32, 32, 'PNG');
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
