<?php

namespace App\Http\Controllers;

use App\Models\Matter;
use App\Services\AuditService;
use App\Services\PdfRenderer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class MatterReportController extends Controller
{
    public function statusReport(Request $request, Matter $matter, PdfRenderer $renderer, AuditService $audit): Response
    {
        Gate::authorize('view', $matter);
        $matter->loadMissing([
            'client',
            'practiceArea',
            'responsiblePartner',
            'supervisingLawyer',
            'parties',
            'members',
            'events' => fn ($q) => $q->orderBy('starts_at', 'desc'),
            'documents.versions',
            'invoices',
            'expenses',
        ]);

        $pdfContent = $renderer->render('pdf.matter-status-report', [
            'matter' => $matter,
        ]);

        $audit->record($matter, 'matter.status_report_generated', [], $request->user(), $request);

        return response($pdfContent, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="Laporan-Perkara-'.$matter->matter_number.'.pdf"',
        ]);
    }
}
