<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\ClientComplianceDocument;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ClientComplianceDocument>
 */
class ClientComplianceDocumentFactory extends Factory
{
    protected $model = ClientComplianceDocument::class;

    public function definition(): array
    {
        $types = ['deed_establishment', 'deed_amendment_directors', 'nib', 'kbli_license', 'sk_menkumham', 'amdal_environmental', 'trademark_ip', 'tax_id'];
        $type = fake()->randomElement($types);

        return [
            'client_id' => Client::factory(),
            'document_type' => $type,
            'document_number' => strtoupper(fake()->bothify('DOC-###/??/2026')),
            'title' => fake()->randomElement([
                'Akta Pendirian Perseroan Terbatas & SK Pengesahan Kemenkumham',
                'Akta Perubahan Anggaran Dasar & Susunan Pengurus Terakhir',
                'Nomor Induk Berusaha (NIB) Berbasis Risiko OSS-RBA',
                'Izin Usaha Pertambangan / Industri Operasi Produksi',
                'Sertifikat Hak Guna Bangunan Kawasan Industri',
                'Dokumen Kelayakan Lingkungan Hidup (AMDAL)',
                'Sertifikat Merek & Kekayaan Intelektual (DJKI)',
            ]),
            'issued_at' => now()->subMonths(fake()->numberBetween(6, 36)),
            'expires_at' => fake()->boolean(80) ? now()->addMonths(fake()->numberBetween(6, 60)) : null,
            'issuer' => fake()->randomElement([
                'Kementerian Hukum dan HAM RI',
                'Kementerian Investasi / BKPM RI (OSS)',
                'Kementerian Energi dan Sumber Daya Mineral',
                'Badan Pertanahan Nasional (ATR/BPN)',
                'Notaris & PPAT Kota Bandung',
            ]),
            'notes' => 'Dokumen legalitas kepatuhan telah divalidasi oleh Tim Legal Kepatuhan RPK Law Firm.',
            'file_path' => 'compliance-docs/'.fake()->uuid().'.pdf',
            'created_by' => User::factory(),
        ];
    }
}
