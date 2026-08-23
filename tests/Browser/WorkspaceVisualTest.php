<?php

use App\Models\User;

test('the sign-in page is visually stable on desktop', function () {
    $page = visit('/login')
        ->inLightMode()
        ->on()
        ->desktop();

    $page
        ->assertTitle('Masuk - RAF Workspace')
        ->wait(2)
        ->assertNoSmoke()
        ->assertSee('RAF Workspace')
        ->assertSee('Masuk ke Workspace')
        ->assertNoBrokenImages()
        ->assertScreenshotMatches();
});

test('the sign-in page is responsive on mobile', function () {
    $page = visit('/login')
        ->inLightMode()
        ->on()
        ->iPhone15Pro();

    $page
        ->wait(2)
        ->assertNoSmoke()
        ->assertSee('Alamat email')
        ->assertSee('Kata sandi')
        ->assertNoBrokenImages()
        ->assertScreenshotMatches();
});

test('the sign-in page is visually stable in dark mode', function () {
    $page = visit('/login')
        ->inDarkMode()
        ->on()
        ->desktop();

    $page
        ->wait(2)
        ->assertNoSmoke()
        ->assertSee('Masuk ke Workspace')
        ->assertNoBrokenImages()
        ->assertScreenshotMatches();
});

test('the redesigned dashboard is visually stable on desktop', function () {
    $user = User::factory()->create([
        'name' => 'Nadia Pratama',
        'email' => 'nadia@example.test',
        'password' => 'password',
    ]);

    $page = visit('/login')
        ->inLightMode()
        ->on()
        ->desktop()
        ->fill('email', $user->email)
        ->fill('password', 'password')
        ->click('Masuk ke Workspace')
        ->wait(1)
        ->assertPathIs('/dashboard')
        ->assertSee('Selamat datang, Nadia')
        ->assertSee('Matter aktif')
        ->assertNoSmoke()
        ->assertScreenshotMatches();
});

test('the operational workspace pages render without browser errors', function () {
    $user = rafUser([
        'matter.view',
        'billing.view',
        'template.view',
        'correspondence.view',
        'conflict.view',
        'archive.view',
    ]);
    $user->update(['password' => 'password']);

    $page = visit('/login')
        ->inLightMode()
        ->on()
        ->desktop()
        ->fill('email', $user->email)
        ->fill('password', 'password')
        ->click('Masuk ke Workspace')
        ->wait(1)
        ->assertPathIs('/dashboard');

    $page->click('Keuangan')
        ->assertSee('Keuangan matter')
        ->assertNoSmoke()
        ->assertNoBrokenImages();

    $page->click('Template')
        ->assertSee('Template DOCX')
        ->assertNoSmoke()
        ->assertNoBrokenImages();

    $page->click('Governance')
        ->assertSee('Kontrol matter & kepatuhan')
        ->assertNoSmoke()
        ->assertNoBrokenImages();
});

test('finance controls remain usable in the operational workspace', function () {
    $user = rafUser(['matter.view', 'matter.view.all', 'billing.view', 'billing.manage', 'payment.manage', 'expense.manage', 'quotation.manage']);
    $user->update(['password' => 'password']);

    $page = visit('/login')
        ->inLightMode()
        ->on()
        ->desktop()
        ->fill('email', $user->email)
        ->fill('password', 'password')
        ->click('Masuk ke Workspace')
        ->wait(1)
        ->click('Keuangan')
        ->assertSee('Invoice baru')
        ->assertSee('Pembayaran')
        ->click('Invoice baru')
        ->assertSee('Invoice baru')
        ->assertSee('Item tagihan')
        ->assertNoSmoke()
        ->assertNoBrokenImages();
});
