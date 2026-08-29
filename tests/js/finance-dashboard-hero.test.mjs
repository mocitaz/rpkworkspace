import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const componentPath = new URL(
    '../../resources/js/components/finance-dashboard-hero.tsx',
    import.meta.url,
);
const imagePath = new URL(
    '../../public/images/finance-dashboard-hero-v3.png',
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

test('finance hero uses a compact transparent illustration', async () => {
    const source = await readFile(componentPath, 'utf8');
    const image = await readFile(imagePath);

    assert.match(source, /finance-dashboard-hero-v3\.png/);
    assert.match(source, /h-\[252px\] w-\[340px\]/);
    assert.match(source, /object-contain object-bottom/);
    assert.equal(image.subarray(1, 4).toString(), 'PNG');
    assert.equal(image.includes(Buffer.from('tRNS')), true);
});
