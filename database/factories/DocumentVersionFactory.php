<?php

namespace Database\Factories;

use App\Models\Document;
use App\Models\DocumentVersion;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<DocumentVersion>
 */
class DocumentVersionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'document_id' => Document::factory(),
            'version_number' => 1,
            'original_filename' => 'dokumen.pdf',
            'storage_disk' => 'local',
            'storage_path' => 'documents/testing/'.Str::ulid(),
            'mime_type' => 'application/pdf',
            'file_size' => 1024,
            'checksum' => hash('sha256', fake()->uuid()),
            'scan_status' => 'clean',
            'scan_message' => 'Tidak ada malware yang terdeteksi.',
            'scanned_at' => now(),
            'extraction_status' => 'completed',
            'extracted_text' => fake()->paragraph(),
            'extracted_at' => now(),
            'uploaded_by' => User::factory(),
        ];
    }
}
