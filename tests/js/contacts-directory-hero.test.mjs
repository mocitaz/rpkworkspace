import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('contact directory hero combines identity, action, metrics, and illustration', async () => {
    const componentPath = new URL(
        '../../resources/js/components/contacts-directory-hero.tsx',
        import.meta.url,
    );
    const componentSource = await readFile(componentPath, 'utf8');

    assert.match(componentSource, /Direktori Kontak/);
    assert.match(componentSource, /Tambah Kontak Baru/);
    assert.match(componentSource, /metrics\.map/);
    assert.match(componentSource, /md:grid-cols-4/);
    assert.match(componentSource, /contacts-directory-hero\.png/);
    assert.match(componentSource, /contacts-hero-line/);
    assert.match(componentSource, /onClick=\{onCreate\}/);
});

test('contact directory illustration uses a transparent PNG asset', async () => {
    const assetPath = new URL(
        '../../public/images/contacts-directory-hero.png',
        import.meta.url,
    );
    const asset = await readFile(assetPath);

    assert.equal(asset.subarray(1, 4).toString(), 'PNG');
    assert.equal(asset[25], 6);
});
