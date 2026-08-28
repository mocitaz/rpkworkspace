import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('finance aging analysis uses one compact row with readable labels', async () => {
    const source = await readFile(
        new URL('../../resources/js/pages/finance/index.tsx', import.meta.url),
        'utf8',
    );

    assert.match(source, /grid min-w-\[620px\] grid-cols-5/);
    assert.match(source, /overflow-x-auto overscroll-x-contain/);
    assert.match(source, /Belum jatuh tempo/);
    assert.match(source, /1–30 hari/);
    assert.match(source, /> 90 hari/);
});
