<?php

namespace App\Http\Controllers;

use App\Models\ConflictCheck;
use App\Models\Correspondence;
use App\Models\Invoice;
use App\Models\Matter;
use App\Models\Payment;
use App\Models\Payroll;
use App\Models\Quotation;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\SvgWriter;
use Illuminate\Http\Response;
use Illuminate\View\View;

class PublicVerificationController extends Controller
{
    /**
     * Display public authenticity verification page for client invoices.
     */
    public function verifyInvoice(string $invoiceNumber): View
    {
        $invoice = Invoice::query()
            ->with([
                'client:id,client_number,display_name,type,legal_name',
                'matter:id,matter_number,title',
                'lineItems',
                'creator:id,name,position_title,avatar_path',
            ])
            ->where('invoice_number', $invoiceNumber)
            ->orWhere('id', $invoiceNumber)
            ->firstOrFail();

        return view('verify.invoice', compact('invoice'));
    }

    /**
     * Render SVG QR code for client invoice verification.
     */
    public function invoiceQr(string $invoiceNumber): Response
    {
        $invoice = Invoice::query()
            ->where('invoice_number', $invoiceNumber)
            ->orWhere('id', $invoiceNumber)
            ->firstOrFail();

        $result = (new SvgWriter)->write(
            new QrCode(
                data: route('verify.invoice', $invoice->invoice_number),
                size: 240,
                margin: 4
            )
        );

        return response($result->getString(), 200, [
            'Content-Type' => $result->getMimeType(),
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    /**
     * Display public authenticity verification page for official firm correspondences / letters.
     */
    public function verifyCorrespondence(Correspondence $correspondence): View
    {
        $correspondence->loadMissing([
            'matter:id,matter_number,title,status,opened_at',
            'client:id,client_number,display_name,legal_name',
            'creator:id,name,position_title,avatar_path',
            'documents.currentVersion:id,document_id,original_filename,file_size,mime_type,checksum',
        ]);

        return view('verify.correspondence', compact('correspondence'));
    }

    /**
     * Render SVG QR code for correspondence verification.
     */
    public function correspondenceQr(Correspondence $correspondence): Response
    {
        $result = (new SvgWriter)->write(
            new QrCode(
                data: route('verify.correspondence', $correspondence),
                size: 240,
                margin: 4
            )
        );

        return response($result->getString(), 200, [
            'Content-Type' => $result->getMimeType(),
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    /**
     * Display public authenticity verification page for payslips.
     */
    public function verifyPayslip(string $payslipNumber): View
    {
        $payroll = Payroll::query()
            ->with(['user', 'paymentAccount'])
            ->where('payslip_number', $payslipNumber)
            ->orWhere('id', $payslipNumber)
            ->firstOrFail();

        return view('verify.payslip', compact('payroll'));
    }

    /**
     * Render SVG QR code for payslip verification.
     */
    public function payslipQr(string $payslipNumber): Response
    {
        $payroll = Payroll::query()
            ->where('payslip_number', $payslipNumber)
            ->orWhere('id', $payslipNumber)
            ->firstOrFail();

        $result = (new SvgWriter)->write(
            new QrCode(
                data: route('verify.payslip', $payroll->payslip_number),
                size: 240,
                margin: 4
            )
        );

        return response($result->getString(), 200, [
            'Content-Type' => $result->getMimeType(),
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    /**
     * Display public authenticity verification page for fee quotations.
     */
    public function verifyQuotation(string $quotationNumber): View
    {
        $quotation = Quotation::query()
            ->with([
                'client:id,client_number,display_name,type,legal_name,email,phone,address_line_1,city,postal_code,tax_identifier',
                'matter:id,matter_number,title',
                'lineItems',
                'creator:id,name,position_title,avatar_path',
                'approver:id,name,position_title,avatar_path',
            ])
            ->where('quotation_number', $quotationNumber)
            ->orWhere('id', $quotationNumber)
            ->firstOrFail();

        return view('verify.quotation', compact('quotation'));
    }

    /**
     * Render SVG QR code for fee quotation verification.
     */
    public function quotationQr(string $quotationNumber): Response
    {
        $quotation = Quotation::query()
            ->where('quotation_number', $quotationNumber)
            ->orWhere('id', $quotationNumber)
            ->firstOrFail();

        $result = (new SvgWriter)->write(
            new QrCode(
                data: route('verify.quotation', $quotation->quotation_number),
                size: 240,
                margin: 4
            )
        );

        return response($result->getString(), 200, [
            'Content-Type' => $result->getMimeType(),
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    /**
     * Display public authenticity verification page for official payment receipts.
     */
    public function verifyPaymentReceipt(string $referenceNumber): View
    {
        $payment = Payment::query()
            ->with([
                'client:id,client_number,display_name,type,legal_name,email,phone,address_line_1,city,tax_identifier',
                'matter:id,matter_number,title',
                'account:id,name,bank_name,account_number,account_holder',
                'allocations.invoice:id,invoice_number,title,total_amount,currency',
                'recorder:id,name,position_title,avatar_path',
            ])
            ->where('reference_number', $referenceNumber)
            ->orWhere('id', $referenceNumber)
            ->firstOrFail();

        return view('verify.payment-receipt', compact('payment'));
    }

    /**
     * Render SVG QR code for payment receipt verification.
     */
    public function paymentReceiptQr(string $referenceNumber): Response
    {
        $payment = Payment::query()
            ->where('reference_number', $referenceNumber)
            ->orWhere('id', $referenceNumber)
            ->firstOrFail();

        $result = (new SvgWriter)->write(
            new QrCode(
                data: route('verify.payment-receipt', $payment->reference_number ?: $payment->id),
                size: 240,
                margin: 4
            )
        );

        return response($result->getString(), 200, [
            'Content-Type' => $result->getMimeType(),
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    /**
     * Display public authenticity verification page for Conflict of Interest Clearance Certificates.
     */
    public function verifyConflictCertificate(ConflictCheck $conflictCheck): View
    {
        $conflictCheck->loadMissing([
            'matter:id,matter_number,title,status,opened_at',
            'client:id,client_number,display_name,legal_name,tax_identifier',
            'requester:id,name,email,position_title,avatar_path',
            'reviewer:id,name,email,position_title,avatar_path',
        ]);

        return view('verify.conflict-certificate', compact('conflictCheck'));
    }

    /**
     * Render SVG QR code for conflict clearance certificate verification.
     */
    public function conflictCertificateQr(ConflictCheck $conflictCheck): Response
    {
        $result = (new SvgWriter)->write(
            new QrCode(
                data: route('verify.conflict-certificate', $conflictCheck),
                size: 240,
                margin: 4
            )
        );

        return response($result->getString(), 200, [
            'Content-Type' => $result->getMimeType(),
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    /**
     * Display public authenticity verification page for Matter Status & Progress Reports.
     */
    public function verifyMatterStatus(Matter $matter): View
    {
        $matter->loadMissing([
            'client:id,client_number,display_name,legal_name',
            'practiceArea:id,name',
            'responsiblePartner:id,name,position_title',
            'supervisingLawyer:id,name,position_title',
            'parties',
            'events' => fn ($q) => $q->orderBy('starts_at', 'desc')->limit(5),
        ]);

        return view('verify.matter-status', compact('matter'));
    }

    /**
     * Render SVG QR code for matter status report verification.
     */
    public function matterStatusQr(Matter $matter): Response
    {
        $result = (new SvgWriter)->write(
            new QrCode(
                data: route('verify.matter-status', $matter),
                size: 240,
                margin: 4
            )
        );

        return response($result->getString(), 200, [
            'Content-Type' => $result->getMimeType(),
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }
}
