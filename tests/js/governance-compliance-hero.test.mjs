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

test('governance workspace uses finance-style tabs and table rows', async () => {
    const path = new URL(
        '../../resources/js/pages/governance/index.tsx',
        import.meta.url,
    );
    const source = await readFile(path, 'utf8');

    assert.doesNotMatch(source, /Semua Modul/);
    assert.doesNotMatch(source, /activeTab === 'all'/);
    assert.match(source, />\('correspondence'\);/);
    assert.match(source, /const governanceTabClass/);
    assert.match(source, /Korespondensi · \{correspondences\.length\}/);
    assert.match(source, /Conflict Checks · \{conflictChecks\.length\}/);
    assert.match(source, /Legal Hold &amp; Handover · \{matters\.length\}/);
    assert.match(source, /Korespondensi &amp;[\s\S]*Perkara/);
    assert.match(source, /Pihak &amp; Hasil[\s\S]*Pemeriksaan/);
    assert.match(source, /Perkara &amp; Status/);
    assert.match(source, /last:border-b-0 hover:bg-slate-50\/70/);
    assert.doesNotMatch(source, /StatusBadge/);
    assert.doesNotMatch(source, /Status Icon Badge/);
    assert.doesNotMatch(source, /Direction Icon Badge/);
    assert.match(source, /text-emerald-600 dark:text-emerald-400/);
    assert.match(source, /text-rose-600 dark:text-rose-400/);
    assert.match(source, /text-amber-600 dark:text-amber-400/);
});

test('conflict and legal hold actions use compact button sizing', async () => {
    const path = new URL(
        '../../resources/js/pages/governance/index.tsx',
        import.meta.url,
    );
    const source = await readFile(path, 'utf8');

    assert.match(
        source,
        /const governanceCompactButtonClass =\s*'h-6\.5 gap-1 rounded-md px-2 text-\[10px\] font-semibold'/,
    );
    assert.match(source, /className=\{`\$\{governanceCompactButtonClass\}/);
    assert.ok(
        (source.match(/\$\{governanceCompactButtonClass\}/g) ?? []).length >= 9,
    );
});

test('governance rows use finance-style accent lines and legal hold filtering', async () => {
    const path = new URL(
        '../../resources/js/pages/governance/index.tsx',
        import.meta.url,
    );
    const source = await readFile(path, 'utf8');

    assert.match(source, /border-l-2 border-blue-500 pl-3/);
    assert.match(source, /const conflictAccentClass/);
    assert.match(source, /const matterAccentClass/);
    assert.match(source, /const \[matterSearch, setMatterSearch\]/);
    assert.match(source, /const \[matterStatusFilter, setMatterStatusFilter\]/);
    assert.match(source, /const filteredMatters = matters\.filter/);
    assert.match(source, /placeholder="Cari nomor perkara, judul, atau klien/);
    assert.match(source, /Legal Hold Aktif/);
    assert.match(source, /Diarsipkan/);
    assert.doesNotMatch(source, /Bundel Handover Siap\s*Unduh/);
    assert.doesNotMatch(source, /Status Legal Hold melindungi seluruh berkas/);
});

test('conflict decision notes size to their content and wrap safely', async () => {
    const path = new URL(
        '../../resources/js/pages/governance/index.tsx',
        import.meta.url,
    );
    const source = await readFile(path, 'utf8');

    assert.match(
        source,
        /inline-flex w-fit max-w-full items-start rounded-md bg-slate-50/,
    );
    assert.match(source, /break-words whitespace-normal/);
});

test('all governance dialogs share one aligned visual system', async () => {
    const path = new URL(
        '../../resources/js/pages/governance/index.tsx',
        import.meta.url,
    );
    const source = await readFile(path, 'utf8');

    assert.match(source, /function GovernanceDialogHeader/);
    assert.match(source, /const governanceDialogPanelClass/);
    assert.match(source, /const governanceDialogFooterClass/);
    assert.ok((source.match(/<GovernanceDialogHeader/g) ?? []).length === 4);
    assert.match(source, /eyebrow="Korespondensi Perkara"/);
    assert.match(source, /eyebrow="Kepatuhan & Etik"/);
    assert.match(source, /eyebrow="Arsip & Serah Terima"/);
    assert.match(source, /eyebrow="Review Conflict Check"/);
    assert.doesNotMatch(source, /rounded-3xl border border-slate-200\/90/);
});
