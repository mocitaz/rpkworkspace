<?php

use App\Models\Permission;
use App\Notifications\PaymentVerificationRequestedNotification;
use App\Services\NotificationAccess;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\Events\NotificationSending;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

function storedNotification($user, array $data): DatabaseNotification
{
    return $user->notifications()->create([
        'id' => (string) Str::uuid(),
        'type' => str_replace('_', '-', $data['kind']),
        'data' => $data,
    ]);
}

it('sends payment verification only to users who can manage payments', function () {
    $finance = rafUser(['payment.manage']);
    $intern = rafUser(['task.view', 'document.view']);
    $associate = rafUser(['matter.view', 'task.view', 'document.view']);
    $notification = new PaymentVerificationRequestedNotification(
        invoiceNumber: 'PAY-001',
        clientName: 'PT Rahasia Klien',
        amountPaid: 'Rp 33.500.000',
    );

    Notification::sendNow([$finance, $intern, $associate], $notification, ['database']);

    expect($finance->notifications()->count())->toBe(1)
        ->and($intern->notifications()->count())->toBe(0)
        ->and($associate->notifications()->count())->toBe(0)
        ->and(Event::until(new NotificationSending($finance, $notification, 'mail')))->toBeTrue()
        ->and(Event::until(new NotificationSending($intern, $notification, 'mail')))->toBeFalse()
        ->and(Event::until(new NotificationSending($associate, $notification, 'mail')))->toBeFalse();
});

it('hides stale sensitive notifications immediately after permission is revoked', function () {
    $user = rafUser(['payment.manage']);
    $notification = storedNotification($user, [
        'kind' => 'payment_verification_requested',
        'title' => 'Pembayaran Masuk',
        'message' => 'Rp 33.500.000 dari PT Rahasia Klien',
        'url' => route('finance.index'),
    ]);
    $access = app(NotificationAccess::class);

    expect($access->allowsDatabaseNotification($user, $notification))->toBeTrue();

    $permission = Permission::query()->where('name', 'payment.manage')->sole();
    $user->roles()->firstOrFail()->permissions()->detach($permission);

    expect($access->allowsDatabaseNotification($user, $notification->fresh()))->toBeFalse();

    $this->actingAs($user)
        ->patch(route('notifications.read', $notification))
        ->assertNotFound();
});

it('applies permission boundaries to every sensitive notification domain', function (string $kind, string $permission) {
    $unauthorized = rafUser();
    $authorized = rafUser([$permission]);
    $data = ['kind' => $kind, 'title' => 'Rahasia', 'message' => 'Data sensitif'];
    $unauthorizedNotification = storedNotification($unauthorized, $data);
    $authorizedNotification = storedNotification($authorized, $data);
    $access = app(NotificationAccess::class);

    expect($access->allowsDatabaseNotification($unauthorized, $unauthorizedNotification))->toBeFalse()
        ->and($access->allowsDatabaseNotification($authorized, $authorizedNotification))->toBeTrue();
})->with([
    'finance' => ['payment_verification_requested', 'payment.manage'],
    'client' => ['client_partner_assigned', 'client.view'],
    'correspondence' => ['correspondence_dispatched', 'correspondence.view'],
    'matter' => ['hearing_reminder', 'matter.view'],
    'document' => ['document_approval_requested', 'document.view'],
    'task' => ['task_overdue', 'task.view'],
]);

it('prunes unauthorized historical notifications only when explicitly executed', function () {
    $finance = rafUser(['payment.manage']);
    $intern = rafUser(['task.view']);
    storedNotification($finance, ['kind' => 'payment_verification_requested']);
    storedNotification($intern, ['kind' => 'payment_verification_requested']);

    $this->artisan('raf:prune-unauthorized-notifications')
        ->expectsOutputToContain('1 notifikasi tidak berizin ditemukan')
        ->assertSuccessful();

    expect(DatabaseNotification::query()->count())->toBe(2);

    $this->artisan('raf:prune-unauthorized-notifications', ['--execute' => true])
        ->expectsOutputToContain('1 notifikasi tidak berizin berhasil dihapus')
        ->assertSuccessful();

    expect(DatabaseNotification::query()->count())->toBe(1)
        ->and($finance->notifications()->count())->toBe(1)
        ->and($intern->notifications()->count())->toBe(0);
});
