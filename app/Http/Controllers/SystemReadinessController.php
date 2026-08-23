<?php

namespace App\Http\Controllers;

use App\Services\SystemReadiness;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemReadinessController extends Controller
{
    public function __invoke(Request $request, SystemReadiness $readiness): JsonResponse
    {
        abort_unless($request->user()->hasPermission('admin.users.manage'), 403);

        return response()->json($readiness->report());
    }
}
