<?php

namespace Database\Factories;

use App\Models\Matter;
use App\Models\MatterChronology;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MatterChronology>
 */
class MatterChronologyFactory extends Factory
{
    protected $model = MatterChronology::class;

    public function definition(): array
    {
        return [
            'matter_id' => Matter::factory(),
            'event_date' => fake()->dateTimeBetween('-2 years', 'now')->format('Y-m-d'),
            'title' => fake()->randomElement([
                'Penandatanganan Perjanjian Kerjasama',
                'Penerbitan Surat Peringatan / Somasi I',
                'Rapat Negosiasi & Konsiliasi Para Pihak',
                'Pendaftaran Permohonan Gugatan di Pengadilan',
                'Sidang Mediasi Pertama di Hadapan Hakim Mediator',
                'Penyerahan Memori Jawaban & Eksepsi',
            ]),
            'description' => fake()->paragraph(),
            'evidence_reference' => 'Bukti P-'.fake()->numberBetween(1, 10),
            'witness_name' => fake()->name(),
            'importance_level' => fake()->randomElement(['normal', 'high', 'critical']),
            'created_by' => User::factory(),
        ];
    }
}
