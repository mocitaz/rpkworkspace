import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const pagePath = new URL(
    '../../resources/js/pages/clients/index.tsx',
    import.meta.url,
);

test('client table removes count columns and renders centered solid status text', async () => {
    const source = await readFile(pagePath, 'utf8');
    const desktopTable = source.slice(
        source.indexOf('Desktop Table'),
        source.indexOf('</table>'),
    );

    assert.match(desktopTable, /table-fixed/);
    assert.doesNotMatch(desktopTable, />\s*Matter\s*<\/th>/);
    assert.doesNotMatch(desktopTable, />\s*Kontak\s*<\/th>/);
    assert.doesNotMatch(desktopTable, /matters_count|contacts_count/);
    assert.match(desktopTable, /text-center font-semibold">\s*Status\s*<\/th>/);
    assert.match(
        desktopTable,
        /<td className="[^"]*text-center whitespace-nowrap">\s*<StatusText/,
    );
    assert.doesNotMatch(desktopTable, /<StatusBadge/);
});
