<?php

namespace Database\Seeders;

use App\Models\FinancialAccount;
use App\Models\User;
use Illuminate\Database\Seeder;

class FinancialAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accounts = [
            [
                'name' => 'Kas Kantor',
                'type' => 'cash',
                'bank_name' => null,
                'account_number' => null,
                'opening_balance' => 0,
                'current_balance' => 0,
                'description' => 'Kas tunai fisik operasional kantor RPK',
            ],
            [
                'name' => 'Bank Operasional',
                'type' => 'bank',
                'bank_name' => 'Bank Mandiri',
                'account_number' => '131-00-2233445-5',
                'opening_balance' => 2904092,
                'current_balance' => 2904092,
                'description' => 'Rekening utama penerimaan honorarium & belanja operasional firma',
            ],
            [
                'name' => 'Bank Dana Klien',
                'type' => 'client_trust',
                'bank_name' => 'Bank BCA',
                'account_number' => '772-0011-223',
                'opening_balance' => 0,
                'current_balance' => 0,
                'description' => 'Rekening terisolasi khusus penampungan panjar biaya perkara & dana titipan klien',
            ],
        ];

        foreach ($accounts as $acc) {
            FinancialAccount::query()->firstOrCreate(
                ['name' => $acc['name']],
                $acc
            );
        }

        // Partner Advance Accounts
        $fajar = User::query()->where('email', 'fajarroni@rpklawoffice.com')->orWhere('name', 'like', '%Fajar%')->first();
        if ($fajar) {
            FinancialAccount::query()->firstOrCreate(
                ['name' => 'Kas Talangan Fajar Roni'],
                [
                    'type' => 'partner_advance',
                    'partner_id' => $fajar->getKey(),
                    'opening_balance' => 1000000,
                    'current_balance' => 1000000,
                    'description' => 'Rekening talangan dana pribadi Muhamad Fajar Roni, S.H.',
                ]
            );
        }

        $anggara = User::query()->where('email', 'anggaraputra@rpklawoffice.com')->orWhere('name', 'like', '%Anggara%')->first();
        if ($anggara) {
            FinancialAccount::query()->firstOrCreate(
                ['name' => 'Kas Talangan Anggara Putra'],
                [
                    'type' => 'partner_advance',
                    'partner_id' => $anggara->getKey(),
                    'opening_balance' => 0,
                    'current_balance' => 0,
                    'description' => 'Rekening talangan dana pribadi M. Anggara Putra, S.H., M.H.',
                ]
            );
        }

        $reza = User::query()->where('email', 'rezakusumah@rpklawoffice.com')->orWhere('name', 'like', '%Reza%')->first();
        if ($reza) {
            FinancialAccount::query()->firstOrCreate(
                ['name' => 'Kas Talangan Reza Evaldo Kusumah'],
                [
                    'type' => 'partner_advance',
                    'partner_id' => $reza->getKey(),
                    'opening_balance' => 0,
                    'current_balance' => 0,
                    'description' => 'Rekening talangan dana pribadi Reza Evaldo Kusumah, S.H.',
                ]
            );
        }
    }
}
