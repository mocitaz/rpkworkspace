<?php

namespace Database\Factories;

use App\Models\Matter;
use App\Models\MatterEvidence;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MatterEvidence>
 */
class MatterEvidenceFactory extends Factory
{
    protected $model = MatterEvidence::class;

    public function definition(): array
    {
        return [
            'matter_id' => Matter::factory(),
            'evidence_code' => 'Bukti P-'.fake()->numberBetween(1, 20),
            'title' => fake()->randomElement([
                'Asli Perjanjian Kerjasama Distribusi Eksklusif',
                'Surat Somasi & Peringatan Terakhir',
                'Bukti Pembayaran & Rekening Koran Bank Mandiri',
                'Berita Acara Serah Terima Barang & Jasa (BAST)',
                'Korespondensi Email & Log Audit Transaksi Elektronik',
                'Laporan Audit Forensik Keuangan Akuntan Publik',
            ]),
            'description' => fake()->sentence(),
            'originality' => fake()->randomElement(['original', 'legalized_copy', 'photocopy', 'digital']),
            'vault_location' => fake()->randomElement([
                'Brankas Litigasi Lemari A-01 / Bantex Merah',
                'Brankas Litigasi Lt. 2 Lemari C-04',
                'Ruang Arsip Khusus Litigasi B-02',
                'Cloud Secure Vault (Enkripsi AES-256)',
            ]),
            'status' => fake()->randomElement(['in_vault', 'borrowed_for_hearing', 'submitted_to_court', 'returned_to_client']),
            'custodian_name' => fake()->name(),
            'custody_notes' => 'Tercatat dalam Berita Acara Penerimaan Bukti Asli di Ruang Penitipan Berkas Perkara RPK.',
            'created_by' => User::factory(),
        ];
    }
}
