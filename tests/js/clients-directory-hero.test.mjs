import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('client directory hero combines identity, action, metrics, and illustration', async () => {
    const componentPath = new URL(
        '../../resources/js/components/clients-directory-hero.tsx',
        import.meta.url,
    );
    const componentSource = await readFile(componentPath, 'utf8');

    assert.match(componentSource, /Direktori Klien/);
    assert.match(componentSource, /Registrasi Klien Baru/);
    assert.match(componentSource, /metrics\.map/);
    assert.match(componentSource, /md:grid-cols-4/);
    assert.match(componentSource, /clients-directory-hero\.png/);
    assert.match(componentSource, /clients-hero-line/);
    assert.match(componentSource, /clients-hero-people/);
    assert.match(componentSource, /h-\[255px\]/);
    assert.match(componentSource, /translate-y-\[7%\]/);
});

test('client directory illustration uses a transparent PNG asset', async () => {
    const assetPath = new URL(
        '../../public/images/clients-directory-hero.png',
        import.meta.url,
    );
    const asset = await readFile(assetPath);

    assert.equal(asset.subarray(1, 4).toString(), 'PNG');
    assert.equal(asset[25], 6);
});
