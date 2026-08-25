<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class VerifyUserEmailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:verify-email {email? : Email pengguna yang ingin diverifikasi} {--all : Verifikasi semua pengguna yang belum terverifikasi}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Meloloskan verifikasi email pengguna secara manual tanpa perlu mengirim email verifikasi';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if ($this->option('all')) {
            $unverifiedCount = User::query()->whereNull('email_verified_at')->update([
                'email_verified_at' => now(),
                'is_active' => true,
            ]);

            $this->info("Berhasil memverifikasi {$unverifiedCount} pengguna yang sebelumnya belum terverifikasi.");

            return self::SUCCESS;
        }

        $email = $this->argument('email');

        if (! $email) {
            $email = $this->ask('Masukkan alamat email pengguna yang ingin diverifikasi');
        }

        if (! is_string($email) || trim($email) === '') {
            $this->error('Alamat email wajib diisi.');

            return self::FAILURE;
        }

        $user = User::query()->where('email', trim($email))->first();

        if (! $user) {
            $this->error("Pengguna dengan email '{$email}' tidak ditemukan di database.");

            return self::FAILURE;
        }

        if ($user->email_verified_at !== null) {
            $this->info("Pengguna {$user->name} ({$user->email}) sudah berstatus terverifikasi sebelumnya.");

            return self::SUCCESS;
        }

        $user->forceFill([
            'email_verified_at' => now(),
            'is_active' => true,
        ])->save();

        $this->info("✅ Berhasil! Email {$user->email} milik {$user->name} kini telah diverifikasi dan akun aktif.");

        return self::SUCCESS;
    }
}
