<?php

namespace App\Services;

use App\Models\ClientTrustFund;
use App\Models\Expense;
use App\Models\FinancialAccount;
use App\Models\Invoice;
use App\Models\Matter;
use App\Models\PartnerTransaction;
use App\Models\Payment;
use App\Models\Payroll;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

class FirmFinancialStatementService
{
    /**
     * Get matter profitability analysis.
     *
     * @param  Collection<int, Matter>|EloquentCollection<int, Matter>  $matters
     * @return array<int, array<string, mixed>>
     */
    public function getProfitability(Collection|EloquentCollection $matters): array
    {
        $matterIds = $matters->pluck('id');

        $invoices = Invoice::query()
            ->whereIn('matter_id', $matterIds)
            ->whereNotIn('status', ['cancelled', 'draft'])
            ->get(['matter_id', 'total_amount', 'paid_amount', 'outstanding_amount']);

        $expenses = Expense::query()
            ->whereIn('matter_id', $matterIds)
            ->whereNotIn('status', ['cancelled', 'draft'])
            ->get(['matter_id', 'amount', 'charge_to']);

        return $matters->map(function (Matter $matter) use ($invoices, $expenses) {
            $matterInvoices = $invoices->where('matter_id', $matter->getKey());
            $matterExpenses = $expenses->where('matter_id', $matter->getKey());

            $contractValue = (int) ($matter->budget_amount ?? 0);
            $invoiced = (int) $matterInvoices->sum('total_amount');
            $collected = (int) $matterInvoices->sum('paid_amount');
            $officeExpenses = (int) $matterExpenses->where('charge_to', 'office')->sum('amount');
            $clientExpenses = (int) $matterExpenses->where('charge_to', 'client')->sum('amount');
            $totalExpenses = (int) $matterExpenses->sum('amount');
            $margin = $collected - $totalExpenses;
            $marginPercent = $collected > 0 ? round(($margin / $collected) * 100, 1) : 0;
            $unbilledContract = max(0, $contractValue - $invoiced);

            return [
                'id' => $matter->getKey(),
                'matter_number' => $matter->matter_number,
                'title' => $matter->title,
                'client_name' => $matter->client?->display_name ?? 'Klien Non-Perkara',
                'status' => $matter->status,
                'contract_value' => $contractValue,
                'invoiced_amount' => $invoiced,
                'collected_amount' => $collected,
                'unbilled_contract' => $unbilledContract,
                'office_expenses' => $officeExpenses,
                'client_expenses' => $clientExpenses,
                'total_expenses' => $totalExpenses,
                'net_margin' => $margin,
                'margin_percentage' => $marginPercent,
            ];
        })->values()->all();
    }

    /**
     * Get Partner Advance (Talangan) summary per partner.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getPartnerAdvances(): array
    {
        $accounts = FinancialAccount::query()
            ->where('type', 'partner_advance')
            ->with('partner:id,name,email')
            ->get();

        $transactions = PartnerTransaction::query()
            ->whereIn('status', ['approved', 'completed'])
            ->get();

        $expensesTalangan = Expense::query()
            ->whereNotNull('partner_id')
            ->whereNotIn('status', ['cancelled', 'draft'])
            ->get();

        return $accounts->map(function (FinancialAccount $acc) use ($transactions, $expensesTalangan) {
            $partnerId = $acc->partner_id;

            $directIncurred = (int) $transactions->where('partner_id', $partnerId)->where('type', 'advance_incurred')->sum('amount');
            $fromExpenses = (int) $expensesTalangan->where('partner_id', $partnerId)->sum('amount');
            $totalAdvances = $directIncurred + $fromExpenses;

            $reimbursed = (int) $transactions->where('partner_id', $partnerId)->where('type', 'advance_reimbursed')->sum('amount');
            $profitDistributed = (int) $transactions->where('partner_id', $partnerId)->where('type', 'profit_distribution')->sum('amount');
            $priveDrawn = (int) $transactions->where('partner_id', $partnerId)->where('type', 'draw_prive')->sum('amount');

            $netDueToPartner = $acc->opening_balance + $totalAdvances - $reimbursed;

            return [
                'account_id' => $acc->getKey(),
                'account_name' => $acc->name,
                'partner_id' => $partnerId,
                'partner_name' => $acc->partner?->name ?? $acc->name,
                'opening_balance' => (int) $acc->opening_balance,
                'advances_incurred' => $totalAdvances,
                'advances_reimbursed' => $reimbursed,
                'profit_distributed' => $profitDistributed,
                'prive_drawn' => $priveDrawn,
                'net_due_to_partner' => $netDueToPartner,
            ];
        })->values()->all();
    }

    /**
     * Get Client Trust Fund (Dana Titipan) summary.
     *
     * @return array<string, mixed>
     */
    public function getClientTrustSummary(?string $matterId = null): array
    {
        $funds = ClientTrustFund::query()
            ->when($matterId, fn ($q) => $q->where('matter_id', $matterId))
            ->with(['client:id,display_name', 'matter:id,matter_number,title', 'account:id,name'])
            ->whereIn('status', ['approved', 'completed'])
            ->latest('transaction_date')
            ->get();

        $totalDepositIn = (int) $funds->where('type', 'deposit_in')->sum('amount');
        $totalDisbursementOut = (int) $funds->where('type', 'disbursement_out')->sum('amount');
        $netTrustBalance = $totalDepositIn - $totalDisbursementOut;

        $byMatter = $funds->groupBy('matter_id')->map(function ($items, $matterId) {
            $matter = $items->first()->matter;
            $client = $items->first()->client;
            $in = (int) $items->where('type', 'deposit_in')->sum('amount');
            $out = (int) $items->where('type', 'disbursement_out')->sum('amount');

            return [
                'matter_id' => $matterId,
                'matter_number' => $matter?->matter_number ?? 'Umum / Titipan Khusus',
                'matter_title' => $matter?->title ?? '-',
                'client_name' => $client?->display_name ?? '-',
                'deposit_in' => $in,
                'disbursement_out' => $out,
                'current_balance' => $in - $out,
            ];
        })->values()->all();

        return [
            'total_deposit_in' => $totalDepositIn,
            'total_disbursement_out' => $totalDisbursementOut,
            'net_trust_balance' => $netTrustBalance,
            'by_matter' => $byMatter,
        ];
    }

