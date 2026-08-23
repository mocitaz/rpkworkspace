<?php

namespace App\Http\Controllers;

use App\Services\GlobalSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, GlobalSearchService $search): JsonResponse|Response
    {
        $query = $request->string('q')->trim()->toString();
        $results = $search->search($request->user(), $query);

        if ($request->expectsJson()) {
            return response()->json(['results' => $results]);
        }

        return Inertia::render('search/index', ['query' => $query, 'results' => $results]);
    }
}
