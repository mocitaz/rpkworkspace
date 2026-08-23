<?php

namespace App\Services;

use Symfony\Component\Process\ExecutableFinder;

class SystemReadiness
{
    /** @return array{ready: bool, checks: array<string, array{status: string, message: string}>} */
    public function report(): array
    {
        $checks = [
            'database' => ['status' => 'ready', 'message' => 'Koneksi database aktif.'],
            'queue' => $this->configured('queue.default', 'Queue connection belum dikonfigurasi.'),
            'private_storage' => $this->configured('raf.documents.disk', 'Private document disk belum dikonfigurasi.'),
            'mail' => $this->configured('mail.default', 'Mail driver belum dikonfigurasi.'),
            'clamav' => $this->binary('raf.documents.scanner.binary', 'ClamAV'),
            'tesseract' => $this->binary('raf.documents.extraction.tesseract_binary', 'Tesseract'),
            'poppler' => $this->binary('raf.documents.extraction.pdftotext_binary', 'Poppler pdftotext'),
            'libreoffice' => $this->binary('raf.signature.libreoffice_binary', 'LibreOffice'),
        ];

        return [
            'ready' => collect($checks)->every(fn (array $check) => $check['status'] === 'ready'),
            'checks' => $checks,
        ];
    }

    /** @return array{status: string, message: string} */
    private function configured(string $key, string $missing): array
    {
        $value = config($key);

        return is_string($value) && $value !== ''
            ? ['status' => 'ready', 'message' => $value]
            : ['status' => 'missing', 'message' => $missing];
    }

    /** @return array{status: string, message: string} */
    private function binary(string $key, string $label): array
    {
        $binary = config($key);
        $found = is_string($binary) && $binary !== ''
            ? (is_executable($binary) ? $binary : (new ExecutableFinder)->find($binary))
            : null;

        return $found !== null
            ? ['status' => 'ready', 'message' => $found]
            : ['status' => 'missing', 'message' => $label.' belum tersedia pada host.'];
    }
}
