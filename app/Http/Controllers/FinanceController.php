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
use App\Actions\UpdateInvoice;
use App\Actions\UpdateQuotation;
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
use App\Http\Requests\UpdateExpenseRequest;
use App\Http\Requests\UpdateFinancialAccountRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Http\Requests\UpdateMatterContractRequest;
use App\Http\Requests\UpdatePartnerTransactionRequest;
use App\Http\Requests\UpdatePayrollRequest;
use App\Http\Requests\UpdateQuotationRequest;
use App\Models\AccountTransfer;
use App\Models\Client;
use App\Models\ClientTrustFund;
use App\Models\Document;
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
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class FinanceController extends Controller
{
    public function updateMatterContract(UpdateMatterContractRequest $request, Matter $matter, AuditService $audit): RedirectResponse
    {
        $before = $matter->only(['budget_amount', 'currency', 'contract_date', 'billing_model']);
        $matter->update($request->validated());

        $audit->record($matter, 'finance.matter_contract.updated', [
            'before' => $before,
            'after' => $matter->only(['budget_amount', 'currency', 'contract_date', 'billing_model']),
        ], $request->user(), $request);

        return back()->with('success', 'Informasi kontrak perkara berhasil diperbarui.');
    }

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
            $expenseQuery->where(fn ($query) => $query
                ->where('matter_id', $selectedMatter->getKey())
                ->orWhere('charge_to', 'office'));
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

        FinancialAccount::syncAllBalances();

        return Inertia::render('finance/index', [
            'matters' => $matters->map(fn (Matter $matter) => [
                'id' => $matter->getKey(), 'matter_number' => $matter->matter_number,
                'title' => $matter->title, 'client' => $matter->client?->display_name,
                'client_id' => $matter->client_id,
                'budget_amount' => (int) ($matter->budget_amount ?? 0),
            ]),
            'clients' => Client::query()->where('status', 'active')->orderBy('display_name')->get(['id', 'display_name']),
            'overview' => $financialOverview,
            'selectedMatterId' => $selectedMatter?->getKey() ?? '',
            'invoices' => $invoiceQuery->with(['matter:id,matter_number,title', 'lineItems', 'proofDocument.currentVersion'])->latest()->limit(50)->get(),
            'quotations' => $quotationQuery->with(['matter:id,matter_number,title', 'lineItems'])->latest()->limit(50)->get(),
            'expenses' => $expenseQuery->with(['matter:id,matter_number,title', 'account:id,name', 'partner:id,name', 'proofDocument.currentVersion'])->latest('incurred_at')->limit(50)->get(),
            'payments' => $paymentQuery->with(['matter:id,matter_number,title', 'account:id,name', 'allocations.invoice:id,invoice_number,outstanding_amount,currency', 'proofDocument.currentVersion'])->latest('received_at')->limit(50)->get(),

            // Multi-Kas & Accounts
            'accounts' => FinancialAccount::query()
                ->with([
                    'partner:id,name,email,avatar_path,position_title,department',
                    'creator:id,name',
                ])
                ->withCount([
                    'expenses',
                    'payments',
                    'outgoingTransfers',
                    'incomingTransfers',
                    'partnerTransactions',
                    'clientTrustFunds',
                    'payrolls',
                ])
                ->orderBy('type')
                ->get(),
            'transfers' => AccountTransfer::query()->with(['fromAccount:id,name', 'toAccount:id,name', 'creator:id,name', 'proofDocument.currentVersion'])->latest('transferred_at')->limit(50)->get(),

            // Partner Advances & Transactions
            'partnerTransactions' => PartnerTransaction::query()->with(['partner:id,name,email,avatar_path,position_title,department', 'matter:id,matter_number,title', 'account:id,name', 'proofDocument.currentVersion'])->latest('transaction_date')->limit(50)->get(),
            'partnerAdvances' => $statementService->getPartnerAdvances(),

            // Client Trust Funds (Escrow)
            'clientTrustFunds' => $clientTrustQuery->with(['client:id,display_name', 'matter:id,matter_number,title', 'account:id,name', 'proofDocument.currentVersion'])->latest('transaction_date')->limit(50)->get(),
            'clientTrustSummary' => $statementService->getClientTrustSummary($selectedMatter?->getKey()),

            // Payrolls
            'payrolls' => Payroll::query()->with([
                'user:id,name,email,avatar_path,position_title,department,employee_code,bank_name,bank_account_number,bank_account_holder',
                'paymentAccount:id,name',
                'proofDocument.currentVersion',
            ])->latest('period')->limit(50)->get(),

            // Reports & Profitability
            'profitability' => $statementService->getProfitability($targetMatters),
            'incomeStatement' => $statementService->getIncomeStatement($year),
            'balanceSheet' => $statementService->getBalanceSheet(),
            'staffUsers' => User::query()->where('is_active', true)->orderBy('name')->get([
                'id', 'name', 'email', 'avatar_path', 'position_title', 'department', 'employee_code', 'bank_name', 'bank_account_number', 'bank_account_holder',
            ]),

            'can' => [
                'invoice' => $request->user()->hasPermission('billing.manage'),
                'quotation' => $request->user()->hasPermission('quotation.manage'),
                'quotationApprove' => $request->user()->hasPermission('quotation.approve'),
                'expense' => $request->user()->hasPermission('expense.manage'),
                'payment' => $request->user()->hasPermission('payment.manage'),
                'invoiceTransition' => $request->user()->hasPermission('billing.manage'),
                'matterContract' => $request->user()->hasPermission('billing.manage'),
                'account' => $request->user()->hasPermission('billing.manage'),
            ],
        ]);
    }

    public function storeInvoice(StoreInvoiceRequest $request, CreateInvoice $create, CreateFinanceProofDocument $createProof, GenerateDocumentNumber $numbers, AuditService $audit): RedirectResponse
    {
        $this->authorizeMatter($request, $request->validated('matter_id'));
        $data = $request->safe()->except('proof');
        $invoice = $create->handle($data, $request->user(), $numbers);

        if ($request->hasFile('proof')) {
            $proof = $createProof->handle($request->file('proof'), $request->user(), 'Faktur/Invoice '.$invoice->invoice_number, $invoice->matter, $invoice->client);
            $invoice->update(['proof_document_id' => $proof->getKey()]);
        }

        $audit->record($invoice, 'invoice.created', [], $request->user(), $request);

        return back()->with('success', 'Invoice '.$invoice->invoice_number.' berhasil dibuat.');
    }

    public function updateInvoice(UpdateInvoiceRequest $request, Invoice $invoice, UpdateInvoice $update, CreateFinanceProofDocument $createProof, AuditService $audit): RedirectResponse
    {
        $this->authorizeFinanceAccess($request, $invoice->matter);
        $data = $request->safe()->except('proof');
        $updatedInvoice = $update->handle($invoice, $data, $request->user());

        if ($request->hasFile('proof')) {
            $proof = $createProof->handle($request->file('proof'), $request->user(), 'Faktur/Invoice '.$updatedInvoice->invoice_number, $updatedInvoice->matter, $updatedInvoice->client);
            $updatedInvoice->update(['proof_document_id' => $proof->getKey()]);
        }

        $audit->record($updatedInvoice, 'invoice.updated', [], $request->user(), $request);

        return back()->with('success', 'Invoice '.$updatedInvoice->invoice_number.' berhasil diperbarui.');
    }

    public function storeQuotation(StoreQuotationRequest $request, CreateQuotation $create, GenerateDocumentNumber $numbers, AuditService $audit): RedirectResponse
    {
        $this->authorizeMatter($request, $request->validated('matter_id'));
        $quotation = $create->handle($request->validated(), $request->user(), $numbers);
        $audit->record($quotation, 'quotation.created', [], $request->user(), $request);

        return back()->with('success', 'Quotation '.$quotation->quotation_number.' berhasil dibuat.');
    }

    public function updateQuotation(UpdateQuotationRequest $request, Quotation $quotation, UpdateQuotation $update, AuditService $audit): RedirectResponse
    {
        $this->authorizeFinanceAccess($request, $quotation->matter);
        $updatedQuotation = $update->handle($quotation, $request->validated(), $request->user());
        $audit->record($updatedQuotation, 'quotation.updated', [], $request->user(), $request);

        return back()->with('success', 'Quotation '.$updatedQuotation->quotation_number.' berhasil diperbarui.');
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

    public function updateExpense(UpdateExpenseRequest $request, Expense $expense, CreateFinanceProofDocument $createProof, AuditService $audit): RedirectResponse
    {
        $this->authorizeFinanceAccess($request, $expense->matter);
        abort_unless($request->user()->hasPermission('expense.manage'), 403);

        $matterId = $request->validated('matter_id');
        $matter = null;
        if (! empty($matterId)) {
            $this->authorizeMatter($request, $matterId);
            $matter = Matter::query()->whereKey($matterId)->first();
        }

        $attributes = $request->safe()->except('proof');
        if ($request->hasFile('proof')) {
            $proof = $createProof->handle($request->file('proof'), $request->user(), 'Bukti biaya: '.$attributes['description'], $matter);
            $attributes['proof_document_id'] = $proof->getKey();
        }

        DB::transaction(function () use ($expense, $attributes, $request, $audit) {
            $oldAmount = (int) $expense->amount;
            $oldAccountId = $expense->account_id;
            $oldPartnerId = $expense->partner_id;

            $newAmount = (int) $attributes['amount'];
            $newAccountId = $attributes['account_id'] ?? null;
            $newPartnerId = $attributes['partner_id'] ?? null;

            // Revert previous balance impact
            if ($oldAccountId) {
                FinancialAccount::query()->where('id', $oldAccountId)->increment('current_balance', $oldAmount);
            } elseif ($oldPartnerId) {
                FinancialAccount::query()->where('partner_id', $oldPartnerId)->decrement('current_balance', $oldAmount);
            }

            // Apply new balance impact
            if ($newAccountId) {
                FinancialAccount::query()->where('id', $newAccountId)->decrement('current_balance', $newAmount);
            } elseif ($newPartnerId) {
                FinancialAccount::query()->where('partner_id', $newPartnerId)->increment('current_balance', $newAmount);
            }

            $expense->update($attributes);

            $audit->record($expense, 'expense.updated', [
                'amount' => $newAmount,
                'description' => $expense->description,
            ], $request->user(), $request);
        });

        return back()->with('success', 'Biaya pengeluaran berhasil diperbarui.');
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

        $financeUsers = User::query()
            ->where('is_active', true)
            ->where('id', '!=', $request->user()->getKey())
            ->whereHas('roles.permissions', fn ($query) => $query->where('name', 'payment.manage'))
            ->get();
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

    public function updateAccount(UpdateFinancialAccountRequest $request, FinancialAccount $account, AuditService $audit): RedirectResponse
    {
        $data = $request->validated();
        $oldAttributes = [
            'name' => $account->name,
            'bank_name' => $account->bank_name,
            'account_number' => $account->account_number,
            'partner_id' => $account->partner_id,
            'description' => $account->description,
        ];

        $account->update([
            'name' => $data['name'],
            'bank_name' => $data['bank_name'] ?? null,
            'account_number' => $data['account_number'] ?? null,
            'partner_id' => $data['partner_id'] ?? null,
            'description' => $data['description'] ?? null,
        ]);

        $audit->record($account, 'financial_account.updated', [
            'old' => $oldAttributes,
            'new' => $data,
        ], $request->user(), $request);

        return back()->with('success', 'Akun Kas/Bank "'.$account->name.'" berhasil diperbarui.');
    }

    public function destroyAccount(Request $request, FinancialAccount $account, AuditService $audit): RedirectResponse
    {
        abort_unless($request->user()->hasPermission('billing.manage'), 403);

        $data = $request->validate([
            'mode' => ['required', 'string', 'in:transfer,direct_delete'],
            'target_account_id' => [
                'nullable',
                Rule::requiredIf($request->input('mode') === 'transfer'),
                Rule::exists('financial_accounts', 'id')->whereNot('id', $account->getKey()),
            ],
        ], [
            'mode.required' => 'Metode penghapusan wajib dipilih.',
            'mode.in' => 'Metode penghapusan tidak valid.',
            'target_account_id.required' => 'Rekening tujuan wajib dipilih untuk pengalihan saldo & transaksi.',
            'target_account_id.exists' => 'Rekening tujuan tidak valid atau tidak boleh sama dengan rekening yang akan dihapus.',
        ]);

        $accountName = $account->name;
        $mode = $data['mode'];

        DB::transaction(function () use ($account, $accountName, $mode, $data, $request, $audit) {
            if ($mode === 'transfer') {
                $targetAccount = FinancialAccount::query()->lockForUpdate()->findOrFail($data['target_account_id']);

                Expense::query()->where('account_id', $account->getKey())->update([
                    'account_id' => $targetAccount->getKey(),
                ]);

                Payment::query()->where('account_id', $account->getKey())->update([
                    'account_id' => $targetAccount->getKey(),
                ]);

                Payroll::query()->where('payment_account_id', $account->getKey())->update([
                    'payment_account_id' => $targetAccount->getKey(),
                ]);

                PartnerTransaction::query()->where('account_id', $account->getKey())->update([
                    'account_id' => $targetAccount->getKey(),
                ]);

                ClientTrustFund::query()->where('account_id', $account->getKey())->update([
                    'account_id' => $targetAccount->getKey(),
                ]);

                AccountTransfer::query()
                    ->where(function ($q) use ($account, $targetAccount) {
                        $q->where('from_account_id', $account->getKey())
                            ->where('to_account_id', $targetAccount->getKey());
                    })
                    ->orWhere(function ($q) use ($account, $targetAccount) {
                        $q->where('from_account_id', $targetAccount->getKey())
                            ->where('to_account_id', $account->getKey());
                    })
                    ->delete();

                AccountTransfer::query()->where('from_account_id', $account->getKey())->update([
                    'from_account_id' => $targetAccount->getKey(),
                ]);
                AccountTransfer::query()->where('to_account_id', $account->getKey())->update([
                    'to_account_id' => $targetAccount->getKey(),
                ]);

                $targetAccount->increment('opening_balance', (int) $account->opening_balance);

                $audit->record($account, 'financial_account.deleted', [
                    'name' => $accountName,
                    'mode' => 'transfer',
                    'target_account_id' => $targetAccount->getKey(),
                    'target_account_name' => $targetAccount->name,
                    'transferred_balance' => (int) $account->current_balance,
                ], $request->user(), $request);

                $account->delete();

                $targetAccount->recalculateBalance();
                FinancialAccount::syncAllBalances();
            } else {
                AccountTransfer::query()
                    ->where('from_account_id', $account->getKey())
                    ->orWhere('to_account_id', $account->getKey())
                    ->delete();

                ClientTrustFund::query()
                    ->where('account_id', $account->getKey())
                    ->delete();

                Expense::query()->where('account_id', $account->getKey())->update(['account_id' => null]);
                Payment::query()->where('account_id', $account->getKey())->update(['account_id' => null]);
                Payroll::query()->where('payment_account_id', $account->getKey())->update(['payment_account_id' => null]);
                PartnerTransaction::query()->where('account_id', $account->getKey())->update(['account_id' => null]);

                $audit->record($account, 'financial_account.deleted', [
                    'name' => $accountName,
                    'mode' => 'direct_delete',
                    'cleared_balance' => (int) $account->current_balance,
                ], $request->user(), $request);

                $account->delete();

                FinancialAccount::syncAllBalances();
            }
        });

        $message = $mode === 'transfer'
            ? 'Rekening "'.$accountName.'" berhasil dihapus dan seluruh saldo serta data transaksi telah dialihkan.'
            : 'Rekening "'.$accountName.'" beserta seluruh saldonya berhasil dihapus.';

        return back()->with('success', $message);
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

    public function updatePartnerTransaction(UpdatePartnerTransactionRequest $request, PartnerTransaction $partnerTransaction, CreateFinanceProofDocument $createProof, AuditService $audit): RedirectResponse
    {
        abort_unless($request->user()->hasPermission('billing.manage'), 403);
        $data = $request->validated();

        $proofId = $partnerTransaction->proof_document_id;
        if ($request->hasFile('proof')) {
            $proof = $createProof->handle($request->file('proof'), $request->user(), 'Bukti transaksi partner: '.$partnerTransaction->transaction_number);
            $proofId = $proof->getKey();
        }

        DB::transaction(function () use ($data, $partnerTransaction, $proofId, $request, $audit) {
            $oldAmount = (int) $partnerTransaction->amount;
            $oldPartnerId = $partnerTransaction->partner_id;
            $oldType = $partnerTransaction->type;
            $oldAccountId = $partnerTransaction->account_id;

            $newAmount = (int) $data['amount'];
            $newPartnerId = $data['partner_id'];
            $newType = $data['type'];
            $newAccountId = $data['account_id'] ?? null;

            // Revert old effect:
            if ($oldType === 'advance_incurred') {
                $partnerAcc = FinancialAccount::query()->where('partner_id', $oldPartnerId)->first();
                if ($partnerAcc) {
                    $partnerAcc->decrement('current_balance', $oldAmount);
                }
            } elseif ($oldType === 'advance_reimbursed') {
                if ($oldAccountId) {
                    FinancialAccount::query()->whereKey($oldAccountId)->increment('current_balance', $oldAmount);
                }
                $partnerAcc = FinancialAccount::query()->where('partner_id', $oldPartnerId)->first();
                if ($partnerAcc) {
                    $partnerAcc->increment('current_balance', $oldAmount);
                }
            } elseif (in_array($oldType, ['profit_distribution', 'draw_prive']) && $oldAccountId) {
                FinancialAccount::query()->whereKey($oldAccountId)->increment('current_balance', $oldAmount);
            } elseif ($oldType === 'capital_injection' && $oldAccountId) {
                FinancialAccount::query()->whereKey($oldAccountId)->decrement('current_balance', $oldAmount);
            }

            // Apply new effect:
            if ($newType === 'advance_incurred') {
                $partnerAcc = FinancialAccount::query()->where('partner_id', $newPartnerId)->first();
                if ($partnerAcc) {
                    $partnerAcc->increment('current_balance', $newAmount);
                }
            } elseif ($newType === 'advance_reimbursed') {
                if ($newAccountId) {
                    FinancialAccount::query()->whereKey($newAccountId)->decrement('current_balance', $newAmount);
                }
                $partnerAcc = FinancialAccount::query()->where('partner_id', $newPartnerId)->first();
                if ($partnerAcc) {
                    $partnerAcc->decrement('current_balance', $newAmount);
                }
            } elseif (in_array($newType, ['profit_distribution', 'draw_prive']) && $newAccountId) {
                FinancialAccount::query()->whereKey($newAccountId)->decrement('current_balance', $newAmount);
            } elseif ($newType === 'capital_injection' && $newAccountId) {
                FinancialAccount::query()->whereKey($newAccountId)->increment('current_balance', $newAmount);
            }

            $partnerTransaction->update([
                'partner_id' => $newPartnerId,
                'matter_id' => $data['matter_id'] ?? null,
                'type' => $newType,
                'amount' => $newAmount,
                'transaction_date' => $data['transaction_date'],
                'account_id' => $newAccountId,
                'proof_document_id' => $proofId,
                'notes' => $data['notes'] ?? null,
            ]);

            $audit->record($partnerTransaction, 'partner_transaction.updated', [
                'type' => $newType,
                'amount' => $newAmount,
            ], $request->user(), $request);
            FinancialAccount::syncAllBalances();
        });

        return back()->with('success', 'Transaksi hak & talangan partner '.$partnerTransaction->transaction_number.' berhasil diperbarui.');
    }

    public function destroyPartnerTransaction(PartnerTransaction $partnerTransaction, AuditService $audit): RedirectResponse
    {
        abort_unless(request()->user()->hasPermission('billing.manage'), 403);

        $transNumber = $partnerTransaction->transaction_number;
        $amount = (int) $partnerTransaction->amount;
        $type = $partnerTransaction->type;

        DB::transaction(function () use ($partnerTransaction, $transNumber, $amount, $type, $audit) {
            $partnerTransaction->delete();
            FinancialAccount::syncAllBalances();

            $audit->record($partnerTransaction, 'partner_transaction.deleted', [
                'transaction_number' => $transNumber,
                'amount' => $amount,
                'type' => $type,
            ], request()->user(), request());
        });

        return back()->with('success', 'Transaksi hak & talangan partner '.$transNumber.' berhasil dihapus.');
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

    public function storePayroll(StorePayrollRequest $request, CreateFinanceProofDocument $createProof, AuditService $audit): RedirectResponse
    {
        $data = $request->safe()->except('proof');
        $user = User::query()->whereKey($data['user_id'])->sole();
        $payslipNumber = 'PAY-'.str_replace('-', '', $data['period']).'-'.str_pad((string) $user->getKey(), 3, '0', STR_PAD_LEFT);

        $totalEarnings = (int) $data['basic_salary'] + (int) ($data['fixed_allowance'] ?? 0)
            + (int) ($data['transport_meal_allowance'] ?? 0) + (int) ($data['overtime_amount'] ?? 0)
            + (int) ($data['bonus_amount'] ?? 0);

        $totalDeductions = (int) ($data['deductions_amount'] ?? 0) + (int) ($data['tax_deduction_amount'] ?? 0);
        $netSalary = max(0, $totalEarnings - $totalDeductions);

        $proofId = null;
        if ($request->hasFile('proof')) {
            $proof = $createProof->handle($request->file('proof'), $request->user(), 'Bukti Gaji '.$payslipNumber.' ('.$user->name.')');
            $proofId = $proof->getKey();
        }

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
                'proof_document_id' => $proofId,
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

    public function updatePayroll(UpdatePayrollRequest $request, Payroll $payroll, CreateFinanceProofDocument $createProof, AuditService $audit): RedirectResponse
    {
        abort_unless($request->user()->hasPermission('billing.manage'), 403);
        $data = $request->safe()->except('proof');

        $totalEarnings = (int) $data['basic_salary'] + (int) ($data['fixed_allowance'] ?? 0)
            + (int) ($data['transport_meal_allowance'] ?? 0) + (int) ($data['overtime_amount'] ?? 0)
            + (int) ($data['bonus_amount'] ?? 0);

        $totalDeductions = (int) ($data['deductions_amount'] ?? 0) + (int) ($data['tax_deduction_amount'] ?? 0);
        $netSalary = max(0, $totalEarnings - $totalDeductions);

        $oldStatus = $payroll->status;
        $oldNet = (int) $payroll->net_salary;
        $oldAccount = $payroll->payment_account_id;
        $newAccount = $data['payment_account_id'] ?? null;
        $newStatus = $data['status'];

        $updateData = [
            'basic_salary' => (int) $data['basic_salary'],
            'fixed_allowance' => (int) ($data['fixed_allowance'] ?? 0),
            'transport_meal_allowance' => (int) ($data['transport_meal_allowance'] ?? 0),
            'overtime_amount' => (int) ($data['overtime_amount'] ?? 0),
            'bonus_amount' => (int) ($data['bonus_amount'] ?? 0),
            'deductions_amount' => (int) ($data['deductions_amount'] ?? 0),
            'tax_deduction_amount' => (int) ($data['tax_deduction_amount'] ?? 0),
            'net_salary' => $netSalary,
            'status' => $newStatus,
            'payment_account_id' => $newAccount,
            'notes' => $data['notes'] ?? null,
            'paid_at' => $newStatus === 'paid' ? ($payroll->paid_at ?? now()) : null,
            'approved_by' => in_array($newStatus, ['approved', 'paid']) ? ($payroll->approved_by ?? $request->user()->getKey()) : null,
            'approved_at' => in_array($newStatus, ['approved', 'paid']) ? ($payroll->approved_at ?? now()) : null,
        ];

        if ($request->hasFile('proof')) {
            $proof = $createProof->handle($request->file('proof'), $request->user(), 'Bukti Gaji '.$payroll->payslip_number.' ('.$payroll->user?->name.')');
            $updateData['proof_document_id'] = $proof->getKey();
        }

        $payroll->update($updateData);

        // Adjust financial account balance if status is/was paid
        if ($oldStatus === 'paid' && $newStatus === 'paid') {
            if ($oldAccount && $oldAccount === $newAccount) {
                $diff = $netSalary - $oldNet;
                if ($diff !== 0) {
                    FinancialAccount::query()->where('id', $oldAccount)->decrement('current_balance', $diff);
                }
            } elseif ($oldAccount !== $newAccount) {
                if ($oldAccount) {
                    FinancialAccount::query()->where('id', $oldAccount)->increment('current_balance', $oldNet);
                }
                if ($newAccount) {
                    FinancialAccount::query()->where('id', $newAccount)->decrement('current_balance', $netSalary);
                }
            }
        } elseif ($oldStatus !== 'paid' && $newStatus === 'paid' && $newAccount) {
            FinancialAccount::query()->where('id', $newAccount)->decrement('current_balance', $netSalary);
        } elseif ($oldStatus === 'paid' && $newStatus !== 'paid' && $oldAccount) {
            FinancialAccount::query()->where('id', $oldAccount)->increment('current_balance', $oldNet);
        }

        $audit->record($payroll, 'payroll.updated', [
            'net_salary' => $netSalary,
            'status' => $newStatus,
        ], $request->user(), $request);

        return back()->with('success', 'Slip gaji '.$payroll->payslip_number.' berhasil diperbarui.');
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
            'Content-Disposition' => 'inline; filename="'.$invoice->invoice_number.'.pdf"',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    public function downloadQuotation(Request $request, Quotation $quotation, PdfRenderer $pdfRenderer, AuditService $audit): HttpResponse
    {
        $quotation->loadMissing(['client', 'matter', 'lineItems', 'creator', 'approver']);
        $this->authorizeFinanceAccess($request, $quotation->matter);
        $audit->record($quotation, 'quotation.pdf_downloaded', [], $request->user(), $request);

        return response($pdfRenderer->render('pdf.quotation', ['quotation' => $quotation]), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$quotation->quotation_number.'.pdf"',
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

    public function uploadProof(
        Request $request,
        string $entity,
        string $id,
        CreateFinanceProofDocument $createProof,
        AuditService $audit
    ): RedirectResponse {
        $this->authorizeFinanceAccess($request, null);
        $request->validate([
            'proof' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:20480'],
        ]);

        $model = $this->resolveFinanceModel($entity, $id);
        $title = $this->resolveProofTitle($entity, $model);
        $matter = method_exists($model, 'matter') ? $model->matter : null;
        $client = method_exists($model, 'client') ? $model->client : null;

        $proof = $createProof->handle($request->file('proof'), $request->user(), $title, $matter, $client);
        $model->update(['proof_document_id' => $proof->getKey()]);

        $audit->record($model, "finance.{$entity}.proof_uploaded", [
            'document_id' => $proof->getKey(),
        ], $request->user(), $request);

        return back()->with('success', 'Bukti dokumen berhasil diunggah.');
    }

    public function destroyProof(
        Request $request,
        string $entity,
        string $id,
        AuditService $audit
    ): RedirectResponse {
        $this->authorizeFinanceAccess($request, null);
        $model = $this->resolveFinanceModel($entity, $id);
        $oldProofId = $model->proof_document_id;

        if ($oldProofId) {
            $model->update(['proof_document_id' => null]);
            $doc = Document::query()->find($oldProofId);
            if ($doc && $doc->document_type === 'financial_proof') {
                $doc->delete();
            }
        }

        $audit->record($model, "finance.{$entity}.proof_removed", [
            'old_document_id' => $oldProofId,
        ], $request->user(), $request);

        return back()->with('success', 'Bukti dokumen berhasil dihapus.');
    }

    private function resolveFinanceModel(string $entity, string $id): Model
    {
        return match ($entity) {
            'expenses', 'expense' => Expense::query()->findOrFail($id),
            'payments', 'payment' => Payment::query()->findOrFail($id),
            'invoices', 'invoice' => Invoice::query()->findOrFail($id),
            'payrolls', 'payroll' => Payroll::query()->findOrFail($id),
            'partner-transactions', 'partner_transaction' => PartnerTransaction::query()->findOrFail($id),
            'transfers', 'transfer' => AccountTransfer::query()->findOrFail($id),
            'client-trust-funds', 'client_trust' => ClientTrustFund::query()->findOrFail($id),
            default => abort(404, 'Entitas keuangan tidak ditemukan.'),
        };
    }

    private function resolveProofTitle(string $entity, Model $model): string
    {
        return match ($entity) {
            'expenses', 'expense' => 'Bukti Pengeluaran: '.($model->description ?? $model->id),
            'payments', 'payment' => 'Bukti Pembayaran: '.($model->payment_number ?? $model->id),
            'invoices', 'invoice' => 'Faktur/Invoice: '.($model->invoice_number ?? $model->id),
            'payrolls', 'payroll' => 'Bukti Gaji/Slip: '.($model->payslip_number ?? $model->id),
            'partner-transactions', 'partner_transaction' => 'Bukti Transaksi Partner: '.($model->transaction_number ?? $model->id),
            'transfers', 'transfer' => 'Bukti Transfer Mutasi: '.($model->transfer_number ?? $model->id),
            'client-trust-funds', 'client_trust' => 'Bukti Dana Titipan: '.($model->transaction_number ?? $model->id),
            default => 'Bukti Transaksi Keuangan',
        };
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
