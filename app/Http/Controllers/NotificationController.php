<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function read(Request $request, string $notification): RedirectResponse
    {
        $databaseNotification = $request->user()->notifications()->findOrFail($notification);
        $databaseNotification->markAsRead();
        $url = $databaseNotification->data['url'] ?? route('dashboard');

        return redirect()->to(is_string($url) ? $url : route('dashboard'));
    }

    public function readAll(Request $request): RedirectResponse
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);

        return back()->with('success', 'Semua notifikasi ditandai sudah dibaca.');
    }
}
