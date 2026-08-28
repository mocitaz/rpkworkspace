import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const pagePath = new URL(
    '../../resources/js/pages/matters/index.tsx',
    import.meta.url,
);

test('matter desktop table renders status and priority as solid text', async () => {
    const source = await readFile(pagePath, 'utf8');
    const desktopTable = source.slice(
        source.indexOf('Desktop Data Table'),
        source.indexOf('</table>'),
    );

    assert.match(desktopTable, /<StatusText\s+value=\{\s*matter\.status/);
    assert.match(desktopTable, /<StatusText\s+value=\{\s*matter\.priority/);
    assert.doesNotMatch(desktopTable, /<StatusBadge/);
    assert.match(desktopTable, /text-center font-semibold">\s*Status\s*<\/th>/);
    assert.match(
        desktopTable,
        /text-center font-semibold">\s*Prioritas\s*<\/th>/,
    );
    assert.equal(
        desktopTable.match(
            /<td className="[^"]*text-center whitespace-nowrap">\s*<StatusText/g,
        )?.length,
        2,
    );
});
