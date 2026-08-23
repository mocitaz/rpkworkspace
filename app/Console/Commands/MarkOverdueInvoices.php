<?php

namespace App\Console\Commands;

use App\Actions\TransitionInvoice;
use App\Models\Invoice;
use App\WorkflowStatus;
use Illuminate\Console\Command;

class MarkOverdueInvoices extends Command
{
    protected $signature = 'raf:mark-overdue-invoices';

    protected $description = 'Mark sent invoices past their due date as overdue.';

    public function handle(TransitionInvoice $transition): int
    {
        Invoice::query()
            ->where('status', WorkflowStatus::Sent->value)
            ->where('outstanding_amount', '>', 0)
            ->whereDate('due_at', '<', today())
            ->where(fn ($query) => $query->whereNull('matter_id')->orWhereHas('matter', fn ($matter) => $matter->whereNull('legal_hold_at')))
            ->orderBy('id')
            ->eachById(fn (Invoice $invoice) => $transition->handle($invoice, WorkflowStatus::Overdue));

        return self::SUCCESS;
    }
}
