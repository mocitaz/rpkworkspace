<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\Matter;
use App\Models\Payment;
use App\Services\AuditService;
use App\Services\PdfRenderer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class FinanceDetailController extends Controller
{
    public function invoice(Request $request, Invoice $invoice): Response
    {
        abort_unless($request->user()->hasPermission('billing.view'), 403);
        if ($invoice->matter !== null) {
            Gate::authorize('view', $invoice->matter);
        }

        return Inertia::render('finance/invoice-show', [
            'invoice' => $invoice->load([
                'client:id,display_name,legal_name,client_number,email,phone,address_line_1,city,province,postal_code',
                'matter:id,matter_number,title,matter_type,court,jurisdiction,responsible_partner_id',
                'matter.responsiblePartner:id,name',
                'lineItems',
                'paymentAllocations.payment:id,amount,received_at,reference_number,reversed_at,refunded_at',
            ]),
            'clients' => Client::query()->orderBy('display_name')->get(['id', 'display_name', 'legal_name']),
            'matters' => Matter::query()->orderBy('matter_number')->get(['id', 'matter_number', 'title', 'client_id']),
        ]);
    }

    public function payment(Request $request, Payment $payment): Response
    {
        abort_unless($request->user()->hasPermission('payment.view'), 403);
        if ($payment->matter !== null) {
            Gate::authorize('view', $payment->matter);
        }

        return Inertia::render('finance/payment-show', [
            'payment' => $payment->load(['client:id,display_name', 'matter:id,matter_number,title', 'proofDocument.currentVersion', 'allocations.invoice:id,invoice_number,title,total_amount,paid_amount,outstanding_amount,currency,status']),
        ]);
    }

    public function paymentReceipt(Request $request, Payment $payment, PdfRenderer $renderer, AuditService $audit): SymfonyResponse
    {
        abort_unless($request->user()->hasPermission('payment.view'), 403);
        if ($payment->matter !== null) {
            Gate::authorize('view', $payment->matter);
        }

        $payment->loadMissing(['client', 'matter', 'account', 'allocations.invoice', 'recorder']);

        $pdf = $renderer->render('pdf.payment-receipt', [
            'payment' => $payment,
        ]);

        $audit->record($payment, 'payment.receipt_generated', [
            'amount' => $payment->amount,
            'reference_number' => $payment->reference_number,
        ], $request->user(), $request);

        $ref = $payment->reference_number ?: ('PAY-'.$payment->id);

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="Kuitansi-'.$ref.'.pdf"',
        ]);
    }
}
