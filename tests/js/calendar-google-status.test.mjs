import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const pagePath = new URL(
    '../../resources/js/pages/calendar/index.tsx',
    import.meta.url,
);
const heroPath = new URL(
    '../../resources/js/components/calendar-dashboard-hero.tsx',
    import.meta.url,
);

test('calendar page and sync modal expose Google connection status with the Google logo', async () => {
    const [page, hero] = await Promise.all([
        readFile(pagePath, 'utf8'),
        readFile(heroPath, 'utf8'),
    ]);

    assert.match(page, /GoogleLogo/);
    assert.match(page, /Buat kalender RPK khusus di akun Google Anda\./);
    assert.match(page, /connection\?\.google_account_email/);
    assert.match(hero, /GoogleLogo/);
    assert.match(hero, /googleConnected/);
    assert.match(hero, /Google terhubung/);
    assert.match(hero, /Google belum terhubung/);
});

test('calendar sync modal identifies Apple Calendar with the Apple logo', async () => {
    const page = await readFile(pagePath, 'utf8');

    assert.match(page, /AppleLogo/);
    assert.match(page, /Apple Calendar/);
    assert.doesNotMatch(page, /<Laptop className="size-4"/);
});
