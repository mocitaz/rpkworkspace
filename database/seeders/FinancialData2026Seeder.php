<?php

namespace Database\Seeders;

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
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class FinancialData2026Seeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            // 1. Ensure Partner Users
            $fajar = User::query()->where('email', 'fajarroni@rpklawoffice.com')
                ->orWhere('name', 'like', '%Fajar Roni%')
                ->first();

            if (! $fajar) {
                $fajar = User::query()->create([
                    'name' => 'Muhamad Fajar Roni, S.H.',
                    'email' => 'fajarroni@rpklawoffice.com',
                    'email_verified_at' => now(),
                    'password' => Hash::make('password'),
                    'position_title' => 'Managing Partner',
                    'department' => 'Executive & Strategic Litigation',
                    'employment_type' => 'Permanent',
                    'employment_status' => 'Active',
                    'work_mode' => 'Hybrid',
                    'is_active' => true,
                ]);

                $partnerRoles = Role::query()->whereIn('name', ['Administrator Sistem', 'Managing Partner', 'Partner'])->get();
                $fajar->roles()->sync($partnerRoles->pluck('id'));
            }

            // 2. Ensure Staff/Paralegal Users (Deduplicate & Merge if duplicates exist)
            $internRole = Role::query()->where('name', 'like', '%Magang%')->orWhere('name', 'like', '%Associate%')->first();

            $mergeUsers = function (array $emails, array $nameKeywords, array $attributes) use ($internRole): User {
                $users = User::query()
                    ->whereIn('email', $emails)
                    ->orWhere(function ($q) use ($nameKeywords) {
                        foreach ($nameKeywords as $kw) {
                            $q->orWhere('name', 'like', "%{$kw}%");
                        }
                    })
                    ->orderBy('id', 'asc')
                    ->get();

                if ($users->isEmpty()) {
                    $master = User::query()->create($attributes);
                } else {
                    $master = $users->first();
                    $duplicates = $users->filter(fn (User $u) => $u->id !== $master->id);

                    foreach ($duplicates as $dup) {
                        // Re-link all related data across tables to the master user
                        $relink = function (string $table, string $column) use ($dup, $master) {
                            if (Schema::hasTable($table) && Schema::hasColumn($table, $column)) {
                                DB::table($table)->where($column, $dup->id)->update([$column => $master->id]);
                            }
                        };

                        $relink('payrolls', 'user_id');
                        $relink('payrolls', 'created_by');
                        $relink('payrolls', 'approved_by');
                        $relink('expenses', 'created_by');
                        $relink('expenses', 'approved_by');
                        $relink('expenses', 'partner_id');
                        $relink('payments', 'recorded_by');
                        $relink('invoices', 'created_by');
                        $relink('quotations', 'created_by');
                        $relink('client_trust_funds', 'created_by');
                        $relink('client_trust_funds', 'approved_by');
                        $relink('account_transfers', 'created_by');
                        $relink('account_transfers', 'approved_by');
                        $relink('partner_transactions', 'partner_id');
                        $relink('partner_transactions', 'created_by');
                        $relink('partner_transactions', 'approved_by');
                        $relink('tasks', 'assignee_id');
                        $relink('tasks', 'created_by');
                        $relink('documents', 'created_by');

                        if (Schema::hasTable('matter_user')) {
                            DB::table('matter_user')->where('user_id', $dup->id)->delete();
                        }
                        if (Schema::hasTable('role_user')) {
                            DB::table('role_user')->where('user_id', $dup->id)->delete();
                        }

                        $dup->delete();
                    }
                }

                if ($internRole) {
                    $master->roles()->syncWithoutDetaching([$internRole->id]);
                }

                return $master;
            };

            $bianca = $mergeUsers(
                ['bianca.desfani@gmail.com', 'bianca@rpklawoffice.com'],
                ['Bianca Lianda', 'Bianca'],
                [
                    'name' => 'Bianca Lianda Desfani',
                    'email' => 'bianca.desfani@gmail.com',
                    'email_verified_at' => now(),
                    'password' => Hash::make('password'),
                    'position_title' => 'Advokat Magang',
                    'department' => 'Litigasi dan Non Litigasi',
                    'employment_type' => 'Internship',
                    'employment_status' => 'Active',
                    'work_mode' => 'On-site',
                    'is_active' => true,
                ]
            );

            $dafina = $mergeUsers(
                ['davinapf25@gmail.com', 'dafina@rpklawoffice.com', 'davina@rpklawoffice.com'],
                ['Dafina Putri', 'Davina Felisha', 'Dafina', 'Davina'],
                [
                    'name' => 'Dafina Putri Felisha',
                    'email' => 'davinapf25@gmail.com',
                    'email_verified_at' => now(),
                    'password' => Hash::make('password'),
                    'position_title' => 'Advokat Magang',
                    'department' => 'Litigasi dan Non Litigasi',
                    'employment_type' => 'Internship',
                    'employment_status' => 'Active',
                    'work_mode' => 'On-site',
                    'is_active' => true,
                ]
            );

            // 3. Ensure Single Master Client PT KKG (Merge if duplicate exists)
            $existingClients = Client::query()
                ->where('client_number', 'RPK-C-2026-YNGZAW')
                ->orWhere('client_number', 'CLI-2026-0001')
                ->orWhere('display_name', 'like', '%KKG%')
                ->orWhere('display_name', 'like', '%Kembang Kembar%')
                ->orWhere('legal_name', 'like', '%Kembang Kembar%')
                ->orderBy('created_at', 'asc')
                ->get();

            if ($existingClients->count() > 0) {
                // Prefer the user-created client (e.g. RPK-C-2026-YNGZAW or the earliest created)
                $masterClient = $existingClients->firstWhere('client_number', 'RPK-C-2026-YNGZAW') ?? $existingClients->first();
                $masterClient->update([
                    'legal_name' => 'PT KEMBANG KEMBAR GRUP',
                    'display_name' => 'PT KEMBANG KEMBAR GRUP',
                    'industry' => $masterClient->industry ?? 'Properti / Real Estate Developer',
                    'email' => $masterClient->email ?? 'finance@kembangkembar.com',
                    'phone' => $masterClient->phone ?? '021-5550192',
                    'status' => 'active',
                ]);

                // Merge and delete any other duplicate clients
                foreach ($existingClients as $dup) {
                    if ($dup->getKey() !== $masterClient->getKey()) {
                        Matter::query()->where('client_id', $dup->getKey())->update(['client_id' => $masterClient->getKey()]);
                        Invoice::query()->where('client_id', $dup->getKey())->update(['client_id' => $masterClient->getKey()]);
                        Payment::query()->where('client_id', $dup->getKey())->update(['client_id' => $masterClient->getKey()]);
                        DB::table('quotations')->where('client_id', $dup->getKey())->update(['client_id' => $masterClient->getKey()]);
                        DB::table('client_trust_funds')->where('client_id', $dup->getKey())->update(['client_id' => $masterClient->getKey()]);
                        DB::table('documents')->where('client_id', $dup->getKey())->update(['client_id' => $masterClient->getKey()]);
                        DB::table('contacts')->where('client_id', $dup->getKey())->update(['client_id' => $masterClient->getKey()]);
                        $dup->delete();
                    }
                }
                $client = $masterClient;
            } else {
                $client = Client::query()->create([
                    'client_number' => 'RPK-C-2026-YNGZAW',
                    'legal_name' => 'PT KEMBANG KEMBAR GRUP',
                    'display_name' => 'PT KEMBANG KEMBAR GRUP',
                    'type' => 'corporate',
                    'industry' => 'Properti / Real Estate Developer',
                    'status' => 'active',
                    'email' => 'finance@kembangkembar.com',
                    'phone' => '021-5550192',
                    'address_line_1' => 'Jakarta Selatan, DKI Jakarta',
                    'relationship_partner_id' => $fajar->getKey(),
                    'created_by' => $fajar->getKey(),
                ]);
            }

            // 4. Ensure Single Matter PT KKG
            $matter = Matter::query()
                ->where('client_id', $client->getKey())
                ->orWhere('matter_number', 'RPK-2026-0001')
                ->orWhere('matter_number', '001/2026')
                ->orWhere('title', 'like', '%Kembang Kembar%')
                ->first();

            if (! $matter) {
                $matter = Matter::query()->create([
                    'client_id' => $client->getKey(),
                    'matter_number' => 'RPK-2026-0001',
                    'title' => 'Pendampingan Hukum Korporasi dan Penyelesaian Sengketa Internal PT Kembang Kembar Grup',
                    'summary' => 'Pendampingan Hukum Korporasi dan Penyelesaian Sengketa Internal PT Kembang Kembar Grup',
                    'status' => 'active',
                    'priority' => 'high',
                    'opened_at' => '2026-07-29',
                    'budget_amount' => 165000000,
                    'responsible_partner_id' => $fajar->getKey(),
                    'created_by' => $fajar->getKey(),
                ]);
            } else {
                $matter->update([
                    'client_id' => $client->getKey(),
                    'title' => 'Pendampingan Hukum Korporasi dan Penyelesaian Sengketa Internal PT Kembang Kembar Grup',
                    'budget_amount' => 165000000,
                    'responsible_partner_id' => $fajar->getKey(),
                ]);
            }

            // 5. Ensure Financial Accounts
            $bankOp = FinancialAccount::query()->firstOrCreate(
                ['name' => 'Bank Operasional'],
                [
                    'type' => 'bank',
                    'bank_name' => 'Bank Mandiri',
                    'account_number' => '131-00-1928374-1',
                    'account_holder' => 'RPK Law Office',
                    'opening_balance' => 0,
                    'current_balance' => 2904092,
                    'is_active' => true,
                    'created_by' => $fajar->getKey(),
                ]
            );

            $kasKantor = FinancialAccount::query()->firstOrCreate(
                ['name' => 'Kas Kantor'],
                [
                    'type' => 'cash',
                    'account_holder' => 'Kasir RPK',
                    'opening_balance' => 0,
                    'current_balance' => 0,
                    'is_active' => true,
                    'created_by' => $fajar->getKey(),
                ]
            );

            $kasFajar = FinancialAccount::query()->firstOrCreate(
                ['name' => 'Kas Talangan Fajar Roni'],
                [
                    'type' => 'partner_advance',
                    'partner_id' => $fajar->getKey(),
                    'account_holder' => 'Fajar Roni',
                    'opening_balance' => 0,
                    'current_balance' => 1000000,
                    'is_active' => true,
                    'created_by' => $fajar->getKey(),
                ]
            );

            $bankDanaKlien = FinancialAccount::query()->firstOrCreate(
                ['name' => 'Bank Dana Klien'],
                [
                    'type' => 'client_trust',
                    'bank_name' => 'Bank BCA',
                    'account_number' => '521-0987654-0',
                    'account_holder' => 'RPK Law Office Escrow',
                    'opening_balance' => 0,
                    'current_balance' => 0,
                    'is_active' => true,
                    'created_by' => $fajar->getKey(),
                ]
            );

            // 6. Invoices
            $inv1 = Invoice::query()->firstOrCreate(
                ['invoice_number' => 'RPK-INV-2026-001'],
                [
                    'client_id' => $client->getKey(),
                    'matter_id' => $matter->getKey(),
                    'title' => 'Honorarium Termin 1 (Uang Muka Penugasan)',
                    'status' => 'paid',
                    'currency' => 'IDR',
                    'subtotal_amount' => 16000000,
                    'discount_amount' => 0,
                    'tax_rate' => 0,
                    'tax_amount' => 0,
                    'total_amount' => 16000000,
                    'paid_amount' => 16000000,
                    'outstanding_amount' => 0,
                    'issued_at' => '2026-07-29',
                    'due_at' => '2026-08-03',
                    'sent_at' => '2026-07-29 10:00:00',
                    'paid_at' => '2026-07-29 14:30:00',
                    'created_by' => $fajar->getKey(),
                ]
            );

            InvoiceLineItem::query()->firstOrCreate(
                [
                    'invoice_id' => $inv1->getKey(),
                    'description' => 'Honorarium Tahap 1 - Pendampingan Hukum Korporasi PT KKG',
                ],
                [
                    'quantity' => 1,
                    'unit_amount' => 16000000,
                    'total_amount' => 16000000,
                    'sort_order' => 1,
                ]
            );

            $inv2 = Invoice::query()->firstOrCreate(
                ['invoice_number' => 'RPK-INV-2026-002'],
                [
                    'client_id' => $client->getKey(),
                    'matter_id' => $matter->getKey(),
                    'title' => 'Honorarium Termin 2 & Penyesuaian Termin 1',
                    'status' => 'sent',
                    'currency' => 'IDR',
                    'subtotal_amount' => 33500000,
                    'discount_amount' => 0,
                    'tax_rate' => 0,
                    'tax_amount' => 0,
                    'total_amount' => 33500000,
                    'paid_amount' => 0,
                    'outstanding_amount' => 33500000,
                    'issued_at' => '2026-08-24',
                    'due_at' => '2026-08-29',
                    'sent_at' => '2026-08-24 09:00:00',
                    'cancellation_reason' => null,
                    'created_by' => $fajar->getKey(),
                ]
            );

            InvoiceLineItem::query()->firstOrCreate(
                [
                    'invoice_id' => $inv2->getKey(),
                    'description' => 'Pembayaran Termin Ke 2 (dua) 20%, dan Pembayaran Kekurangan Termin ke 1 (satu) Sebesar Rp.500.000',
                ],
                [
                    'quantity' => 1,
                    'unit_amount' => 33500000,
                    'total_amount' => 33500000,
                    'sort_order' => 1,
                ]
            );

            // 7. Payments (Penerimaan Kas)
            $payment1 = Payment::query()->firstOrCreate(
                ['reference_number' => 'PAY-REC-20260729-001'],
                [
                    'client_id' => $client->getKey(),
                    'matter_id' => $matter->getKey(),
                    'account_id' => $bankOp->getKey(),
                    'currency' => 'IDR',
                    'amount' => 16000000,
                    'gross_amount' => 16000000,
                    'tax_withheld' => 0,
                    'net_amount' => 16000000,
                    'method' => 'bank_transfer',
                    'notes' => 'Penerimaan pembayaran invoice RPK-INV-2026-001 via Transfer Mandiri',
                    'received_at' => '2026-07-29 14:30:00',
                    'recorded_by' => $fajar->getKey(),
                ]
            );

            PaymentAllocation::query()->firstOrCreate(
                [
                    'payment_id' => $payment1->getKey(),
                    'invoice_id' => $inv1->getKey(),
                ],
                [
                    'amount' => 16000000,
                ]
            );

            // 8. Expenses (11 items)
            $expensesData = [
                ['id' => 'EXP-20260729-001', 'date' => '2026-07-29', 'cat' => 'Peralatan Kantor', 'desc' => 'ATK', 'amount' => 34700, 'vendor' => 'Toko ATK', 'ref' => 'ATK-01'],
                ['id' => 'EXP-20260729-002', 'date' => '2026-07-29', 'cat' => 'Peralatan Kantor', 'desc' => 'STAMP RPK Law Office', 'amount' => 163000, 'vendor' => 'Percetakan Stamp', 'ref' => 'HAS 018013'],
                ['id' => 'EXP-20260729-003', 'date' => '2026-07-29', 'cat' => 'Peralatan Kantor', 'desc' => 'PRINTER HP SMART TANK 583', 'amount' => 2099000, 'vendor' => 'Official Store HP', 'ref' => 'Inv 7132-68350'],
                ['id' => 'EXP-20260815-004', 'date' => '2026-08-15', 'cat' => 'Transportasi', 'desc' => 'Tiket Woosh', 'amount' => 325000, 'vendor' => 'KCIC Whoosh', 'ref' => '62003XZ086202608149437826'],
                ['id' => 'EXP-20260815-005', 'date' => '2026-08-15', 'cat' => 'Transportasi', 'desc' => 'Tiket Woosh', 'amount' => 325000, 'vendor' => 'KCIC Whoosh', 'ref' => '62001XZ086202608149080460'],
                ['id' => 'EXP-20260815-006', 'date' => '2026-08-15', 'cat' => 'Konsumsi', 'desc' => 'Starbucks', 'amount' => 83000, 'vendor' => 'Starbucks Indonesia', 'ref' => 'SSCDH178661366499SCDH002'],
                ['id' => 'EXP-20260815-007', 'date' => '2026-08-15', 'cat' => 'Konsumsi', 'desc' => 'Starbucks', 'amount' => 97800, 'vendor' => 'Starbucks Indonesia', 'ref' => 'SSCDH178661504395SCDH002'],
                ['id' => 'EXP-20260815-008', 'date' => '2026-08-15', 'cat' => 'Konsumsi', 'desc' => 'Kartikasari', 'amount' => 325000, 'vendor' => 'Kartika Sari Bandung', 'ref' => '11/ARCG/00093516'],
                ['id' => 'EXP-20260817-009', 'date' => '2026-08-17', 'cat' => 'Software/Langganan', 'desc' => 'Domain Website', 'amount' => 51000, 'vendor' => 'Provider Domain', 'ref' => 'DOM-2026'],
                ['id' => 'EXP-20260817-010', 'date' => '2026-08-17', 'cat' => 'Software/Langganan', 'desc' => 'Email Domain Kantor', 'amount' => 145188, 'vendor' => 'Google Workspace', 'ref' => 'QRIS JD9FEK1WRSDI8FWAKOFU8CZNC'],
                ['id' => 'EXP-20260821-011', 'date' => '2026-08-21', 'cat' => 'Konsumsi', 'desc' => 'Rapat Mingguan', 'amount' => 353320, 'vendor' => 'Resto Meeting', 'ref' => '110723'],
            ];

            foreach ($expensesData as $ed) {
                Expense::query()->firstOrCreate(
                    [
                        'description' => $ed['desc'],
                        'amount' => $ed['amount'],
                        'incurred_at' => $ed['date'],
                    ],
                    [
                        'matter_id' => $matter->getKey(),
                        'category' => $ed['cat'],
                        'charge_to' => 'office',
                        'vendor' => $ed['vendor'],
                        'currency' => 'IDR',
                        'account_id' => $kasKantor->getKey(),
                        'is_reimbursable' => false,
                        'status' => 'approved',
                        'approved_by' => $fajar->getKey(),
                        'approved_at' => Carbon::parse($ed['date'])->addHours(4),
                        'created_by' => $fajar->getKey(),
                    ]
                );
            }

            // 9. Payrolls (4 items)
            $payrollsData = [
                ['slip' => 'PAY-202607-001', 'user' => $bianca, 'period' => '2026-07', 'basic' => 500000, 'status' => 'paid', 'paid_at' => '2026-07-31 16:00:00'],
                ['slip' => 'PAY-202607-002', 'user' => $dafina, 'period' => '2026-07', 'basic' => 500000, 'status' => 'paid', 'paid_at' => '2026-07-31 16:00:00'],
                ['slip' => 'PAY-202608-003', 'user' => $bianca, 'period' => '2026-08', 'basic' => 1500000, 'status' => 'approved', 'paid_at' => null],
                ['slip' => 'PAY-202608-004', 'user' => $dafina, 'period' => '2026-08', 'basic' => 1500000, 'status' => 'approved', 'paid_at' => null],
            ];

            foreach ($payrollsData as $pd) {
                Payroll::query()->firstOrCreate(
                    ['payslip_number' => $pd['slip']],
                    [
                        'user_id' => $pd['user']->getKey(),
                        'period' => $pd['period'],
                        'basic_salary' => $pd['basic'],
                        'fixed_allowance' => 0,
                        'transport_meal_allowance' => 0,
                        'overtime_amount' => 0,
                        'bonus_amount' => 0,
                        'tax_deduction_amount' => 0,
                        'deductions_amount' => 0,
                        'net_salary' => $pd['basic'],
                        'payment_account_id' => $bankOp->getKey(),
                        'status' => $pd['status'],
                        'paid_at' => $pd['paid_at'],
                        'notes' => 'Honorarium Staf Paralegal RPK Law Office',
                        'created_by' => $fajar->getKey(),
                    ]
                );
            }

            // 10. Partner Transactions (Bagi Hasil & Talangan)
            $partnerTrxData = [
                ['num' => 'PTR-20260729-001', 'type' => 'profit_distribution', 'date' => '2026-07-29', 'amount' => 3000000, 'notes' => 'Pembayaran Bagi Hasil Partner Fajar Roni (Termin 1 Bagian 1)', 'acc' => $bankOp],
                ['num' => 'PTR-20260729-002', 'type' => 'profit_distribution', 'date' => '2026-07-30', 'amount' => 3000000, 'notes' => 'Pembayaran Bagi Hasil Partner Fajar Roni (Termin 1 Bagian 2)', 'acc' => $bankOp],
                ['num' => 'PTR-20260729-003', 'type' => 'profit_distribution', 'date' => '2026-07-31', 'amount' => 3000000, 'notes' => 'Pembayaran Bagi Hasil Partner Fajar Roni (Termin 1 Bagian 3)', 'acc' => $bankOp],
                ['num' => 'PTR-20260729-004', 'type' => 'advance_incurred', 'date' => '2026-07-29', 'amount' => 1000000, 'notes' => 'Talangan Pribadi Partner Fajar Roni untuk Operasional Awal', 'acc' => $kasFajar],
            ];

            foreach ($partnerTrxData as $idx => $pt) {
                PartnerTransaction::query()->firstOrCreate(
                    [
                        'transaction_number' => $pt['num'],
                    ],
                    [
                        'partner_id' => $fajar->getKey(),
                        'transaction_date' => $pt['date'],
                        'notes' => $pt['notes'],
                        'type' => $pt['type'],
                        'matter_id' => $matter->getKey(),
                        'account_id' => $pt['acc']->getKey(),
                        'amount' => $pt['amount'],
                        'status' => 'completed',
                        'created_by' => $fajar->getKey(),
                    ]
                );
            }
        });
    }
}
