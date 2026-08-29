<?php

namespace App\Console\Commands;

use App\Models\Expense;
use App\Models\FinancialAccount;
use App\Models\PartnerTransaction;
use App\Models\Payment;
use App\Models\Payroll;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('finance:repair-import-2026 {--apply : Terapkan koreksi; tanpa opsi ini command hanya menampilkan preview}')]
#[Description('Perbaiki klasifikasi, akun, dan pemilik payroll hasil impor keuangan RPK 2026')]
class RepairFinanceImport2026 extends Command
{
    /** @var list<string> */
    private const EXPENSE_DESCRIPTIONS = [
        'ATK (EXP-20260729-001)',
        'STAMP RPK Law Office (EXP-20260729-002)',
        'PRINTER HP SMART TANK 583 (EXP-20260729-003)',
        'Tiket Woosh (EXP-20260815-004)',
        'Tiket Woosh (EXP-20260815-005)',
        'Starbucks (EXP-20260815-006)',
        'Starbucks (EXP-20260815-007)',
        'Kartikasari (EXP-20260815-008)',
        'Domain Website (EXP-20260817-009)',
        'Email Domain Kantor (EXP-20260817-010)',
        'Rapat Mingguan (EXP-20260821-011)',
        'Biaya Pembuatan Akta Firma (EXP-20260827-012)',
        'Fee Marketing tahap 1 (EXP-20260827-013)',
    ];

    /** @var list<string> */
    private const PAYMENT_REFERENCES = ['INC-20260729-001', 'INC-20260827-002'];

    /** @var list<string> */
    private const DAVINA_PAYSLIPS = ['PAY-202607-002', 'PAY-202608-004'];

    /** @var list<string> */
    private const BANK_PAYSLIPS = ['PAY-202608-003', 'PAY-202608-004'];

    /** @var list<string> */
    private const BANK_PARTNER_TRANSACTIONS = [
        'PTR-20260729-001',
        'PTR-20260729-002',
        'PTR-20260729-003',
        'PTR-20260827-004',
        'PTR-20260827-005',
        'PTR-20260827-006',
        'PTR-20260827-007',
    ];

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $bankAccount = FinancialAccount::query()
            ->where('type', 'bank')
            ->where('name', 'Bank Operasional')
            ->first();
        $davina = User::query()
            ->where('name', 'Davina Putri Felisha')
            ->orWhere('email', 'like', 'davina%')
            ->first();

        if (! $bankAccount) {
            $this->error('Bank Operasional tidak ditemukan. Koreksi dibatalkan.');

            return self::FAILURE;
        }

        if (! $davina) {
            $this->error('User Davina Putri Felisha tidak ditemukan. Koreksi dibatalkan.');

            return self::FAILURE;
        }

        $summary = [
            ['Pengeluaran menjadi operasional kantor', Expense::query()->whereIn('description', self::EXPENSE_DESCRIPTIONS)->where(fn ($query) => $query->where('charge_to', '!=', 'office')->orWhereNotNull('matter_id')->orWhere('account_id', '!=', $bankAccount->id))->count()],
            ['Penerimaan dipindahkan ke Bank Operasional', Payment::query()->whereIn('reference_number', self::PAYMENT_REFERENCES)->where('account_id', '!=', $bankAccount->id)->count()],
            ['Payroll dialihkan ke Davina Putri Felisha', Payroll::query()->whereIn('payslip_number', self::DAVINA_PAYSLIPS)->where('user_id', '!=', $davina->id)->count()],
            ['Payroll Agustus dipindahkan ke Bank Operasional', Payroll::query()->whereIn('payslip_number', self::BANK_PAYSLIPS)->where('payment_account_id', '!=', $bankAccount->id)->count()],
            ['Distribusi partner dipindahkan ke Bank Operasional', PartnerTransaction::query()->whereIn('transaction_number', self::BANK_PARTNER_TRANSACTIONS)->where('account_id', '!=', $bankAccount->id)->count()],
        ];

        $this->table(['Koreksi', 'Jumlah record'], $summary);

        if (! $this->option('apply')) {
            $this->warn('PREVIEW SAJA. Jalankan kembali dengan --apply untuk menerapkan koreksi.');

            return self::SUCCESS;
        }

        DB::transaction(function () use ($bankAccount, $davina): void {
            Expense::query()->whereIn('description', self::EXPENSE_DESCRIPTIONS)->update([
                'charge_to' => 'office',
                'matter_id' => null,
                'account_id' => $bankAccount->id,
                'is_reimbursable' => false,
            ]);

            Expense::query()->where('description', 'Biaya Pembuatan Akta Firma (EXP-20260827-012)')->update([
                'category' => 'legal_administration',
            ]);

            Expense::query()->where('description', 'Fee Marketing tahap 1 (EXP-20260827-013)')->update([
                'category' => 'marketing_commission',
            ]);

            Payment::query()->whereIn('reference_number', self::PAYMENT_REFERENCES)->update([
                'account_id' => $bankAccount->id,
            ]);

            Payroll::query()->whereIn('payslip_number', self::DAVINA_PAYSLIPS)->update([
                'user_id' => $davina->id,
            ]);

            Payroll::query()->whereIn('payslip_number', self::BANK_PAYSLIPS)->update([
                'payment_account_id' => $bankAccount->id,
            ]);

            PartnerTransaction::query()->whereIn('transaction_number', self::BANK_PARTNER_TRANSACTIONS)->update([
                'account_id' => $bankAccount->id,
            ]);

            FinancialAccount::syncAllBalances();
        });

        $this->info('Koreksi data Finance 2026 berhasil diterapkan dan saldo akun telah dihitung ulang.');

        return self::SUCCESS;
    }
}
