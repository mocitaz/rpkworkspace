import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const menuPath = new URL(
    '../../resources/js/components/user-menu-content.tsx',
    import.meta.url,
);
const headerPath = new URL(
    '../../resources/js/components/app-sidebar-header.tsx',
    import.meta.url,
);
const legacyHeaderPath = new URL(
    '../../resources/js/components/app-header.tsx',
    import.meta.url,
);
const sidebarProfilePath = new URL(
    '../../resources/js/components/nav-user.tsx',
    import.meta.url,
);

test('profile dropdown uses a clean executive menu without subtitles', async () => {
    const source = await readFile(menuPath, 'utf8');

    assert.doesNotMatch(source, /Akun aktif/);
    assert.doesNotMatch(source, /bg-emerald-500/);
    assert.match(source, /Pengaturan Akun/);
    assert.match(source, /Panduan Penggunaan/);
    assert.match(source, /Keluar dari Workspace/);
    assert.match(source, /size-8\.5/);
    assert.doesNotMatch(source, /ChevronRight/);
    assert.doesNotMatch(source, /bg-gradient-to-br/);
    assert.doesNotMatch(source, /Pengaturan \/ Settings/);
    assert.doesNotMatch(source, /Cara Penggunaan/);
    assert.doesNotMatch(source, /Profil, keamanan/);
});

test('all profile dropdown surfaces use the wider executive width', async () => {
    const sources = await Promise.all(
        [headerPath, legacyHeaderPath, sidebarProfilePath].map((path) =>
            readFile(path, 'utf8'),
        ),
    );

    for (const source of sources) {
        assert.match(source, /w-\[252px\]/);
    }
});
