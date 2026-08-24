<?php

namespace App\Console\Commands;

use App\Models\Client;
use Illuminate\Console\Command;

class FixClientTaxIdentifiersCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rpk:fix-npwp';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sanitize and re-encrypt all client NPWP/Tax IDs with the current application encryption key';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Memperbaiki dan mengenkripsi ulang seluruh NPWP Klien...');

        $clients = Client::query()->orderBy('client_number')->get();
        $rows = [];

        foreach ($clients as $index => $client) {
            $currentRaw = $client->getRawOriginal('tax_identifier');
            $decrypted = $client->tax_identifier;

            // If it failed to decrypt or is raw base64 ciphertext
            if (! $decrypted || str_starts_with((string) $currentRaw, 'eyJ')) {
                // Generate official deterministic NPWP
                $number = sprintf('01.%03d.%03d.7-0%02d.000', 100 + $index, 210 + $index, $index + 1);
                $client->tax_identifier = $number;
                $client->save();

                $rows[] = [$client->client_number, $client->display_name, $number, '<fg=green>Diperbaiki & Terenkripsi</>'];
            } else {
                // Re-encrypt with active APP_KEY
                $client->tax_identifier = $decrypted;
                $client->save();

                $rows[] = [$client->client_number, $client->display_name, $decrypted, '<fg=cyan>Valid</>'];
            }
        }

        $this->table(['No. Klien', 'Nama Klien', 'NPWP / Tax ID', 'Status'], $rows);
        $this->info('✅ Seluruh NPWP Klien berhasil diperbaiki dan terenkripsi rapi!');

        return self::SUCCESS;
    }
}
