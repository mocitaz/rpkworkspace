import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const pagePath = new URL(
    '../../resources/js/pages/calendar/index.tsx',
    import.meta.url,
);

test('calendar month grid renders weekends and national holidays in red without event dots', async () => {
    const source = await readFile(pagePath, 'utf8');

    assert.match(source, /holidays: Holiday\[\]/);
    assert.match(source, /isWeekend/);
    assert.match(source, /holidayByDate/);
    assert.match(source, /holiday\.name/);
    assert.doesNotMatch(source, /const dotStyle/);
    assert.doesNotMatch(source, /size-1\.5 rounded-full/);
});
