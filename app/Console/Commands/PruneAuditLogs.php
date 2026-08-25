<?php

namespace App\Console\Commands;

use App\Models\AuditLog;
use Illuminate\Console\Command;

class PruneAuditLogs extends Command
{
    protected $signature = 'raf:prune-audit-logs {--days=90 : Durasi retensi dalam hari (default: 90)}';

    protected $description = 'Bersihkan log audit yang lebih lama dari durasi retensi yang ditentukan.';

    public function handle(): int
    {
        $days = (int) $this->option('days');
        if ($days <= 0) {
            $this->error('Durasi retensi hari harus berupa angka bulat positif.');

            return self::FAILURE;
        }

        $cutoff = now()->subDays($days);
        $count = AuditLog::query()->where('created_at', '<', $cutoff)->delete();

        $this->info("Berhasil membersihkan {$count} rekaman log audit yang lebih lama dari {$days} hari.");

        return self::SUCCESS;
    }
}
