<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GuideController extends Controller
{
    /**
     * Display the RPK App User Guide & Knowledge Hub.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('guide/index');
    }
}
