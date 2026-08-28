import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('audit hero has actions metrics and transparent asset', async () => {
    const source = await readFile(
        new URL(
            '../../resources/js/components/audit-log-hero.tsx',
            import.meta.url,
        ),
        'utf8',
    );
    const asset = await readFile(
        new URL('../../public/images/audit-log-hero.png', import.meta.url),
    );
    assert.match(source, /Audit Log &amp; Jejak Aktivitas/);
    assert.match(source, /Bersihkan Log/);
    assert.match(source, /Ekspor CSV Kepatuhan/);
    assert.match(source, /h-\[255px\]/);
    assert.match(source, /translate-y-\[12%\]/);
    assert.equal(asset[25], 6);
});
