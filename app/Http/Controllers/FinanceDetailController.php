<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\AuditService;
use App\Services\PdfRenderer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class FinanceDetailController extends Controller
{
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
