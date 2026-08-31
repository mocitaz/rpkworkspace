import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('profitability amounts and percentages use neutral solid text', async () => {
    const source = await readFile(
        new URL(
            '../../resources/js/pages/finance/components/profitability-table.tsx',
            import.meta.url,
        ),
        'utf8',
    );

    assert.doesNotMatch(source, /font-mono[^\n]+text-(?:blue|emerald|rose)-/);
    assert.match(
        source,
        /font-mono text-base font-bold text-slate-950 dark:text-white/,
    );
    assert.match(source, /Realisasi penagihan/);
    assert.match(source, /Kas diterima terhadap kontrak/);
    assert.match(source, /bg-emerald-400/);
    assert.match(source, /bg-\[#eef5ff\]/);
    assert.doesNotMatch(source, /bg-slate-950/);
    assert.match(source, /function ProgressRing/);
    assert.match(source, /Kolektibilitas tagihan/);
    assert.match(source, /Rasio biaya/);
});
