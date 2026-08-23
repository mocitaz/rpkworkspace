<?php

namespace App\Actions;

use App\Models\Document;
use App\Models\DocumentTemplate;
use App\Models\DocumentTemplateGeneration;
use App\Models\Matter;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\TemplateProcessor;
use Symfony\Component\HttpFoundation\File\UploadedFile as SymfonyUploadedFile;

class GenerateDocumentFromTemplate
{
    public function __construct(private CreateDocumentVersion $createDocumentVersion, private AuditService $audit) {}

    /** @param array<string, string> $placeholders */
    public function handle(DocumentTemplate $template, Matter $matter, User $actor, array $placeholders, string $title): Document
    {
        if ($template->status !== 'active') {
            throw new \DomainException('Template dokumen tidak aktif.');
        }

        $temporaryTemplate = tempnam(sys_get_temp_dir(), 'raf-template-');
        $temporaryOutput = tempnam(sys_get_temp_dir(), 'raf-generated-');

        if ($temporaryTemplate === false || $temporaryOutput === false) {
            throw new \RuntimeException('Tidak dapat menyiapkan file sementara untuk template.');
        }

        try {
            file_put_contents($temporaryTemplate, Storage::disk($template->storage_disk)->get($template->storage_path));
            $processor = new TemplateProcessor($temporaryTemplate);
            $processor->setMacroChars('{{', '}}');
            $processor->setValues($placeholders);
            $processor->saveAs($temporaryOutput);

            $filename = Str::slug($title).'.docx';
            $uploadedFile = UploadedFile::createFromBase(new SymfonyUploadedFile(
                $temporaryOutput,
                $filename,
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                null,
                true,
            ));

            $document = DB::transaction(function () use ($template, $matter, $actor, $placeholders, $title, $uploadedFile) {
                $document = Document::query()->create([
                    'matter_id' => $matter->getKey(),
                    'client_id' => $matter->client_id,
                    'title' => $title,
                    'document_type' => $template->document_type,
                    'status' => 'draft',
                    'confidentiality_level' => $matter->confidentiality_level,
                    'created_by' => $actor->getKey(),
                ]);

                $this->createDocumentVersion->handle($document, $uploadedFile, $actor, 'Dihasilkan dari template '.$template->name.'.');

                DocumentTemplateGeneration::query()->create([
                    'document_template_id' => $template->getKey(),
                    'document_id' => $document->getKey(),
                    'matter_id' => $matter->getKey(),
                    'resolved_placeholders' => $placeholders,
                    'generated_by' => $actor->getKey(),
                ]);

                return $document;
            }, 3);

            $this->audit->record($document, 'template.document_generated', [
                'template_id' => $template->getKey(),
                'matter_id' => $matter->getKey(),
            ], $actor);

            return $document->refresh()->load('currentVersion');
        } finally {
            foreach ([$temporaryTemplate, $temporaryOutput] as $temporaryFile) {
                if (is_file($temporaryFile)) {
                    unlink($temporaryFile);
                }
            }
        }
    }
}
