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
use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\StoreQuotationRequest;
use App\Http\Requests\TransitionInvoiceRequest;
use App\Models\Client;
use App\Models\Expense;
use App\Models\Invoice;
use App\Models\Matter;
use App\Models\Payment;
use App\Models\Quotation;
use App\Services\AuditService;
use App\Services\MatterFinancialOverview;
use App\Services\PdfRenderer;
use App\WorkflowStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class FinanceController extends Controller
{
    public function index(Request $request, MatterFinancialOverview $overview): Response
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

        if ($selectedMatter) {
            $invoiceQuery->where('matter_id', $selectedMatter->getKey());
            $quotationQuery->where('matter_id', $selectedMatter->getKey());
            $expenseQuery->where('matter_id', $selectedMatter->getKey());
            $paymentQuery->where('matter_id', $selectedMatter->getKey());
        } else {
            $invoiceQuery->where(fn ($q) => $q->whereIn('matter_id', $visibleMatterIds)->orWhereNull('matter_id'));
            $quotationQuery->where(fn ($q) => $q->whereIn('matter_id', $visibleMatterIds)->orWhereNull('matter_id'));
            $expenseQuery->where(fn ($q) => $q->whereIn('matter_id', $visibleMatterIds)->orWhereNull('matter_id'));
            $paymentQuery->where(fn ($q) => $q->whereIn('matter_id', $visibleMatterIds)->orWhereNull('matter_id'));
        }

        return Inertia::render('finance/index', [
            'matters' => $matters->map(fn (Matter $matter) => [
                'id' => $matter->getKey(), 'matter_number' => $matter->matter_number,
                'title' => $matter->title, 'client' => $matter->client?->display_name,
            ]),
            'clients' => Client::query()->where('status', 'active')->orderBy('display_name')->get(['id', 'display_name']),
            'overview' => $financialOverview,
            'selectedMatterId' => $selectedMatter?->getKey() ?? '',
            'invoices' => $invoiceQuery->with('matter:id,matter_number,title')->latest()->limit(50)->get(),
            'quotations' => $quotationQuery->with('matter:id,matter_number,title')->latest()->limit(50)->get(),
            'expenses' => $expenseQuery->with('matter:id,matter_number,title')->latest('incurred_at')->limit(50)->get(),
            'payments' => $paymentQuery->with(['matter:id,matter_number,title', 'allocations.invoice:id,invoice_number,outstanding_amount,currency'])->latest('received_at')->limit(50)->get(),
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
        $this->authorizeMatter($request, $request->validated('matter_id'));
        $attributes = $request->safe()->except('proof');
        $matter = Matter::query()->whereKey($attributes['matter_id'])->sole();
        if ($request->hasFile('proof')) {
            $proof = $createProof->handle($request->file('proof'), $request->user(), 'Bukti biaya: '.$attributes['description'], $matter);
            $attributes['proof_document_id'] = $proof->getKey();
        }
        $expense = $create->handle($attributes, $request->user());
        $audit->record($expense, 'expense.created', [], $request->user(), $request);

        return back()->with('success', 'Biaya berhasil dicatat.');
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
        $record->handle($attributes, $request->user(), $audit);

        return back()->with('success', 'Pembayaran berhasil dicatat.');
    }

    public function reversePayment(ReversePaymentRequest $request, Payment $payment, ReversePayment $reverse): RedirectResponse
    {
        $this->authorizeFinanceAccess($request, $payment->matter);
        $reverse->handle($payment, $request->user(), $request->validated('reason'));

        return back()->with('success', 'Pembayaran dibatalkan dan alokasi invoice dikoreksi.');
    }

    public function refundPayment(RefundPaymentRequest $request, Payment $payment, RefundPayment $refund): RedirectResponse
    {
        $this->authorizeFinanceAccess($request, $payment->matter);
        $refund->handle($payment, $request->user(), $request->validated('reason'));

        return back()->with('success', 'Refund pembayaran dicatat dan alokasi invoice dikoreksi.');
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
