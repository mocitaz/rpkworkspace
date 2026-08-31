<?php

namespace App\Console\Commands;

use App\Models\Client;
use App\Models\Correspondence;
use App\Models\Document;
use App\Models\Matter;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Throwable;

class SmokeTestCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rpk:smoke-test {--user=fajarroni@rpklawoffice.com : User email to simulate}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Safely verify all application routes in production without modifying data';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('===========================================================');
        $this->info('  RPK LAW FIRM - PRODUCTION SAFE READ-ONLY SMOKE TEST');
        $this->info('===========================================================');

        $email = (string) $this->option('user');
        $user = User::query()->where('email', $email)->first() ?? User::query()->where('is_active', true)->first();

        if (! $user) {
            $this->error('Tidak ditemukan akun aktif untuk menjalankan simulasi.');

            return self::FAILURE;
        }

        $this->line("👤 Pengguna Simulasi : <fg=cyan>{$user->name}</> ({$user->email})");
        $this->line('🏢 Lingkungan        : <fg=yellow>'.config('app.env').'</>');
        $this->line('🌐 URL Aplikasi      : <fg=blue>'.config('app.url').'</>');
        $this->newLine();

        Auth::setUser($user);

        $client = Client::query()->first();
        $matter = Matter::query()->first();
        $document = Document::query()->first();
        $correspondence = Correspondence::query()->first();

        $routes = [
            ['Dashboard', '/dashboard'],
            ['Klien (Index)', '/clients'],
            ['Klien (Create)', '/clients/create'],
            ['Klien (Detail)', $client ? "/clients/{$client->getKey()}" : null],
            ['Klien (Edit)', $client ? "/clients/{$client->getKey()}/edit" : null],
            ['Perkara (Index)', '/matters'],
            ['Perkara (Create)', '/matters/create'],
            ['Perkara (Detail)', $matter ? "/matters/{$matter->getKey()}" : null],
            ['Dokumen (Index)', '/documents'],
            ['Dokumen (Detail)', $document ? "/documents/{$document->getKey()}" : null],
            ['Tugas & Kanban', '/tasks'],
            ['Buku Kontak', '/contacts'],
            ['Tata Kelola & Legal Hold', '/governance'],
            ['Korespondensi (Detail)', $correspondence ? "/governance/correspondences/{$correspondence->getKey()}" : null],
            ['Keuangan & Ledger', '/finance'],
            ['Kalender & Agenda', '/calendar'],
            ['Chat Internal', '/chat'],
            ['Admin User', '/admin/users'],
            ['Admin Audit Log', '/admin/audit'],
            ['Admin System Readiness', '/admin/system-readiness'],
            ['Pengaturan Profil', '/settings/profile'],
            ['Pengaturan Tampilan', '/settings/appearance'],
            ['Pengaturan Keamanan', '/settings/security'],
            ['Pencarian Universal', '/search?q=RPK'],
        ];

        $tableRows = [];
        $passed = 0;
        $failed = 0;

        $this->output->progressStart(count($routes));

        foreach ($routes as [$name, $path]) {
            if (! $path) {
                $tableRows[] = [$name, '-', '<fg=gray>SKIPPED (No data)</>', '-'];
                $this->output->progressAdvance();

                continue;
            }

            $startTime = microtime(true);
            try {
                $request = Request::create($path, 'GET');
                $request->setUserResolver(fn () => $user);
                $request->headers->set('Accept', 'text/html, application/xhtml+xml');
                $request->setLaravelSession(app('session.store'));
                $request->session()->put('auth.password_confirmed_at', time());

                $response = app()->handle($request);
                $duration = round((microtime(true) - $startTime) * 1000, 1);
                $status = $response->getStatusCode();

                if ($status >= 200 && $status < 400) {
                    $statusFormatted = $status === 200 ? "<fg=green>{$status} OK</>" : "<fg=yellow>{$status} Redirect</>";
                    $tableRows[] = [$name, $path, $statusFormatted, "{$duration} ms"];
                    $passed++;
                } else {
                    $tableRows[] = [$name, $path, "<fg=red>{$status} ERROR</>", "{$duration} ms"];
                    $failed++;
                }
            } catch (Throwable $e) {
                $duration = round((microtime(true) - $startTime) * 1000, 1);
                $tableRows[] = [$name, $path, '<fg=red>500 EXCEPTION</>', "{$duration} ms"];
                $failed++;
            }

            $this->output->progressAdvance();
        }

        $this->output->progressFinish();
        $this->newLine();

        $this->table(['Modul / Halaman', 'URL Path', 'Status Response', 'Latensi'], $tableRows);

        $this->newLine();
        if ($failed === 0) {
            $this->info("✅ SEMUA {$passed} HALAMAN BERJALAN NORMAL DENGAN BAIK TANPA ERROR!");

            return self::SUCCESS;
        }

        $this->error("❌ DITEMUKAN {$failed} HALAMAN DENGAN STATUS ERROR.");

        return self::FAILURE;
    }
}
