<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\PostTooLargeException;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->render(function (DomainException $e, Request $request) {
            if ($request->header('X-Inertia') || ! $request->expectsJson()) {
                return back()->with('error', $e->getMessage())->withErrors([
                    'error' => $e->getMessage(),
                ]);
            }

            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        });

        $exceptions->render(function (PostTooLargeException $e, Request $request) {
            $msg = 'Ukuran berkas yang diunggah melebihi batas maksimal server. Silakan unggah berkas yang lebih kecil.';
            if ($request->header('X-Inertia') || ! $request->expectsJson()) {
                return back()->with('error', $msg)->withErrors([
                    'avatar' => $msg,
                    'file' => $msg,
                ]);
            }

            return response()->json([
                'message' => $msg,
            ], 413);
        });
    })->create();
