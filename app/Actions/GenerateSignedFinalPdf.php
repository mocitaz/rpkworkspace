<?php

namespace App\Actions;

use App\Models\SignatureRequest;
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

            if ($pdfPath === null) {
                return $this->unavailable($signatureRequest, 'LibreOffice headless belum tersedia untuk mengonversi DOCX ke PDF.');
            }

            $signedPdf = $this->stamp($pdfPath, $signatureRequest);
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
        $qrPath = dirname($sourcePath).'/verification.png';
        $verificationUrl = route('signature.verify', $signatureRequest->verification_code);
        $result = (new PngWriter)->write(new QrCode(data: $verificationUrl, size: 260, margin: 0));
        $result->saveToFile($qrPath);

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

            if ($page === $pageCount) {
                $pdf->SetFillColor(255, 255, 255);
                $pdf->SetDrawColor(30, 30, 30);
                $pdf->Rect(10, max(10, $size['height'] - 29), $size['width'] - 20, 19, 'DF');
                $pdf->SetTextColor(20, 20, 20);
                $pdf->SetFont('Helvetica', 'B', 8);
                $pdf->SetXY(14, $size['height'] - 25);
                $pdf->Cell(0, 4, 'SIGNED FINAL - RAF Workspace');
                $pdf->SetFont('Helvetica', '', 7);
                $pdf->SetXY(14, $size['height'] - 20);
                $pdf->Cell(0, 4, 'Verification: '.$verificationUrl);
                $pdf->SetXY(14, $size['height'] - 15);
                $pdf->Cell(0, 4, 'Checksum: '.$signatureRequest->document_checksum);
                $pdf->Image($qrPath, $size['width'] - 27, $size['height'] - 27, 13, 13, 'PNG');
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
