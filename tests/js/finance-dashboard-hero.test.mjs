import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const componentPath = new URL(
    '../../resources/js/components/finance-dashboard-hero.tsx',
    import.meta.url,
);
const imagePath = new URL(
    '../../public/images/finance-dashboard-hero.png',
    import.meta.url,
);

test('finance hero keeps scope navigation interactive without header actions', async () => {
    const source = await readFile(componentPath, 'utf8');

    assert.match(source, /Keuangan Firma Hukum RPK/);
    assert.doesNotMatch(source, /Financial workspace/);
    assert.doesNotMatch(
        source,
        /Titipan Klien|Quotation|Biaya Perkara|Pembayaran|Buat Invoice/,
    );
    assert.match(source, /onScopeChange\(item\.id\)/);
    assert.match(source, /Perkara & Klien/);
    assert.match(source, /Operasional Firma/);
    assert.match(source, /Laporan & Neraca/);
    assert.match(source, /Analisis Keuangan/);
});

test('finance hero illustration is a valid RGB PNG', async () => {
    const image = await readFile(imagePath);

    assert.equal(image.subarray(1, 4).toString(), 'PNG');
    assert.equal(image[25], 2);
});