    /**
     * Get Monthly Income Statement (Laba Rugi Bulanan).
     *
     * @return array<string, mixed>
     */
    public function getIncomeStatement(int $year): array
    {
        $months = range(1, 12);
        $monthsData = [];

        $payments = Payment::query()
            ->whereYear('received_at', $year)
            ->whereNull('reversed_at')
            ->whereNull('refunded_at')
            ->get();

        $expenses = Expense::query()
            ->whereYear('incurred_at', $year)
            ->whereNotIn('status', ['cancelled', 'draft'])
            ->get();

        $payrolls = Payroll::query()
            ->where('period', 'like', "{$year}-%")
            ->whereIn('status', ['approved', 'paid'])
            ->get();

        $totalRevenue = 0;
        $totalOperationalExpenses = 0;
        $totalPayrollExpenses = 0;

        foreach ($months as $m) {
            $monthStr = str_pad((string) $m, 2, '0', STR_PAD_LEFT);
            $monthPeriod = "{$year}-{$monthStr}";

            $mPayments = $payments->filter(fn ($p) => Carbon::parse($p->received_at)->month === $m);
            $mExpenses = $expenses->filter(fn ($e) => Carbon::parse($e->incurred_at)->month === $m);
            $mPayrolls = $payrolls->filter(fn ($pr) => $pr->period === $monthPeriod);

            $revenue = (int) $mPayments->sum('amount');
            $opExpense = (int) $mExpenses->sum('amount');
            $payrollExpense = (int) $mPayrolls->sum('net_salary');
            $totalExpense = $opExpense + $payrollExpense;
            $netProfit = $revenue - $totalExpense;

            $totalRevenue += $revenue;
            $totalOperationalExpenses += $opExpense;
            $totalPayrollExpenses += $payrollExpense;

            $monthsData[] = [
                'month' => $m,
                'period' => $monthPeriod,
                'revenue' => $revenue,
                'operational_expense' => $opExpense,
                'payroll_expense' => $payrollExpense,
                'total_expense' => $totalExpense,
                'net_profit' => $netProfit,
            ];
        }

        $totalExpensesAll = $totalOperationalExpenses + $totalPayrollExpenses;
        $netProfitYear = $totalRevenue - $totalExpensesAll;

        return [
            'year' => $year,
            'months' => $monthsData,
            'summary' => [
                'total_revenue' => $totalRevenue,
                'total_operational_expense' => $totalOperationalExpenses,
                'total_payroll_expense' => $totalPayrollExpenses,
                'total_expenses' => $totalExpensesAll,
                'net_profit' => $netProfitYear,
            ],
        ];
    }

    /**
     * Get Balance Sheet (Neraca / Posisi Keuangan).
     *
     * @return array<string, mixed>
     */
    public function getBalanceSheet(): array
    {
        $accounts = FinancialAccount::query()->get();
        $opCashBank = (int) $accounts->whereIn('type', ['cash', 'bank'])->sum('current_balance');
        $clientTrustBank = (int) $accounts->where('type', 'client_trust')->sum('current_balance');

        $taxWithheld = (int) Payment::query()
            ->whereNull('reversed_at')
            ->whereNull('refunded_at')
            ->sum('tax_withheld');

        $totalAssets = $opCashBank + $clientTrustBank + $taxWithheld;

        // Liabilities
        $partnerAdvancesDue = (int) $this->getPartnerAdvancesTotal();
        $unpaidPayrolls = (int) Payroll::query()
            ->whereIn('status', ['draft', 'approved'])
            ->sum('net_salary');
        $clientTrustLiabilities = (int) $this->getClientTrustSummary()['net_trust_balance'];

        $totalLiabilities = $partnerAdvancesDue + $unpaidPayrolls + $clientTrustLiabilities;

        // Equity
        $retainedEarnings = $totalAssets - $totalLiabilities;

        return [
            'assets' => [
                'operational_cash_bank' => $opCashBank,
                'client_trust_bank' => $clientTrustBank,
                'tax_credit_pph23' => $taxWithheld,
                'total_assets' => $totalAssets,
            ],
            'liabilities' => [
                'partner_advances_due' => $partnerAdvancesDue,
                'unpaid_payroll' => $unpaidPayrolls,
                'client_trust_liability' => $clientTrustLiabilities,
                'total_liabilities' => $totalLiabilities,
            ],
            'equity' => [
                'retained_earnings' => $retainedEarnings,
                'total_equity' => $retainedEarnings,
                'total_liabilities_and_equity' => $totalLiabilities + $retainedEarnings,
            ],
            'is_balanced' => $totalAssets === ($totalLiabilities + $retainedEarnings),
        ];
    }

    private function getPartnerAdvancesTotal(): int
    {
        $advances = $this->getPartnerAdvances();

        return (int) collect($advances)->sum('net_due_to_partner');
    }
}
