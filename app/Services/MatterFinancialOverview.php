<?php

namespace App\Services;

use App\Models\Expense;
use App\Models\Invoice;
use App\Models\Matter;
use App\Models\Payment;
use App\Models\Quotation;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class MatterFinancialOverview
{
    /** @return array<string, int|string|array<string, int>> */
    public function for(Matter $matter): array
    {
        $invoices = Invoice::query()
            ->whereBelongsTo($matter)
            ->whereNotIn('status', ['cancelled', 'draft']);
        $invoicedAmount = (int) (clone $invoices)->sum('total_amount');
        $paidAmount = (int) (clone $invoices)->sum('paid_amount');
        $receivableAmount = (int) $invoices->sum('outstanding_amount');
        $expenseAmount = (int) Expense::query()
            ->whereBelongsTo($matter)
            ->whereNotIn('status', ['cancelled', 'draft'])
            ->sum('amount');
        $quotationAmount = (int) Quotation::query()
            ->whereBelongsTo($matter)
            ->whereNotIn('status', ['cancelled', 'draft'])
            ->sum('total_amount');
        $paymentAmount = (int) Payment::query()
            ->whereBelongsTo($matter)
            ->whereNull('reversed_at')
            ->whereNull('refunded_at')
            ->sum('amount');
        $aging = ['current' => 0, '1_30' => 0, '31_60' => 0, '61_90' => 0, 'over_90' => 0];
        (clone $invoices)->get(['due_at', 'outstanding_amount'])->each(function (Invoice $invoice) use (&$aging): void {
            if ($invoice->outstanding_amount <= 0) {
                return;
            }

            $daysPastDue = $invoice->due_at === null ? 0 : max(0, Carbon::parse($invoice->due_at)->diffInDays(today(), false));
            $bucket = match (true) {
                $daysPastDue === 0 => 'current',
                $daysPastDue <= 30 => '1_30',
                $daysPastDue <= 60 => '31_60',
                $daysPastDue <= 90 => '61_90',
                default => 'over_90',
            };
            $aging[$bucket] += (int) $invoice->outstanding_amount;
        });

        return [
            'currency' => $matter->currency ?? 'IDR',
            'budget_amount' => $matter->budget_amount,
            'quotation_amount' => $quotationAmount,
            'invoiced_amount' => $invoicedAmount,
            'payment_received_amount' => $paidAmount,
            'total_cash_inflow' => $paymentAmount,
            'unallocated_payment_amount' => max(0, $paymentAmount - $paidAmount),
            'expense_amount' => $expenseAmount,
            'receivable_amount' => $receivableAmount,
            'overdue_amount' => $aging['1_30'] + $aging['31_60'] + $aging['61_90'] + $aging['over_90'],
            'aging' => $aging,
            'margin_amount' => $paidAmount - $expenseAmount,
            'net_cash_flow' => $paymentAmount - $expenseAmount,
        ];
    }

    /**
     * @param  Collection<int, Matter>|EloquentCollection<int, Matter>  $matters
     * @return array<string, int|string|array<string, int>>
     */
    public function forCollection(Collection|EloquentCollection $matters): array
    {
        $matterIds = $matters->pluck('id');
        $invoices = Invoice::query()
            ->where(fn ($q) => $q->whereIn('matter_id', $matterIds)->orWhereNull('matter_id'))
            ->whereNotIn('status', ['cancelled', 'draft']);
        $invoicedAmount = (int) (clone $invoices)->sum('total_amount');
        $paidAmount = (int) (clone $invoices)->sum('paid_amount');
        $receivableAmount = (int) $invoices->sum('outstanding_amount');
        $expenseAmount = (int) Expense::query()
            ->where(fn ($q) => $q->whereIn('matter_id', $matterIds)->orWhereNull('matter_id'))
            ->whereNotIn('status', ['cancelled', 'draft'])
            ->sum('amount');
        $quotationAmount = (int) Quotation::query()
            ->where(fn ($q) => $q->whereIn('matter_id', $matterIds)->orWhereNull('matter_id'))
            ->whereNotIn('status', ['cancelled', 'draft'])
            ->sum('total_amount');
        $paymentAmount = (int) Payment::query()
            ->where(fn ($q) => $q->whereIn('matter_id', $matterIds)->orWhereNull('matter_id'))
            ->whereNull('reversed_at')
            ->whereNull('refunded_at')
            ->sum('amount');
        $aging = ['current' => 0, '1_30' => 0, '31_60' => 0, '61_90' => 0, 'over_90' => 0];
        (clone $invoices)->get(['due_at', 'outstanding_amount'])->each(function (Invoice $invoice) use (&$aging): void {
            if ($invoice->outstanding_amount <= 0) {
                return;
            }

            $daysPastDue = $invoice->due_at === null ? 0 : max(0, Carbon::parse($invoice->due_at)->diffInDays(today(), false));
            $bucket = match (true) {
                $daysPastDue === 0 => 'current',
                $daysPastDue <= 30 => '1_30',
                $daysPastDue <= 60 => '31_60',
                $daysPastDue <= 90 => '61_90',
                default => 'over_90',
            };
            $aging[$bucket] += (int) $invoice->outstanding_amount;
        });

        return [
            'currency' => 'IDR',
            'budget_amount' => (int) $matters->sum('budget_amount'),
            'quotation_amount' => $quotationAmount,
            'invoiced_amount' => $invoicedAmount,
            'payment_received_amount' => $paidAmount,
            'total_cash_inflow' => $paymentAmount,
            'unallocated_payment_amount' => max(0, $paymentAmount - $paidAmount),
            'expense_amount' => $expenseAmount,
            'receivable_amount' => $receivableAmount,
            'overdue_amount' => $aging['1_30'] + $aging['31_60'] + $aging['61_90'] + $aging['over_90'],
            'aging' => $aging,
            'margin_amount' => $paidAmount - $expenseAmount,
            'net_cash_flow' => $paymentAmount - $expenseAmount,
        ];
    }
}
