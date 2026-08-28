import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const sidebarPath = new URL(
    '../../resources/js/components/app-sidebar.tsx',
    import.meta.url,
);
const topbarPath = new URL(
    '../../resources/js/components/app-sidebar-header.tsx',
    import.meta.url,
);

test('sidebar uses the frosted porcelain workspace surface', async () => {
    const source = await readFile(sidebarPath, 'utf8');

    assert.match(source, /bg-\[#fbfcfe\]\/94/);
    assert.match(source, /backdrop-blur-2xl/);
    assert.match(source, /border-slate-200\/70/);
    assert.match(source, /shadow-\[8px_0_28px_rgba\(15,23,42,0\.035\)\]/);
});

test('topbar uses a lighter translucent companion surface', async () => {
    const source = await readFile(topbarPath, 'utf8');

    assert.match(source, /bg-\[#fbfcfe\]\/78/);
    assert.match(source, /backdrop-blur-2xl/);
    assert.match(source, /border-slate-200\/70/);
    assert.match(source, /shadow-\[0_8px_24px_rgba\(15,23,42,0\.035\)\]/);
});
