<?php

namespace Database\Factories;

use App\Models\Document;
use App\Models\DocumentTemplate;
use App\Models\DocumentTemplateGeneration;
use App\Models\Matter;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DocumentTemplateGeneration>
 */
class DocumentTemplateGenerationFactory extends Factory
{
    protected $model = DocumentTemplateGeneration::class;

    public function definition(): array
    {
        return [
            'document_template_id' => DocumentTemplate::factory(),
            'document_id' => Document::factory(),
            'matter_id' => Matter::factory(),
            'resolved_placeholders' => [
                'CLIENT_NAME' => fake()->company(),
                'MATTER_NUMBER' => 'RPK-2026-'.fake()->numerify('####'),
                'DATE' => now()->format('d F Y'),
            ],
            'generated_by' => User::factory(),
        ];
    }
}
