<?php

namespace App\Console\Commands;

use App\Models\FinancialAccount;
use Illuminate\Console\Command;

class SyncFinancialAccountBalances extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'finance:sync-balances';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sinkronisasi dan kalkulasi ulang seluruh saldo akun kas, bank, dan talangan partner dari mutasi buku besar';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Memulai sinkronisasi saldo akun keuangan...');

        $accounts = FinancialAccount::query()->get();

        $rows = [];
        foreach ($accounts as $account) {
            $oldBalance = (int) $account->current_balance;
            $newBalance = $account->recalculateBalance();
            $diff = $newBalance - $oldBalance;

            $rows[] = [
                $account->name,
                $account->type,
                'Rp '.number_format($oldBalance, 0, ',', '.'),
                'Rp '.number_format($newBalance, 0, ',', '.'),
                ($diff >= 0 ? '+' : '').'Rp '.number_format($diff, 0, ',', '.'),
            ];
        }

        $this->table(
            ['Nama Akun', 'Tipe', 'Saldo Sebelumnya', 'Saldo Terkoreksi', 'Selisih'],
            $rows
        );

        $this->info('Sinkronisasi selesai! Seluruh saldo akun telah sesuai 100% dengan transaksi buku besar.');

        return self::SUCCESS;
    }
}
