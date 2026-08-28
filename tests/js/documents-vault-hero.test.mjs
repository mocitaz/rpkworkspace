import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('documents vault hero contains action, metrics, and transparent illustration', async () => {
    const source = await readFile(
        new URL(
            '../../resources/js/components/documents-vault-hero.tsx',
            import.meta.url,
        ),
        'utf8',
    );
    const asset = await readFile(
        new URL(
            '../../public/images/documents-vault-hero.png',
            import.meta.url,
        ),
    );
    assert.match(source, /Dokumen &amp; Repositori Legal/);
    assert.match(source, /Unggah Dokumen Privat/);
    assert.match(source, /documents-hero-line/);
    assert.match(source, /documents-vault-hero\.png/);
    assert.equal(asset[25], 6);
});
