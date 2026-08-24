<?php

namespace App\Http\Controllers;

use App\Models\Matter;
use App\Models\MatterEvent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MatterEventChecklistController extends Controller
{
    public function update(Request $request, Matter $matter, MatterEvent $event): RedirectResponse
    {
        Gate::authorize('update', $matter);
        abort_unless($event->matter_id === $matter->getKey(), 404);

        $validated = $request->validate([
            'checklist' => ['nullable', 'array'],
            'checklist.*.text' => ['required', 'string', 'max:255'],
            'checklist.*.checked' => ['required', 'boolean'],
        ]);

        $event->update([
            'checklist' => $validated['checklist'] ?? [],
        ]);

        return back()->with('success', 'Checklist berkas sidang berhasil diperbarui.');
    }
}
