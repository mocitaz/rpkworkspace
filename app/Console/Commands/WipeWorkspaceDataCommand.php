<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class WipeWorkspaceDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'workspace:wipe-data 
                            {--force : Lewati konfirmasi interaktif} 
                            {--clean-storage : Hapus juga berkas dokumen/lampiran yang tersimpan di storage}
                            {--preserve-clients= : Kode/nomor atau nama klien yang dikecualikan (default otomatis melindungi RPK-C-2026-YNGZAW / PT KKG)}
                            {--wipe-all-clients : Paksa hapus seluruh klien tanpa pengecualian}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mengosongkan seluruh data operasional dan seeder (perkara, dokumen, keuangan, dummy clients), KECUALI data Staff, Akun, Role, Hak Akses (Auth), dan Klien Nyata Tim (PT KKG)';

    /**
     * Tables that MUST NEVER be wiped (Auth & Staff integrity).
     *
     * @var list<string>
     */
    protected array $preservedTables = [
        'users',
        'roles',
        'permissions',
        'role_user',
        'permission_role',
        'passkeys',
        'password_reset_tokens',
        'sessions',
        'migrations',
        'practice_areas',
    ];

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->warn('================================================================');
        $this->warn('  PEMBERSIHAN DATA SEEDER & OPERASIONAL RPK WORKSPACE           ');
        $this->warn('================================================================');
        $this->line('Perintah ini akan MENGOSONGKAN data hasil seeder:');
        $this->line(' - Data Klien & Kontak dummy seeder');
        $this->line(' - Seluruh Perkara (Matters), Kronologi, Bukti, & Pihak');
        $this->line(' - Seluruh Dokumen, Versi, & Permintaan E-Sign');
        $this->line(' - Seluruh Tugas, Agenda Kalender, & Tenggat Waktu (Deadlines)');
        $this->line(' - Seluruh Data Keuangan (Invoice, Pembayaran, Pengeluaran, Trust)');
        $this->line(' - Riwayat Percakapan, Komentar, Korespondensi, & Conflict Checks');
        $this->newLine();
        $this->info('DATA YANG TETAP AMAN & DIPERTAHANKAN:');
        $this->info(' ✓ Seluruh Akun Staf / Pengguna (Tabel users)');
        $this->info(' ✓ Seluruh Role & Hak Akses Kewenangan (Tabel roles & permissions)');
        $this->info(' ✓ Relasi Role Pengguna (role_user & permission_role)');
        $this->info(' ✓ Passkey, Token Login, & Bidang Praktik (practice_areas)');

        $preservedClientIds = [];
        $preservedMatterIds = [];

        if (! $this->option('wipe-all-clients') && Schema::hasTable('clients')) {
            $customQuery = $this->option('preserve-clients');

            $preservedClients = DB::table('clients')
                ->where(function ($query) use ($customQuery) {
                    $query->where('client_number', 'like', '%YNGZAW%')
                        ->orWhere('legal_name', 'like', '%KEMBANG KEMBAR%')
                        ->orWhere('display_name', 'like', '%KKG%');

                    if ($customQuery) {
                        $query->orWhere('client_number', 'like', "%{$customQuery}%")
                            ->orWhere('legal_name', 'like', "%{$customQuery}%")
                            ->orWhere('display_name', 'like', "%{$customQuery}%");
                    }
                })
                ->get();

            if ($preservedClients->isNotEmpty()) {
                $preservedClientIds = $preservedClients->pluck('id')->all();
                $this->newLine();
                $this->info(' ✓ Klien Nyata yang Dikecualikan & Dipertahankan:');
                foreach ($preservedClients as $c) {
                    $this->line("   - [{$c->client_number}] {$c->legal_name} ({$c->display_name})");
                }

                if (Schema::hasTable('matters')) {
                    $preservedMatterIds = DB::table('matters')
                        ->whereIn('client_id', $preservedClientIds)
                        ->pluck('id')
                        ->all();
                }
            }
        }

        $this->newLine();

        if (! $this->option('force') && ! $this->confirm('Apakah Anda YAKIN ingin membersihkan data seeder di atas?')) {
            $this->info('Operasi dibatalkan.');

            return self::SUCCESS;
        }

        $this->info('Memulai proses pembersihan data seeder...');

        $driver = DB::getDriverName();

        // 1. Disable Foreign Key Checks
        if ($driver === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        } elseif ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF;');
        }

        // 2. Clear Tables with Preserved Client / Matter Filters
        $tablesToWipe = [
            // Collaboration & Chat
            'comment_reactions',
            'comments',
            'direct_message_reactions',
            'direct_messages',

            // Finance
            'payment_allocations',
            'payments',
            'invoice_line_items',
            'invoices',
            'quote_line_items',
            'quotations',
            'expenses',

            // Signatures & Approvals
            'signature_signers',
            'signature_requests',
            'document_approvals',
            'document_template_generations',
            'document_templates',

            // Correspondences & Conflict Checks
            'correspondence_document',
            'correspondences',
            'conflict_checks',

            // Matter Details
            'matter_chronologies',
            'matter_evidences',
            'notes',
            'matter_events',
            'matter_members',
            'matter_parties',
            'deadline_reminder_deliveries',
            'deadlines',
            'matter_exports',
            'tasks',

            // Documents
            'document_versions',
            'documents',
            'document_number_sequences',

            // Matters
            'matters',
            'matter_number_sequences',

            // Clients, Contacts & Compliance
            'client_compliance_documents',
            'contacts',
            'clients',

            // Audit & Notifications
            'audit_logs',
            'notifications',

            // Background Jobs
            'failed_jobs',
            'job_batches',
            'jobs',
        ];

        $wipedCount = 0;
        foreach ($tablesToWipe as $table) {
            if (! Schema::hasTable($table)) {
                continue;
            }

            // Client & Matter aware deletion
            if ($table === 'clients' && ! empty($preservedClientIds)) {
                $deleted = DB::table('clients')->whereNotIn('id', $preservedClientIds)->delete();
                $this->line(" [✓] Dihapus klien dummy: {$deleted} data (Klien PT KKG dipertahankan)");
            } elseif ($table === 'contacts' && ! empty($preservedClientIds)) {
                $deleted = DB::table('contacts')->whereNotIn('client_id', $preservedClientIds)->delete();
                $this->line(" [✓] Dihapus kontak dummy: {$deleted} data");
            } elseif ($table === 'client_compliance_documents' && ! empty($preservedClientIds)) {
                $deleted = DB::table('client_compliance_documents')->whereNotIn('client_id', $preservedClientIds)->delete();
                $this->line(" [✓] Dihapus dokumen kepatuhan dummy: {$deleted} data");
            } elseif ($table === 'matters' && ! empty($preservedMatterIds)) {
                $deleted = DB::table('matters')->whereNotIn('id', $preservedMatterIds)->delete();
                $this->line(" [✓] Dihapus perkara dummy: {$deleted} data");
            } elseif (in_array($table, ['matter_chronologies', 'matter_evidences', 'matter_events', 'matter_members', 'matter_parties', 'deadlines', 'tasks', 'documents'], true) && ! empty($preservedMatterIds)) {
                if (Schema::hasColumn($table, 'matter_id')) {
                    DB::table($table)->whereNotIn('matter_id', $preservedMatterIds)->delete();
                } else {
                    DB::table($table)->delete();
                }
                $this->line(" [✓] Dikosongkan: {$table}");
            } else {
                DB::table($table)->delete();
                $this->line(" [✓] Dikosongkan: {$table}");
            }

            $wipedCount++;
        }

        // 3. Re-enable Foreign Key Checks
        if ($driver === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        } elseif ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = ON;');
        }

        // 4. Clean physical storage if requested
        if ($this->option('clean-storage')) {
            $this->info('Membersihkan berkas penyimpanan fisik storage...');
            $directoriesToClean = [
                'documents',
                'signatures',
                'compliance',
                'evidences',
                'exports',
            ];
            foreach ($directoriesToClean as $dir) {
                try {
                    if (Storage::disk('public')->exists($dir)) {
                        Storage::disk('public')->deleteDirectory($dir);
                        Storage::disk('public')->makeDirectory($dir);
                    }
                } catch (\Throwable $e) {
                    $this->warn(" [!] Dilewati pembersihan public storage disk ({$dir}): ".$e->getMessage());
                }

                try {
                    if (Storage::disk('local')->exists($dir)) {
                        Storage::disk('local')->deleteDirectory($dir);
                        Storage::disk('local')->makeDirectory($dir);
                    }
                } catch (\Throwable $e) {
                    // Ignore permission warnings on private storage
                }
            }
            $this->line(' [✓] Direktori berkas storage dibersihkan.');
        }

        $this->newLine();
        $this->info("BERHASIL! {$wipedCount} tabel operasional telah dibersihkan.");
        if (! empty($preservedClientIds)) {
            $this->info('Klien tim (PT KEMBANG KEMBAR GRUP - RPK-C-2026-YNGZAW) tetap tersimpan dengan aman.');
        }
        $this->info('Seluruh akun staf dan hak akses auth tetap utuh dan siap digunakan.');

        return self::SUCCESS;
    }
}
