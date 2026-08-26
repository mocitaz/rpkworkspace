<?php

namespace App\Http\Controllers;

use App\Actions\ApproveQuotation;
use App\Actions\CreateExpense;
use App\Actions\CreateFinanceProofDocument;
use App\Actions\CreateInvoice;
use App\Actions\CreateQuotation;
use App\Actions\GenerateDocumentNumber;
use App\Actions\RecordPayment;
use App\Actions\RefundPayment;
use App\Actions\ReversePayment;
use App\Actions\TransitionInvoice;
use App\Http\Requests\ApproveQuotationRequest;
use App\Http\Requests\RefundPaymentRequest;
use App\Http\Requests\ReversePaymentRequest;
use App\Http\Requests\StoreAccountTransferRequest;
use App\Http\Requests\StoreClientTrustFundRequest;
use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\StoreFinancialAccountRequest;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\StorePartnerTransactionRequest;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\StorePayrollRequest;
use App\Http\Requests\StoreQuotationRequest;
use App\Http\Requests\TransitionInvoiceRequest;
use App\Models\AccountTransfer;
use App\Models\Client;
use App\Models\ClientTrustFund;
use App\Models\Expense;
use App\Models\FinancialAccount;
use App\Models\Invoice;
use App\Models\Matter;
use App\Models\PartnerTransaction;
use App\Models\Payment;
use App\Models\Payroll;
use App\Models\Quotation;
use App\Models\User;
use App\Notifications\PaymentVerificationRequestedNotification;
use App\Services\AuditService;
use App\Services\FirmFinancialAuditExportService;
use App\Services\FirmFinancialStatementService;
use App\Services\MatterFinancialOverview;
use App\Services\PdfRenderer;
use App\WorkflowStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class FinanceController extends Controller
{
    public function index(Request $request, MatterFinancialOverview $overview, FirmFinancialStatementService $statementService): Response
    {
        Gate::authorize('viewAny', Matter::class);
        abort_unless($request->user()->hasPermission('billing.view'), 403);

        $matters = Matter::query()->visibleTo($request->user())->with('client:id,display_name')->latest('updated_at')->get();
        $selectedMatterId = $request->string('matter_id')->toString();
        $selectedMatter = ! empty($selectedMatterId)
            ? ($matters->firstWhere('id', $selectedMatterId) ?? Matter::query()->visibleTo($request->user())->with('client:id,display_name')->find($selectedMatterId))
            : null;

        $visibleMatterIds = $matters->pluck('id');

        $financialOverview = $selectedMatter
            ? $overview->for($selectedMatter)
            : $overview->forCollection($matters);

        $invoiceQuery = Invoice::query();
        $quotationQuery = Quotation::query();
        $expenseQuery = Expense::query();
        $paymentQuery = Payment::query();
        $clientTrustQuery = ClientTrustFund::query();

        $targetMatters = $selectedMatter ? collect([$selectedMatter]) : $matters;

        if ($selectedMatter) {
            $invoiceQuery->where('matter_id', $selectedMatter->getKey());
            $quotationQuery->where('matter_id', $selectedMatter->getKey());
            $expenseQuery->where('matter_id', $selectedMatter->getKey());
            $paymentQuery->where('matter_id', $selectedMatter->getKey());
            $clientTrustQuery->where('matter_id', $selectedMatter->getKey());
        } else {
            $invoiceQuery->where(fn ($q) => $q->whereIn('matter_id', $visibleMatterIds)->orWhereNull('matter_id'));
            $quotationQuery->where(fn ($q) => $q->whereIn('matter_id', $visibleMatterIds)->orWhereNull('matter_id'));
            $expenseQuery->where(fn ($q) => $q->whereIn('matter_id', $visibleMatterIds)->orWhereNull('matter_id'));
            $paymentQuery->where(fn ($q) => $q->whereIn('matter_id', $visibleMatterIds)->orWhereNull('matter_id'));
            $clientTrustQuery->whereIn('matter_id', $visibleMatterIds);
        }

        $year = (int) ($request->input('year') ?: date('Y'));

        return Inertia::render('finance/index', [
            'matters' => $matters->map(fn (Matter $matter) => [
                'id' => $matter->getKey(), 'matter_number' => $matter->matter_number,
                'title' => $matter->title, 'client' => $matter->client?->display_name,
                'budget_amount' => (int) ($matter->budget_amount ?? 0),
            ]),
            'clients' => Client::query()->where('status', 'active')->orderBy('display_name')->get(['id', 'display_name']),
            'overview' => $financialOverview,
            'selectedMatterId' => $selectedMatter?->getKey() ?? '',
            'invoices' => $invoiceQuery->with('matter:id,matter_number,title')->latest()->limit(50)->get(),
            'quotations' => $quotationQuery->with('matter:id,matter_number,title')->latest()->limit(50)->get(),
            'expenses' => $expenseQuery->with(['matter:id,matter_number,title', 'account:id,name', 'partner:id,name'])->latest('incurred_at')->limit(50)->get(),
            'payments' => $paymentQuery->with(['matter:id,matter_number,title', 'account:id,name', 'allocations.invoice:id,invoice_number,outstanding_amount,currency'])->latest('received_at')->limit(50)->get(),

            // Multi-Kas & Accounts
            'accounts' => FinancialAccount::query()->with('partner:id,name,email')->orderBy('type')->get(),
            'transfers' => AccountTransfer::query()->with(['fromAccount:id,name', 'toAccount:id,name', 'creator:id,name'])->latest('transferred_at')->limit(50)->get(),

            // Partner Advances & Transactions
            'partnerTransactions' => PartnerTransaction::query()->with(['partner:id,name', 'matter:id,matter_number,title', 'account:id,name'])->latest('transaction_date')->limit(50)->get(),
            'partnerAdvances' => $statementService->getPartnerAdvances(),

            // Client Trust Funds (Escrow)
            'clientTrustFunds' => $clientTrustQuery->with(['client:id,display_name', 'matter:id,matter_number,title', 'account:id,name'])->latest('transaction_date')->limit(50)->get(),
            'clientTrustSummary' => $statementService->getClientTrustSummary($selectedMatter?->getKey()),

            // Payrolls
            'payrolls' => Payroll::query()->with(['user:id,name,position_title,department,employee_code', 'paymentAccount:id,name'])->latest('period')->limit(50)->get(),

            // Reports & Profitability
            'profitability' => $statementService->getProfitability($targetMatters),
            'incomeStatement' => $statementService->getIncomeStatement($year),
            'balanceSheet' => $statementService->getBalanceSheet(),
            'staffUsers' => User::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'position_title', 'department', 'employee_code', 'bank_name', 'bank_account_number']),

            'can' => [
                'invoice' => $request->user()->hasPermission('billing.manage'),
                'quotation' => $request->user()->hasPermission('quotation.manage'),
                'quotationApprove' => $request->user()->hasPermission('quotation.approve'),
                'expense' => $request->user()->hasPermission('expense.manage'),
                'payment' => $request->user()->hasPermission('payment.manage'),
                'invoiceTransition' => $request->user()->hasPermission('billing.manage'),
            ],
        ]);
    }

    public function storeInvoice(StoreInvoiceRequest $request, CreateInvoice $create, GenerateDocumentNumber $numbers, AuditService $audit): RedirectResponse
    {
        $this->authorizeMatter($request, $request->validated('matter_id'));
        $invoice = $create->handle($request->validated(), $request->user(), $numbers);
        $audit->record($invoice, 'invoice.created', [], $request->user(), $request);

        return back()->with('success', 'Invoice '.$invoice->invoice_number.' berhasil dibuat.');
    }

    public function storeQuotation(StoreQuotationRequest $request, CreateQuotation $create, GenerateDocumentNumber $numbers, AuditService $audit): RedirectResponse
    {
        $this->authorizeMatter($request, $request->validated('matter_id'));
        $quotation = $create->handle($request->validated(), $request->user(), $numbers);
        $audit->record($quotation, 'quotation.created', [], $request->user(), $request);

        return back()->with('success', 'Quotation '.$quotation->quotation_number.' berhasil dibuat.');
    }

    public function transitionInvoice(TransitionInvoiceRequest $request, Invoice $invoice, TransitionInvoice $transition): RedirectResponse
    {
        $this->authorizeFinanceAccess($request, $invoice->matter);
        $transition->handle($invoice, WorkflowStatus::from($request->validated('status')), $request->user(), $request->validated('reason'));

        return back()->with('success', 'Status invoice '.$invoice->invoice_number.' diperbarui.');
    }

    public function approveQuotation(ApproveQuotationRequest $request, Quotation $quotation, ApproveQuotation $approve): RedirectResponse
    {
        $this->authorizeFinanceAccess($request, $quotation->matter);
        $approve->handle($quotation, $request->user(), $request->validated('note'));

        return back()->with('success', 'Quotation '.$quotation->quotation_number.' disetujui.');
    }

    public function storeExpense(StoreExpenseRequest $request, CreateExpense $create, CreateFinanceProofDocument $createProof, AuditService $audit): RedirectResponse
    {
        $matterId = $request->validated('matter_id');
        $matter = null;
        if (! empty($matterId)) {
            $this->authorizeMatter($request, $matterId);
            $matter = Matter::query()->whereKey($matterId)->first();
        } else {
            $this->authorizeFinanceAccess($request, null);
        }

        $attributes = $request->safe()->except('proof');
        if ($request->hasFile('proof')) {
            $proof = $createProof->handle($request->file('proof'), $request->user(), 'Bukti biaya: '.$attributes['description'], $matter);
            $attributes['proof_document_id'] = $proof->getKey();
        }

        $expense = $create->handle($attributes, $request->user());

        // Update account balance
        if (! empty($attributes['account_id'])) {
            $account = FinancialAccount::query()->find($attributes['account_id']);
            if ($account) {
                $account->decrement('current_balance', (int) $attributes['amount']);
            }
        } elseif (! empty($attributes['partner_id'])) {
            $partnerAccount = FinancialAccount::query()->where('partner_id', $attributes['partner_id'])->first();
            if ($partnerAccount) {
                $partnerAccount->increment('current_balance', (int) $attributes['amount']);
            }
        }

        $audit->record($expense, 'expense.created', [], $request->user(), $request);

        return back()->with('success', 'Biaya pengeluaran berhasil dicatat.');
    }

    public function destroyExpense(Expense $expense, AuditService $audit): RedirectResponse
    {
        $this->authorizeFinanceAccess(request(), $expense->matter);
        abort_unless(request()->user()->hasPermission('expense.manage'), 403);

        $description = $expense->description;
        $amount = $expense->amount;
        $accountId = $expense->account_id;
        $partnerId = $expense->partner_id;

        $expense->delete();

        if ($accountId) {
            FinancialAccount::query()->where('id', $accountId)->increment('current_balance', $amount);
        } elseif ($partnerId) {
            FinancialAccount::query()->where('partner_id', $partnerId)->decrement('current_balance', $amount);
        }

        $audit->record($expense, 'expense.deleted', [
            'description' => $description,
            'amount' => $amount,
        ], request()->user(), request());

        return back()->with('success', 'Biaya pengeluaran operasional berhasil dihapus.');
    }

    public function storePayment(StorePaymentRequest $request, RecordPayment $record, CreateFinanceProofDocument $createProof, AuditService $audit): RedirectResponse
    {
        $this->authorizeMatter($request, $request->validated('matter_id'));
        $attributes = $request->safe()->except('proof');
        $matter = isset($attributes['matter_id']) ? Matter::query()->whereKey($attributes['matter_id'])->sole() : null;
        $client = Client::query()->whereKey($attributes['client_id'])->sole();
        if ($request->hasFile('proof')) {
            $proof = $createProof->handle($request->file('proof'), $request->user(), 'Bukti pembayaran '.$attributes['amount'], $matter, $client);
            $attributes['proof_document_id'] = $proof->getKey();
        }

        $gross = (int) ($attributes['gross_amount'] ?? $attributes['amount']);
        $tax = (int) ($attributes['tax_withheld'] ?? 0);
        $attributes['net_amount'] = $attributes['amount'];

        $payment = $record->handle($attributes, $request->user(), $audit);

        // Update account balance
        if (! empty($attributes['account_id'])) {
            FinancialAccount::query()->where('id', $attributes['account_id'])->increment('current_balance', (int) $attributes['amount']);
        }

        $financeUsers = User::query()->where('is_active', true)->where('id', '!=', $request->user()->getKey())->get();
        foreach ($financeUsers as $financeUser) {
            $financeUser->notify((new PaymentVerificationRequestedNotification(
                invoiceNumber: 'PAY-'.($payment->payment_number ?? $payment->id),
                clientName: $client->display_name,
                amountPaid: 'Rp '.number_format((float) ($attributes['amount'] ?? 0), 0, ',', '.'),
                paymentMethod: ucfirst(str_replace('_', ' ', $attributes['payment_method'] ?? 'Transfer Bank')),
                paymentDate: now()->translatedFormat('d F Y')
            ))->afterCommit());
        }

        return back()->with('success', 'Pembayaran berhasil dicatat.');
    }

    public function reversePayment(ReversePaymentRequest $request, Payment $payment, ReversePayment $reverse): RedirectResponse
    {
        $this->authorizeFinanceAccess($request, $payment->matter);
        $reverse->handle($payment, $request->user(), $request->validated('reason'));

        if ($payment->account_id) {
            FinancialAccount::query()->where('id', $payment->account_id)->decrement('current_balance', $payment->amount);
        }

        return back()->with('success', 'Pembayaran dibatalkan dan alokasi invoice dikoreksi.');
    }

    public function refundPayment(RefundPaymentRequest $request, Payment $payment, RefundPayment $refund): RedirectResponse
    {
        $this->authorizeFinanceAccess($request, $payment->matter);
        $refund->handle($payment, $request->user(), $request->validated('reason'));

        if ($payment->account_id) {
            FinancialAccount::query()->where('id', $payment->account_id)->decrement('current_balance', $payment->amount);
        }

        return back()->with('success', 'Refund pembayaran dicatat dan alokasi invoice dikoreksi.');
    }

    public function storeAccount(StoreFinancialAccountRequest $request, AuditService $audit): RedirectResponse
    {
        $data = $request->validated();
        $account = FinancialAccount::query()->create([
            ...$data,
            'current_balance' => $data['opening_balance'],
            'created_by' => $request->user()->getKey(),
        ]);

        $audit->record($account, 'financial_account.created', [], $request->user(), $request);

        return back()->with('success', 'Akun Kas/Bank "'.$account->name.'" berhasil dibuat.');
    }

    public function storeTransfer(StoreAccountTransferRequest $request, CreateFinanceProofDocument $createProof, AuditService $audit): RedirectResponse
    {
        $data = $request->validated();
        $transferNumber = 'TRF-'.date('Ymd').'-'.strtoupper(substr(uniqid(), -4));

        $proofId = null;
        if ($request->hasFile('proof')) {
            $proof = $createProof->handle($request->file('proof'), $request->user(), 'Bukti transfer: '.$transferNumber);
            $proofId = $proof->getKey();
        }

        DB::transaction(function () use ($data, $transferNumber, $proofId, $request, $audit) {
            $fromAcc = FinancialAccount::query()->whereKey($data['from_account_id'])->lockForUpdate()->sole();
            $toAcc = FinancialAccount::query()->whereKey($data['to_account_id'])->lockForUpdate()->sole();

            $amount = (int) $data['amount'];
            $fromAcc->decrement('current_balance', $amount);
            $toAcc->increment('current_balance', $amount);

            $transfer = AccountTransfer::query()->create([
                'transfer_number' => $transferNumber,
                'from_account_id' => $fromAcc->getKey(),
                'to_account_id' => $toAcc->getKey(),
                'amount' => $amount,
                'transferred_at' => $data['transferred_at'],
                'reference_number' => $data['reference_number'] ?? null,
                'notes' => $data['notes'] ?? null,
                'proof_document_id' => $proofId,
                'status' => 'completed',
                'approved_by' => $request->user()->getKey(),
                'approved_at' => now(),
                'created_by' => $request->user()->getKey(),
            ]);

            $audit->record($transfer, 'account_transfer.created', [], $request->user(), $request);
        });

        return back()->with('success', 'Transfer dana antar kas/bank berhasil dicatat.');
    }

    public function storePartnerTransaction(StorePartnerTransactionRequest $request, CreateFinanceProofDocument $createProof, AuditService $audit): RedirectResponse
    {
        $data = $request->validated();
        $transNumber = 'PTR-'.date('Ymd').'-'.strtoupper(substr(uniqid(), -4));

        $proofId = null;
        if ($request->hasFile('proof')) {
            $proof = $createProof->handle($request->file('proof'), $request->user(), 'Bukti transaksi partner: '.$transNumber);
            $proofId = $proof->getKey();
        }

        DB::transaction(function () use ($data, $transNumber, $proofId, $request, $audit) {
            $amount = (int) $data['amount'];
            $partnerId = $data['partner_id'];
            $type = $data['type'];
            $accountId = $data['account_id'] ?? null;

            // Balance adjustment based on transaction type
            if ($type === 'advance_incurred') {
                // Partner spent their personal money
                $partnerAcc = FinancialAccount::query()->where('partner_id', $partnerId)->first();
                if ($partnerAcc) {
                    $partnerAcc->increment('current_balance', $amount);
                }
            } elseif ($type === 'advance_reimbursed') {
                // Firm repaid partner from cash/bank
                if ($accountId) {
                    FinancialAccount::query()->whereKey($accountId)->decrement('current_balance', $amount);
                }
                $partnerAcc = FinancialAccount::query()->where('partner_id', $partnerId)->first();
                if ($partnerAcc) {
                    $partnerAcc->decrement('current_balance', $amount);
                }
            } elseif (in_array($type, ['profit_distribution', 'draw_prive']) && $accountId) {
                // Cash out to partner
                FinancialAccount::query()->whereKey($accountId)->decrement('current_balance', $amount);
            } elseif ($type === 'capital_injection' && $accountId) {
                // Partner injected cash into firm account
                FinancialAccount::query()->whereKey($accountId)->increment('current_balance', $amount);
            }

            $partnerTrans = PartnerTransaction::query()->create([
                'transaction_number' => $transNumber,
                'partner_id' => $partnerId,
                'matter_id' => $data['matter_id'] ?? null,
                'type' => $type,
                'amount' => $amount,
                'transaction_date' => $data['transaction_date'],
                'account_id' => $accountId,
                'proof_document_id' => $proofId,
                'notes' => $data['notes'] ?? null,
                'status' => 'approved',
                'approved_by' => $request->user()->getKey(),
                'approved_at' => now(),
                'created_by' => $request->user()->getKey(),
            ]);

            $audit->record($partnerTrans, 'partner_transaction.created', [], $request->user(), $request);
        });

        return back()->with('success', 'Transaksi hak & talangan partner berhasil dicatat.');
    }

    public function storeClientTrustFund(StoreClientTrustFundRequest $request, CreateFinanceProofDocument $createProof, AuditService $audit): RedirectResponse
    {
        $data = $request->validated();
        $transNumber = 'CTF-'.date('Ymd').'-'.strtoupper(substr(uniqid(), -4));

        $proofId = null;
        if ($request->hasFile('proof')) {
            $proof = $createProof->handle($request->file('proof'), $request->user(), 'Bukti dana titipan: '.$transNumber);
            $proofId = $proof->getKey();
        }

        DB::transaction(function () use ($data, $transNumber, $proofId, $request, $audit) {
            $amount = (int) $data['amount'];
            $type = $data['type'];
            $account = FinancialAccount::query()->whereKey($data['account_id'])->lockForUpdate()->sole();

            if ($type === 'deposit_in') {
                $account->increment('current_balance', $amount);
            } else {
                $account->decrement('current_balance', $amount);
            }

            $trustFund = ClientTrustFund::query()->create([
                'transaction_number' => $transNumber,
                'client_id' => $data['client_id'],
                'matter_id' => $data['matter_id'] ?? null,
                'account_id' => $account->getKey(),
                'type' => $type,
                'amount' => $amount,
                'transaction_date' => $data['transaction_date'],
                'purpose' => $data['purpose'],
                'recipient_party' => $data['recipient_party'] ?? null,
                'proof_document_id' => $proofId,
                'notes' => $data['notes'] ?? null,
                'status' => 'approved',
                'approved_by' => $request->user()->getKey(),
                'approved_at' => now(),
                'created_by' => $request->user()->getKey(),
            ]);

            $audit->record($trustFund, 'client_trust_fund.created', [], $request->user(), $request);
        });

        return back()->with('success', 'Mutasi dana titipan klien berhasil dicatat.');
    }

    public function storePayroll(StorePayrollRequest $request, AuditService $audit): RedirectResponse
    {
        $data = $request->validated();
        $user = User::query()->whereKey($data['user_id'])->sole();
        $payslipNumber = 'PAY-'.str_replace('-', '', $data['period']).'-'.str_pad((string) $user->getKey(), 3, '0', STR_PAD_LEFT);

        $totalEarnings = (int) $data['basic_salary'] + (int) ($data['fixed_allowance'] ?? 0)
            + (int) ($data['transport_meal_allowance'] ?? 0) + (int) ($data['overtime_amount'] ?? 0)
            + (int) ($data['bonus_amount'] ?? 0);

        $totalDeductions = (int) ($data['deductions_amount'] ?? 0) + (int) ($data['tax_deduction_amount'] ?? 0);
        $netSalary = max(0, $totalEarnings - $totalDeductions);

        $payroll = Payroll::query()->updateOrCreate(
            ['user_id' => $user->getKey(), 'period' => $data['period']],
            [
                'payslip_number' => $payslipNumber,
                'basic_salary' => (int) $data['basic_salary'],
                'fixed_allowance' => (int) ($data['fixed_allowance'] ?? 0),
                'transport_meal_allowance' => (int) ($data['transport_meal_allowance'] ?? 0),
                'overtime_amount' => (int) ($data['overtime_amount'] ?? 0),
                'bonus_amount' => (int) ($data['bonus_amount'] ?? 0),
                'deductions_amount' => (int) ($data['deductions_amount'] ?? 0),
                'tax_deduction_amount' => (int) ($data['tax_deduction_amount'] ?? 0),
                'net_salary' => $netSalary,
                'status' => $data['status'],
                'payment_account_id' => $data['payment_account_id'] ?? null,
                'paid_at' => $data['status'] === 'paid' ? now() : null,
                'approved_by' => in_array($data['status'], ['approved', 'paid']) ? $request->user()->getKey() : null,
                'approved_at' => in_array($data['status'], ['approved', 'paid']) ? now() : null,
                'notes' => $data['notes'] ?? null,
                'created_by' => $request->user()->getKey(),
            ]
        );

        if ($data['status'] === 'paid' && ! empty($data['payment_account_id'])) {
            FinancialAccount::query()->where('id', $data['payment_account_id'])->decrement('current_balance', $netSalary);
        }

        $audit->record($payroll, 'payroll.created', [], $request->user(), $request);

        return back()->with('success', 'Gaji '.$user->name.' untuk periode '.$data['period'].' berhasil disimpan.');
    }

    public function updatePayrollStatus(Request $request, Payroll $payroll, AuditService $audit): RedirectResponse
    {
        abort_unless($request->user()->hasPermission('billing.manage'), 403);
        $status = $request->validate(['status' => 'required|in:approved,paid'])['status'];

        $oldStatus = $payroll->status;
        $payroll->update([
            'status' => $status,
            'approved_by' => $request->user()->getKey(),
            'approved_at' => now(),
            'paid_at' => $status === 'paid' ? now() : $payroll->paid_at,
        ]);

        if ($status === 'paid' && $oldStatus !== 'paid' && $payroll->payment_account_id) {
            FinancialAccount::query()->where('id', $payroll->payment_account_id)->decrement('current_balance', $payroll->net_salary);
        }

        $audit->record($payroll, 'payroll.status_updated', ['status' => $status], $request->user(), $request);

        return back()->with('success', 'Status slip gaji '.$payroll->payslip_number.' diperbarui menjadi '.ucfirst($status).'.');
    }

    public function downloadPayslip(Request $request, Payroll $payroll, PdfRenderer $pdfRenderer, AuditService $audit): HttpResponse
    {
        abort_unless($request->user()->hasPermission('billing.view'), 403);
        $payroll->loadMissing(['user', 'paymentAccount']);

        $pdf = $pdfRenderer->render('pdf.payslip', ['payroll' => $payroll]);
        $audit->record($payroll, 'payroll.pdf_downloaded', [], $request->user(), $request);

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$payroll->payslip_number.'.pdf"',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    public function downloadInvoice(Request $request, Invoice $invoice, PdfRenderer $pdfRenderer, AuditService $audit): HttpResponse
    {
        $invoice->loadMissing(['client', 'matter', 'lineItems']);
        $this->authorizeFinanceAccess($request, $invoice->matter);
        $audit->record($invoice, 'invoice.pdf_downloaded', [], $request->user(), $request);

        return response($pdfRenderer->render('pdf.invoice', ['invoice' => $invoice]), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$invoice->invoice_number.'.pdf"',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    public function downloadQuotation(Request $request, Quotation $quotation, PdfRenderer $pdfRenderer, AuditService $audit): HttpResponse
    {
        $quotation->loadMissing(['client', 'matter', 'lineItems']);
        $this->authorizeFinanceAccess($request, $quotation->matter);
        $audit->record($quotation, 'quotation.pdf_downloaded', [], $request->user(), $request);

        return response($pdfRenderer->render('pdf.quotation', ['quotation' => $quotation]), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$quotation->quotation_number.'.pdf"',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    public function exportExcel(Request $request, FirmFinancialAuditExportService $exportService, AuditService $audit): HttpResponse
    {
        Gate::authorize('viewAny', Matter::class);
        abort_unless($request->user()->hasPermission('billing.view'), 403);

        $year = $request->integer('year', (int) date('Y'));
        $filePath = $exportService->generateAuditWorkbook($year);

        $audit->record($request->user(), 'finance.audit_excel_downloaded', [
            'year' => $year,
        ], $request->user(), $request);

        $filename = "Laporan_Keuangan_Audit_RPK_{$year}_".now()->format('Ymd_His').'.xlsx';

        return response()->download($filePath, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'X-Content-Type-Options' => 'nosniff',
        ])->deleteFileAfterSend(true);
    }

    private function authorizeMatter(Request $request, ?string $matterId): void
    {
        if ($matterId !== null) {
            Gate::authorize('view', Matter::query()->findOrFail($matterId));
        }
    }

    private function authorizeFinanceAccess(Request $request, ?Matter $matter): void
    {
        abort_unless($request->user()->hasPermission('billing.view'), 403);

        if ($matter !== null) {
            Gate::authorize('view', $matter);
        }
    }
}
