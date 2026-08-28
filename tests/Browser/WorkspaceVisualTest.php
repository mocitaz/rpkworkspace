<?php

use App\Models\Matter;
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
        'document.view',
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

test('the matter header only presents the matter number', function () {
    $user = rafUser(['matter.view']);
    $user->update(['password' => 'password']);

    $matter = Matter::factory()->recycle($user)->create([
        'matter_number' => 'RPK-2026-0001',
        'status' => 'active',
        'priority' => 'critical',
        'confidentiality_level' => 'restricted',
    ]);

    $page = visit('/login')
        ->inLightMode()
        ->on()
        ->desktop()
        ->fill('email', $user->email)
        ->fill('password', 'password')
        ->click('Masuk ke Workspace')
        ->wait(1)
        ->navigate(route('matters.show', $matter))
        ->assertSee('RPK-2026-0001')
        ->assertPresent('[data-testid="detail-number-text"]')
        ->assertMissing('[data-testid="matter-status-text"]')
        ->assertMissing('[data-testid="matter-priority-text"]')
        ->assertMissing('[data-testid="matter-confidentiality-text"]');

    $style = $page->script(<<<'JS'
        () => {
            const element = document.querySelector('[data-testid="detail-number-text"]');
            const computedStyle = window.getComputedStyle(element);

            return {
                childElementCount: element.childElementCount,
                backgroundColor: computedStyle.backgroundColor,
                borderTopStyle: computedStyle.borderTopStyle,
            };
        }
    JS);

    expect($style)
        ->childElementCount->toBe(0)
        ->backgroundColor->toBe('rgba(0, 0, 0, 0)')
        ->borderTopStyle->toBe('none');
});
