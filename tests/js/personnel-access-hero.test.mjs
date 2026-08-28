import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('personnel hero contains metrics and transparent illustration', async () => {
    const source = await readFile(
        new URL(
            '../../resources/js/components/personnel-access-hero.tsx',
            import.meta.url,
        ),
        'utf8',
    );
    const asset = await readFile(
        new URL(
            '../../public/images/personnel-access-hero.png',
            import.meta.url,
        ),
    );
    assert.match(source, /Personel &amp; Hak Akses/);
    assert.match(source, /Tambah Staf Baru/);
    assert.match(source, /personnel-access-hero\.png/);
    assert.match(source, /h-\[255px\]/);
    assert.match(source, /w-\[465px\]/);
    assert.match(source, /translate-y-\[3%\]/);
    assert.equal(asset[25], 6);
});
