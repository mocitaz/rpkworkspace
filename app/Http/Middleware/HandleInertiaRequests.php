<?php

namespace App\Http\Middleware;

use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        if ($user = $request->user()) {
            if (! $user->last_seen_at || $user->last_seen_at->lt(now()->subSeconds(30))) {
                $user->forceFill(['last_seen_at' => now()])->saveQuietly();
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'firm' => config('raf.firm'),
            'timezone' => config('raf.timezone'),
            'auth' => [
                'user' => $request->user(),
                'permissions' => fn () => $request->user()?->roles()->with('permissions:id,name')->get()
                    ->flatMap(fn (Role $role) => $role->permissions->pluck('name'))->unique()->values() ?? [],
                'notifications' => fn () => $request->user()?->notifications()->latest()->limit(8)->get()->map(fn ($notification) => [
                    'id' => $notification->getKey(),
                    'type' => $notification->type,
                    'data' => $notification->data,
                    'read_at' => $notification->read_at?->toIso8601String(),
                    'created_at' => $notification->created_at?->toIso8601String(),
                ])->values() ?? [],
                'unread_notifications_count' => fn () => $request->user()?->unreadNotifications()->count() ?? 0,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'sidebarOpen' => $request->cookie('sidebar_state') === 'true',
        ];
    }
}
