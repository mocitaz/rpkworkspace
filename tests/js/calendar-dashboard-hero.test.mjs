import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const componentPath = new URL(
    '../../resources/js/components/calendar-dashboard-hero.tsx',
    import.meta.url,
);

test('calendar hero combines period navigation, view control, subscription, and metrics', async () => {
    const source = await readFile(componentPath, 'utf8');

    assert.match(source, /formattedMonthTitle/);
    assert.doesNotMatch(source, /Kalender Perkara/);
    assert.match(source, /Hari Ini/);
    assert.match(source, /Bulan/);
    assert.match(source, /Daftar/);
    assert.match(source, /Langganan Kalender/);
    assert.doesNotMatch(source, /Unduh \.ics/);
    assert.match(source, /Sidang & Agenda/);
    assert.match(source, /Tenggat kritis/);
    assert.match(source, /Tugas terkait/);
    assert.match(source, /Total jadwal/);
    assert.match(source, /calendar-legal-hero-v2\.png/);
    assert.match(source, /md:max-w-\[62%\]/);
});
