import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('governance hero combines actions, metrics, and illustration', async () => {
    const path = new URL(
        '../../resources/js/components/governance-compliance-hero.tsx',
        import.meta.url,
    );
    const source = await readFile(path, 'utf8');

    assert.match(source, /Tata Kelola &amp; Kepatuhan/);
    assert.match(source, /Jalankan Conflict Check/);
    assert.match(source, /Catat Korespondensi/);
    assert.match(source, /metrics\.map/);
    assert.match(source, /governance-compliance-hero\.png/);
    assert.match(source, /governance-hero-line/);
});

test('governance illustration uses a transparent PNG asset', async () => {
    const asset = await readFile(
        new URL(
            '../../public/images/governance-compliance-hero.png',
            import.meta.url,
        ),
    );
    assert.equal(asset.subarray(1, 4).toString(), 'PNG');
    assert.equal(asset[25], 6);
});
