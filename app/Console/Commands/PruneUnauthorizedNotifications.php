<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\NotificationAccess;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Notifications\DatabaseNotification;

#[Signature('raf:prune-unauthorized-notifications {--execute : Permanently delete unauthorized historical notifications}')]
#[Description('Find or delete notifications whose recipients no longer have access')]
class PruneUnauthorizedNotifications extends Command
{
    public function handle(NotificationAccess $notificationAccess): int
    {
        $unauthorizedIds = [];

        DatabaseNotification::query()
            ->where('notifiable_type', User::class)
            ->with('notifiable')
            ->orderBy('created_at')
            ->chunkById(500, function ($notifications) use (&$unauthorizedIds, $notificationAccess): void {
                foreach ($notifications as $notification) {
                    $user = $notification->notifiable;

                    if (! $user instanceof User || ! $notificationAccess->allowsDatabaseNotification($user, $notification)) {
                        $unauthorizedIds[] = $notification->getKey();
                    }
                }
            }, 'id');

        if (! $this->option('execute')) {
            $this->warn(count($unauthorizedIds).' notifikasi tidak berizin ditemukan. Tidak ada data yang dihapus.');
            $this->line('Jalankan kembali dengan --execute untuk menghapusnya.');

            return self::SUCCESS;
        }

        DatabaseNotification::query()->whereKey($unauthorizedIds)->delete();
        $this->info(count($unauthorizedIds).' notifikasi tidak berizin berhasil dihapus.');

        return self::SUCCESS;
    }
}
