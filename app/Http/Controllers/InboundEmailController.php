<?php

namespace App\Http\Controllers;

use App\Actions\IngestInboundEmail;
use App\Http\Requests\IngestInboundEmailRequest;
use Illuminate\Http\JsonResponse;

class InboundEmailController extends Controller
{
    public function store(IngestInboundEmailRequest $request, IngestInboundEmail $ingest): JsonResponse
    {
        $correspondence = $ingest->handle($request->validated());

        return response()->json(['id' => $correspondence->getKey(), 'status' => 'accepted'], 202);
    }
}
