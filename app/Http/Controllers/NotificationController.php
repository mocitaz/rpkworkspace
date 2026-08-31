<?php

namespace App\Http\Controllers;

use App\Services\NotificationAccess;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function read(Request $request, string $notification, NotificationAccess $notificationAccess): RedirectResponse
    {
        $databaseNotification = $request->user()->notifications()->findOrFail($notification);
        abort_unless($notificationAccess->allowsDatabaseNotification($request->user(), $databaseNotification), 404);
        $databaseNotification->markAsRead();
        $url = $databaseNotification->data['url'] ?? route('dashboard');

        return redirect()->to(is_string($url) ? $url : route('dashboard'));
    }

    public function readAll(Request $request, NotificationAccess $notificationAccess): RedirectResponse
    {
        $notificationIds = $request->user()->unreadNotifications()->get()
            ->filter(fn ($notification) => $notificationAccess->allowsDatabaseNotification($request->user(), $notification))
            ->modelKeys();

        $request->user()->unreadNotifications()->whereKey($notificationIds)->update(['read_at' => now()]);

        return back()->with('success', 'Semua notifikasi ditandai sudah dibaca.');
    }
}
