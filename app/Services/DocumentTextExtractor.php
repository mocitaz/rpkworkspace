<?php

namespace App\Services;

use Illuminate\Support\Str;
use Symfony\Component\Process\ExecutableFinder;
use Symfony\Component\Process\Process;
use ZipArchive;

class DocumentTextExtractor
{
    /**
     * @return array{status: string, text: string|null, metadata: array<string, mixed>}
     */
    public function extract(string $path, string $mimeType, string $originalFilename): array
    {
        $extension = Str::lower(pathinfo($originalFilename, PATHINFO_EXTENSION));

        if ($mimeType === 'text/plain' || $extension === 'txt') {
            return $this->completed($this->readTextFile($path), 'native-text');
        }

        if ($extension === 'docx') {
            return $this->completed($this->extractDocx($path), 'docx-xml');
        }

        if ($mimeType === 'application/pdf' || $extension === 'pdf') {
            return $this->extractWithCommand('pdftotext', [$path, '-'], 'poppler');
        }

        if (str_starts_with($mimeType, 'image/') || in_array($extension, ['jpg', 'jpeg', 'png'], true)) {
            return $this->extractWithCommand(
                'tesseract',
                [$path, 'stdout', '-l', (string) config('raf.documents.extraction.ocr_languages', 'ind+eng')],
                'tesseract',
            );
        }

        return [
            'status' => 'unsupported',
            'text' => null,
            'metadata' => ['extractor' => null, 'reason' => 'format-not-supported'],
        ];
    }

    private function readTextFile(string $path): string
    {
        $contents = file_get_contents($path);

        return $contents === false ? '' : $contents;
    }

    private function extractDocx(string $path): string
    {
        $archive = new ZipArchive;

        if ($archive->open($path) !== true) {
            return '';
        }

        $xml = $archive->getFromName('word/document.xml');
        $archive->close();

        if (! is_string($xml)) {
            return '';
        }

        $xml = str_replace(['</w:p>', '</w:tr>', '<w:tab/>'], ["\n", "\n", "\t"], $xml);

        return html_entity_decode(strip_tags($xml), ENT_QUOTES | ENT_XML1, 'UTF-8');
    }

    /**
     * @param  list<string>  $arguments
     * @return array{status: string, text: string|null, metadata: array<string, mixed>}
     */
    private function extractWithCommand(string $configurationKey, array $arguments, string $extractor): array
    {
        $configuredBinary = config("raf.documents.extraction.{$configurationKey}_binary", $configurationKey);

        if (! is_string($configuredBinary) || $configuredBinary === '') {
            return $this->unavailable($extractor);
        }

        $binary = (new ExecutableFinder)->find($configuredBinary);

        if ($binary === null) {
            return $this->unavailable($extractor);
        }

        $process = new Process([$binary, ...$arguments]);
        $process->setTimeout((int) config('raf.documents.extraction.timeout', 180));
        $process->run();

        if (! $process->isSuccessful()) {
            return [
                'status' => 'failed',
                'text' => null,
                'metadata' => ['extractor' => $extractor, 'reason' => 'process-failed'],
            ];
        }

        return $this->completed($process->getOutput(), $extractor);
    }

    /** @return array{status: string, text: string|null, metadata: array<string, mixed>} */
    private function completed(string $text, string $extractor): array
    {
        $normalized = Str::of($text)->replace("\0", '')->squish()->limit(
            (int) config('raf.documents.extraction.max_characters', 500000),
            '',
        )->toString();

        return [
            'status' => $normalized === '' ? 'empty' : 'completed',
            'text' => $normalized === '' ? null : $normalized,
            'metadata' => ['extractor' => $extractor, 'characters' => mb_strlen($normalized)],
        ];
    }

    /** @return array{status: string, text: null, metadata: array<string, mixed>} */
    private function unavailable(string $extractor): array
    {
        return [
            'status' => 'unavailable',
            'text' => null,
            'metadata' => ['extractor' => $extractor, 'reason' => 'binary-unavailable'],
        ];
    }
}
