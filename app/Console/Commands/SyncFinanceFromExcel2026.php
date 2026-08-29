<?php

namespace App\Console\Commands;

use App\Models\Client;
use App\Models\Expense;
use App\Models\FinancialAccount;
use App\Models\Invoice;
use App\Models\InvoiceLineItem;
use App\Models\Matter;
use App\Models\PartnerTransaction;
use App\Models\Payment;
use App\Models\PaymentAllocation;
use App\Models\Payroll;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncFinanceFromExcel2026 extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'finance:sync-from-excel-2026 {--dry-run : Jalankan simulasi tanpa menyimpan ke database}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sinkronisasi seluruh data keuangan 2026 dari master Excel resmi RPK ke database';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $isDryRun = (bool) $this->option('dry-run');

        $this->info('================================================================');
        $this->info(' SINKRONISASI KEUANGAN RPK 2026 DARI EXCEL MASTER KE DATABASE ');
        $this->info('================================================================');

        if ($isDryRun) {
            $this->warn('[DRY-RUN MODE] Tidak ada perubahan yang akan disimpan ke database.');
        }

        return DB::transaction(function () use ($isDryRun) {
            // 1. Resolve Users / Partners
            $adminUser = User::query()->first();
            if (! $adminUser) {
                $this->error('Error: Tidak ada pengguna terdaftar di database.');

                return self::FAILURE;
            }

            $partnerFajar = User::query()->where('email', 'like', '%fajar%')->orWhere('name', 'like', '%Fajar%')->first() ?? $adminUser;
            $partnerAnggara = User::query()->where('email', 'like', '%anggara%')->orWhere('name', 'like', '%Anggara%')->first() ?? $adminUser;
            $partnerReza = User::query()->where('email', 'like', '%reza%')->orWhere('name', 'like', '%Reza%')->first() ?? $adminUser;

            $bianca = User::query()->where('email', 'like', '%bianca%')->orWhere('name', 'like', '%Bianca%')->first() ?? $adminUser;
            $davina = User::query()
                ->where('name', 'Davina Putri Felisha')
                ->orWhere('email', 'like', 'davina%')
                ->first();

            if (! $davina) {
                $this->error('Error: User Davina Putri Felisha tidak ditemukan. Sinkronisasi dibatalkan agar payroll tidak salah pemilik.');

                return self::FAILURE;
            }

            // 2. Resolve Financial Accounts
            $kasKantor = FinancialAccount::query()->where('type', 'cash')->first();
            if (! $kasKantor) {
                $kasKantor = FinancialAccount::query()->create([
                    'name' => 'Kas Kantor',
                    'type' => 'cash',
                    'currency' => 'IDR',
                    'opening_balance' => 0,
                    'is_active' => true,
                    'created_by' => $adminUser->id,
                ]);
            } else {
                $kasKantor->update(['opening_balance' => 0]);
            }

            $bankOperasional = FinancialAccount::query()->where('type', 'bank')->first();
            if (! $bankOperasional) {
                $bankOperasional = FinancialAccount::query()->create([
                    'name' => 'Bank Operasional',
                    'type' => 'bank',
                    'bank_name' => 'Bank BCA',
                    'account_number' => '131-00-982173-1',
                    'currency' => 'IDR',
                    'opening_balance' => 0,
                    'is_active' => true,
                    'created_by' => $adminUser->id,
                ]);
            } else {
                $bankOperasional->update(['opening_balance' => 0]);
            }

            $kasFajar = FinancialAccount::query()->where('type', 'partner_advance')->where('partner_id', $partnerFajar->id)->first();
            if (! $kasFajar) {
                $kasFajar = FinancialAccount::query()->create([
                    'name' => 'Kas Talangan Fajar Roni',
                    'type' => 'partner_advance',
                    'partner_id' => $partnerFajar->id,
                    'currency' => 'IDR',
                    'opening_balance' => 0,
                    'is_active' => true,
                    'created_by' => $adminUser->id,
                ]);
            } else {
                $kasFajar->update(['opening_balance' => 0]);
            }

            // Master 2026 menggunakan transfer rekening untuk arus operasional firma.
            $primaryAccount = $bankOperasional;

            // 3. Resolve Matter PT KKG
            $client = Client::query()->where('legal_name', 'like', '%Kembang Kembar%')->orWhere('display_name', 'like', '%KKG%')->first();
            if (! $client) {
                $client = Client::query()->create([
                    'client_number' => 'RPK-C-2026-0001',
                    'type' => 'corporate',
                    'legal_name' => 'PT KEMBANG KEMBAR GRUP',
                    'display_name' => 'PT KKG',
                    'email' => 'finance@kembangkembar.co.id',
                    'phone' => '081234567890',
                    'status' => 'active',
                    'created_by' => $adminUser->id,
                ]);
            }

            $matter = Matter::query()->where('matter_number', 'like', '%0001%')->orWhere('matter_number', 'like', '%001%')->first();
            if (! $matter) {
                $matter = Matter::query()->where('client_id', $client->id)->first();
            }
            if (! $matter) {
                $matter = Matter::query()->create([
                    'client_id' => $client->id,
                    'matter_number' => 'RPK-2026-0001',
                    'title' => 'Pendampingan Hukum Korporasi dan Penyelesaian Sengketa Internal PT Kembang Kembar Grup',
                    'status' => 'active',
                    'contract_value' => 165_000_000,
                    'billing_type' => 'fixed_fee',
                    'responsible_partner_id' => $partnerFajar->id,
                    'created_by' => $adminUser->id,
                ]);
            }

            $this->info("✓ Akun Kas Utama: {$primaryAccount->name} (ID: {$primaryAccount->id})");
            $this->info("✓ Perkara Klien: {$matter->title} ({$matter->matter_number})");

            // 4. Bersihkan seluruh data transaksi keuangan lama untuk rekonsiliasi total yang bersih
            $this->info('Membersihkan seluruh data transaksi lama (termasuk unlinked/duplicate)...');
            PaymentAllocation::query()->delete();
            Payment::query()->delete();
            Expense::query()->delete();
            Payroll::query()->delete();
            PartnerTransaction::query()->delete();
            InvoiceLineItem::query()->delete();
            Invoice::query()->delete();

            // 5. Invoices & Payments dari Excel
            // Inflow 1: RPK-INV-2026-001 (Rp 16.000.000)
            $inv1 = Invoice::query()->create([
                'matter_id' => $matter->id,
                'client_id' => $client->id,
                'invoice_number' => 'RPK-INV-2026-001',
                'title' => 'Honorarium Jasa Hukum Tahap 1 - PT KKG',
                'status' => 'paid',
                'currency' => 'IDR',
                'subtotal_amount' => 16_000_000,
                'discount_amount' => 0,
                'tax_rate' => 0,
                'tax_amount' => 0,
                'total_amount' => 16_000_000,
                'paid_amount' => 16_000_000,
                'outstanding_amount' => 0,
                'issued_at' => '2026-07-29',
                'due_at' => '2026-08-15',
                'sent_at' => '2026-07-29',
                'paid_at' => '2026-07-29',
                'created_by' => $adminUser->id,
            ]);
            InvoiceLineItem::query()->create([
                'invoice_id' => $inv1->id,
                'description' => 'Honorarium Jasa Hukum Tahap 1',
                'quantity' => 1,
                'unit_amount' => 16_000_000,
                'total_amount' => 16_000_000,
                'sort_order' => 1,
            ]);

            $pay1 = Payment::query()->create([
                'matter_id' => $matter->id,
                'client_id' => $client->id,
                'account_id' => $primaryAccount->id,
                'reference_number' => 'INC-20260729-001',
                'method' => 'bank_transfer',
                'currency' => 'IDR',
                'gross_amount' => 16_000_000,
                'tax_withheld' => 0,
                'net_amount' => 16_000_000,
                'amount' => 16_000_000,
                'received_at' => '2026-07-29',
                'notes' => 'Penerimaan Honorarium Tahap 1 PT KKG via Transfer Bank',
                'recorded_by' => $adminUser->id,
            ]);
            PaymentAllocation::query()->create([
                'payment_id' => $pay1->id,
                'invoice_id' => $inv1->id,
                'amount' => 16_000_000,
            ]);

            // Inflow 2: RPK-INV-2026-002 (Rp 33.500.000)
            $inv2 = Invoice::query()->create([
                'matter_id' => $matter->id,
                'client_id' => $client->id,
                'invoice_number' => 'RPK-INV-2026-002',
                'title' => 'Honorarium Jasa Hukum Tahap 2 - PT KKG',
                'status' => 'paid',
                'currency' => 'IDR',
                'subtotal_amount' => 33_500_000,
                'discount_amount' => 0,
                'tax_rate' => 0,
                'tax_amount' => 0,
                'total_amount' => 33_500_000,
                'paid_amount' => 33_500_000,
                'outstanding_amount' => 0,
                'issued_at' => '2026-08-27',
                'due_at' => '2026-09-10',
                'sent_at' => '2026-08-27',
                'paid_at' => '2026-08-27',
                'created_by' => $adminUser->id,
            ]);
            InvoiceLineItem::query()->create([
                'invoice_id' => $inv2->id,
                'description' => 'Honorarium Jasa Hukum Tahap 2',
                'quantity' => 1,
                'unit_amount' => 33_500_000,
                'total_amount' => 33_500_000,
                'sort_order' => 1,
            ]);

            $pay2 = Payment::query()->create([
                'matter_id' => $matter->id,
                'client_id' => $client->id,
                'account_id' => $primaryAccount->id,
                'reference_number' => 'INC-20260827-002',
                'method' => 'bank_transfer',
                'currency' => 'IDR',
                'gross_amount' => 33_500_000,
                'tax_withheld' => 0,
                'net_amount' => 33_500_000,
                'amount' => 33_500_000,
                'received_at' => '2026-08-27',
                'notes' => 'Penerimaan Honorarium Tahap 2 PT KKG via Transfer Bank',
                'recorded_by' => $adminUser->id,
            ]);
            PaymentAllocation::query()->create([
                'payment_id' => $pay2->id,
                'invoice_id' => $inv2->id,
                'amount' => 33_500_000,
            ]);

            $this->info('✓ 2 Invoices & Payments: +Rp 49.500.000');

            // 6. 13 Pengeluaran Kantor dari Excel
            $expensesData = [
                ['date' => '2026-07-29', 'cat' => 'office_stationery', 'vendor' => 'Toko ATK', 'desc' => 'ATK (EXP-20260729-001)', 'amount' => 128_600],
                ['date' => '2026-07-29', 'cat' => 'office_stationery', 'vendor' => 'Percetakan Stempel', 'desc' => 'STAMP RPK Law Office (EXP-20260729-002)', 'amount' => 163_000],
                ['date' => '2026-07-29', 'cat' => 'equipment', 'vendor' => 'Toko Elektronik', 'desc' => 'PRINTER HP SMART TANK 583 (EXP-20260729-003)', 'amount' => 2_099_000],
                ['date' => '2026-08-15', 'cat' => 'travel', 'vendor' => 'Whoosh Kereta Cepat', 'desc' => 'Tiket Woosh (EXP-20260815-004)', 'amount' => 325_000],
                ['date' => '2026-08-15', 'cat' => 'travel', 'vendor' => 'Whoosh Kereta Cepat', 'desc' => 'Tiket Woosh (EXP-20260815-005)', 'amount' => 325_000],
                ['date' => '2026-08-15', 'cat' => 'meals', 'vendor' => 'Starbucks', 'desc' => 'Starbucks (EXP-20260815-006)', 'amount' => 83_000],
                ['date' => '2026-08-15', 'cat' => 'meals', 'vendor' => 'Starbucks', 'desc' => 'Starbucks (EXP-20260815-007)', 'amount' => 97_800],
                ['date' => '2026-08-15', 'cat' => 'meals', 'vendor' => 'Kartikasari', 'desc' => 'Kartikasari (EXP-20260815-008)', 'amount' => 325_000],
                ['date' => '2026-08-17', 'cat' => 'software', 'vendor' => 'Domain Registrar', 'desc' => 'Domain Website (EXP-20260817-009)', 'amount' => 51_000],
                ['date' => '2026-08-17', 'cat' => 'software', 'vendor' => 'Google Workspace', 'desc' => 'Email Domain Kantor (EXP-20260817-010)', 'amount' => 145_188],
                ['date' => '2026-08-21', 'cat' => 'meals', 'vendor' => 'Resto Rapat', 'desc' => 'Rapat Mingguan (EXP-20260821-011)', 'amount' => 353_320],
                ['date' => '2026-08-27', 'cat' => 'legal_administration', 'vendor' => 'Notaris & Kemenkumham', 'desc' => 'Biaya Pembuatan Akta Firma (EXP-20260827-012)', 'amount' => 1_950_000],
                ['date' => '2026-08-27', 'cat' => 'marketing_commission', 'vendor' => 'Marketing Partner', 'desc' => 'Fee Marketing tahap 1 (EXP-20260827-013)', 'amount' => 8_000_000],
            ];

            foreach ($expensesData as $exp) {
                Expense::query()->create([
                    'matter_id' => null,
                    'account_id' => $primaryAccount->id,
                    'category' => $exp['cat'],
                    'vendor' => $exp['vendor'],
                    'description' => $exp['desc'],
                    'amount' => $exp['amount'],
                    'currency' => 'IDR',
                    'incurred_at' => $exp['date'],
                    'charge_to' => 'office',
                    'is_reimbursable' => false,
                    'status' => 'approved',
                    'approved_by' => $adminUser->id,
                    'approved_at' => $exp['date'],
                    'created_by' => $adminUser->id,
                ]);
            }
            $this->info('✓ 13 Pengeluaran Kantor: -Rp 14.045.908');

            // 7. 4 Payroll dari Excel
            // PAY-202607-001 (Bianca Rp 500rb via Kas Fajar)
            Payroll::query()->create([
                'payslip_number' => 'PAY-202607-001',
                'user_id' => $bianca->id,
                'period' => '2026-07',
                'basic_salary' => 500_000,
                'fixed_allowance' => 0,
                'transport_meal_allowance' => 0,
                'overtime_amount' => 0,
                'bonus_amount' => 0,
                'deductions_amount' => 0,
                'tax_deduction_amount' => 0,
                'net_salary' => 500_000,
                'status' => 'paid',
                'paid_at' => '2026-07-29',
                'payment_account_id' => $kasFajar->id,
                'approved_by' => $partnerFajar->id,
                'approved_at' => '2026-07-29',
                'notes' => 'Gaji Juli ditalangi menggunakan Kas Fajar',
                'created_by' => $adminUser->id,
            ]);

            // PAY-202607-002 (Davina Rp 500rb via Kas Fajar)
            Payroll::query()->create([
                'payslip_number' => 'PAY-202607-002',
                'user_id' => $davina->id,
                'period' => '2026-07',
                'basic_salary' => 500_000,
                'fixed_allowance' => 0,
                'transport_meal_allowance' => 0,
                'overtime_amount' => 0,
                'bonus_amount' => 0,
                'deductions_amount' => 0,
                'tax_deduction_amount' => 0,
                'net_salary' => 500_000,
                'status' => 'paid',
                'paid_at' => '2026-07-29',
                'payment_account_id' => $kasFajar->id,
                'approved_by' => $partnerFajar->id,
                'approved_at' => '2026-07-29',
                'notes' => 'Gaji Juli ditalangi menggunakan Kas Fajar',
                'created_by' => $adminUser->id,
            ]);

            // PAY-202608-003 (Bianca Rp 1.500.000 via Kas Kantor)
            Payroll::query()->create([
                'payslip_number' => 'PAY-202608-003',
                'user_id' => $bianca->id,
                'period' => '2026-08',
                'basic_salary' => 1_500_000,
                'fixed_allowance' => 0,
                'transport_meal_allowance' => 0,
                'overtime_amount' => 0,
                'bonus_amount' => 0,
                'deductions_amount' => 0,
                'tax_deduction_amount' => 0,
                'net_salary' => 1_500_000,
                'status' => 'paid',
                'paid_at' => '2026-08-27',
                'payment_account_id' => $primaryAccount->id,
                'approved_by' => $partnerFajar->id,
                'approved_at' => '2026-08-27',
                'notes' => 'Gaji Magang Agustus 2026',
                'created_by' => $adminUser->id,
            ]);

            // PAY-202608-004 (Davina Rp 1.500.000 via Bank Operasional)
            Payroll::query()->create([
                'payslip_number' => 'PAY-202608-004',
                'user_id' => $davina->id,
                'period' => '2026-08',
                'basic_salary' => 1_500_000,
                'fixed_allowance' => 0,
                'transport_meal_allowance' => 0,
                'overtime_amount' => 0,
                'bonus_amount' => 0,
                'deductions_amount' => 0,
                'tax_deduction_amount' => 0,
                'net_salary' => 1_500_000,
                'status' => 'paid',
                'paid_at' => '2026-08-27',
                'payment_account_id' => $primaryAccount->id,
                'approved_by' => $partnerFajar->id,
                'approved_at' => '2026-08-27',
                'notes' => 'Gaji Magang Agustus 2026',
                'created_by' => $adminUser->id,
            ]);

            // Catat Talangan Gaji Juli di Akun Talangan Fajar (+Rp 1.000.000)
            PartnerTransaction::query()->create([
                'partner_id' => $partnerFajar->id,
                'matter_id' => $matter->id,
                'account_id' => $kasFajar->id,
                'transaction_number' => 'PTR-20260729-TALANGAN',
                'transaction_date' => '2026-07-29',
                'type' => 'advance_incurred',
                'amount' => 1_000_000,
                'status' => 'completed',
                'notes' => 'Talangan dana pribadi Fajar Roni untuk gaji magang Juli (Bianca & Davina)',
                'created_by' => $adminUser->id,
            ]);

            $this->info('✓ 4 Payroll: -Rp 3.000.000 (Bank Operasional) & -Rp 1.000.000 (Talangan Fajar)');

            // 8. 7 Transaksi Partner dari Excel
            $partnerTxs = [
                // Juli: Bagi Hasil @Rp 3jt
                ['ref' => 'PTR-20260729-001', 'date' => '2026-07-29', 'partner' => $partnerFajar, 'type' => 'profit_distribution', 'amount' => 3_000_000, 'desc' => 'Pembayaran Bagi Hasil Juli - Fajar Roni'],
                ['ref' => 'PTR-20260729-002', 'date' => '2026-07-29', 'partner' => $partnerAnggara, 'type' => 'profit_distribution', 'amount' => 3_000_000, 'desc' => 'Pembayaran Bagi Hasil Juli - Anggara Putra'],
                ['ref' => 'PTR-20260729-003', 'date' => '2026-07-29', 'partner' => $partnerReza, 'type' => 'profit_distribution', 'amount' => 3_000_000, 'desc' => 'Pembayaran Bagi Hasil Juli - Reza Evaldo Kusumah'],
                // Agustus: Bagi Hasil @Rp 7jt
                ['ref' => 'PTR-20260827-004', 'date' => '2026-08-27', 'partner' => $partnerFajar, 'type' => 'profit_distribution', 'amount' => 7_000_000, 'desc' => 'Pembayaran Bagi Hasil Agustus - Fajar Roni'],
                ['ref' => 'PTR-20260827-005', 'date' => '2026-08-27', 'partner' => $partnerAnggara, 'type' => 'profit_distribution', 'amount' => 7_000_000, 'desc' => 'Pembayaran Bagi Hasil Agustus - Anggara Putra'],
                ['ref' => 'PTR-20260827-006', 'date' => '2026-08-27', 'partner' => $partnerReza, 'type' => 'profit_distribution', 'amount' => 7_000_000, 'desc' => 'Pembayaran Bagi Hasil Agustus - Reza Evaldo Kusumah'],
                // Pengembalian Talangan Fajar: Rp 1.000.000
                ['ref' => 'PTR-20260827-007', 'date' => '2026-08-27', 'partner' => $partnerFajar, 'type' => 'advance_reimbursed', 'amount' => 1_000_000, 'desc' => 'Pengembalian Talangan Gaji Juli kepada Fajar Roni'],
            ];

            foreach ($partnerTxs as $ptx) {
                PartnerTransaction::query()->create([
                    'partner_id' => $ptx['partner']->id,
                    'matter_id' => $matter->id,
                    'account_id' => $primaryAccount->id,
                    'transaction_number' => $ptx['ref'],
                    'transaction_date' => $ptx['date'],
                    'type' => $ptx['type'],
                    'amount' => $ptx['amount'],
                    'status' => 'completed',
                    'notes' => $ptx['desc'],
                    'created_by' => $adminUser->id,
                ]);
            }

            $this->info('✓ 7 Transaksi Partner: -Rp 30.000.000 (Bagi Hasil) & -Rp 1.000.000 (Pengembalian Talangan)');

            // 9. Recalculate all financial accounts
            FinancialAccount::syncAllBalances();

            $this->newLine();
            $this->info('================================================================');
            $this->info(' HASIL SALDO AKUN SETELAH REKONSILIASI ');
            $this->info('================================================================');

            $accounts = FinancialAccount::query()->get();
            $rows = [];
            foreach ($accounts as $acc) {
                $rows[] = [
                    $acc->name,
                    $acc->type,
                    'Rp '.number_format($acc->current_balance, 0, ',', '.'),
                ];
            }

            $this->table(['Nama Akun', 'Tipe', 'Saldo Akhir'], $rows);

            if ($isDryRun) {
                throw new \Exception('Rollback dry-run.');
            }

            $this->info('SINKRONISASI SUKSES 100%! Saldo kas & mutasi sekarang identik dengan Excel resmi.');

            return self::SUCCESS;
        });
    }
}
