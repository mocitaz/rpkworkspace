import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const componentPath = new URL(
    '../../resources/js/components/calendar-dashboard-hero.tsx',
    import.meta.url,
);
const imagePath = new URL(
    '../../public/images/calendar-legal-hero-v3.png',
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
    assert.match(source, /calendar-legal-hero-v3\.png/);
    assert.match(source, /h-\[240px\] w-\[340px\]/);
    assert.match(source, /translate-y-\[7%\]/);
    assert.match(source, /object-contain object-bottom/);
    assert.match(source, /md:max-w-\[62%\]/);
});

test('calendar hero illustration uses genuine PNG transparency', async () => {
    const image = await readFile(imagePath);

    assert.equal(image.subarray(1, 4).toString(), 'PNG');
    assert.equal(image[25], 6);
});
