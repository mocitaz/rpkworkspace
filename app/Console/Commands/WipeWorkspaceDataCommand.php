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
    protected $signature = 'workspace:wipe-data {--force : Lewati konfirmasi interaktif} {--clean-storage : Hapus juga berkas dokumen/lampiran yang tersimpan di storage}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mengosongkan seluruh data operasional, perkara, klien, dokumen, dan keuangan, KECUALI data Staff, Akun, Role, dan Hak Akses (Auth)';

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
        $this->warn('  PERINGATAN: PEMBERSIHAN DATA OPERASIONAL RPK LAW FIRM         ');
        $this->warn('================================================================');
        $this->line('Perintah ini akan MENGOSONGKAN SELURUH data operasional:');
        $this->line(' - Data Klien & Kontak');
        $this->line(' - Seluruh Perkara (Matters), Kronologi, Bukti, & Pihak');
        $this->line(' - Seluruh Dokumen, Versi, & Template');
        $this->line(' - Seluruh Permintaan Tanda Tangan Elektronik (E-Sign) & Approval');
        $this->line(' - Seluruh Tugas, Agenda Kalender, & Tenggat Waktu (Deadlines)');
        $this->line(' - Seluruh Data Keuangan (Invoice, Pembayaran, Pengeluaran, Trust)');
        $this->line(' - Diskusi Internal, Komentar, Direct Messages, & Audit Log');
        $this->newLine();
        $this->info('DATA YANG TETAP AMAN & DIPERTAHANKAN:');
        $this->info(' ✓ Seluruh Akun Staf / Pengguna (Tabel users)');
        $this->info(' ✓ Seluruh Role & Hak Akses Kewenangan (Tabel roles & permissions)');
        $this->info(' ✓ Relasi Role Pengguna (role_user & permission_role)');
        $this->info(' ✓ Passkey & Kredensial Login');
        $this->newLine();

        if (! $this->option('force') && ! $this->confirm('Apakah Anda YAKIN ingin mengosongkan seluruh data operasional di atas?')) {
            $this->info('Operasi dibatalkan.');

            return self::SUCCESS;
        }

        $this->info('Memulai pengosongan data operasional...');

        $driver = DB::getDriverName();

        // 1. Disable Foreign Key Checks
        if ($driver === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        } elseif ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF;');
        }

        $tablesToWipe = [
            // Collaboration & Chat
            'comments',
            'reactions',
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
            'matter_notes',
            'matter_time_entries',
            'matter_disbursements',
            'matter_trust_transactions',
            'matter_events',
            'matter_members',
            'matter_parties',
            'deadline_reminder_deliveries',
            'matter_deadlines',
            'matter_exports',
            'tasks',

            // Documents
            'document_versions',
            'documents',
            'document_number_sequences',

            // Matters
            'matters',
            'matter_number_sequences',

            // Clients & Compliance
            'client_compliance_documents',
            'client_contacts',
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
            if (Schema::hasTable($table)) {
                DB::table($table)->delete();
                $this->line(" [✓] Dikosongkan: {$table}");
                $wipedCount++;
            }
        }

        // 2. Re-enable Foreign Key Checks
        if ($driver === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        } elseif ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = ON;');
        }

        // 3. Clean physical storage if requested
        if ($this->option('clean-storage')) {
            $this->info('Membersihkan berkas penyimpanan fisik...');
            $directoriesToClean = [
                'documents',
                'signatures',
                'compliance',
                'evidences',
                'exports',
            ];
            foreach ($directoriesToClean as $dir) {
                if (Storage::disk('public')->exists($dir)) {
                    Storage::disk('public')->deleteDirectory($dir);
                    Storage::disk('public')->makeDirectory($dir);
                }
                if (Storage::disk('local')->exists($dir)) {
                    Storage::disk('local')->deleteDirectory($dir);
                    Storage::disk('local')->makeDirectory($dir);
                }
            }
            $this->line(' [✓] Direktori berkas storage dibersihkan.');
        }

        $this->newLine();
        $this->info("BERHASIL! {$wipedCount} tabel operasional telah dikosongkan.");
        $this->info('Seluruh akun staf dan hak akses auth tetap utuh dan siap digunakan.');

        return self::SUCCESS;
    }
}
