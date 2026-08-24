<?php

namespace App\Http\Controllers;

use App\Models\Matter;
use App\Models\MatterChronology;
use App\Services\AuditService;
use App\Services\PdfRenderer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class MatterChronologyController extends Controller
{
    public function store(Request $request, Matter $matter, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $matter);

        $validated = $request->validate([
            'event_date' => ['required', 'date'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'evidence_reference' => ['nullable', 'string', 'max:255'],
            'witness_name' => ['nullable', 'string', 'max:255'],
            'importance_level' => ['required', 'string', 'in:critical,high,normal'],
        ]);

        $chronology = $matter->chronologies()->create([
            ...$validated,
            'created_by' => $request->user()->id,
        ]);

        $audit->record($matter, 'matter.chronology_added', [
            'chronology_id' => $chronology->id,
            'title' => $chronology->title,
        ], $request->user(), $request);

        return back()->with('success', 'Peristiwa kronologi fakta perkara berhasil ditambahkan.');
    }

    public function destroy(Request $request, Matter $matter, MatterChronology $chronology, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $matter);
        abort_unless($chronology->matter_id === $matter->getKey(), 404);

        $chronology->delete();

        $audit->record($matter, 'matter.chronology_deleted', [
            'chronology_id' => $chronology->id,
            'title' => $chronology->title,
        ], $request->user(), $request);

        return back()->with('success', 'Peristiwa kronologi berhasil dihapus.');
    }

    public function exportPdf(Request $request, Matter $matter, PdfRenderer $renderer, AuditService $audit): Response
    {
        Gate::authorize('view', $matter);
        $matter->loadMissing(['client', 'practiceArea', 'chronologies']);

        $pdfContent = $renderer->render('pdf.matter-chronology', [
            'matter' => $matter,
        ]);

        $audit->record($matter, 'matter.chronology_pdf_exported', [], $request->user(), $request);

        return response($pdfContent, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="Kronologi-Perkara-'.$matter->matter_number.'.pdf"',
        ]);
    }
}
