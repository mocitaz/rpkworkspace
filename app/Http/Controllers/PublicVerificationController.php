<?php

namespace App\Http\Controllers;

use App\Models\Correspondence;
use App\Models\Invoice;
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
}
