<?php

namespace Database\Factories;

use App\Models\Document;
use App\Models\DocumentApproval;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DocumentApproval>
 */
class DocumentApprovalFactory extends Factory
{
    protected $model = DocumentApproval::class;

    public function definition(): array
    {
        return [
            'document_id' => Document::factory(),
            'requested_by' => User::factory(),
            'reviewer_id' => User::factory(),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected']),
            'request_note' => 'Mohon review dan persetujuan Partner sebelum dokumen difinalisasi.',
            'resolution_note' => 'Disetujui untuk diteruskan ke tahap penandatanganan.',
            'resolved_at' => now(),
        ];
    }
}
