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
    assert.match(source, /bg-slate-100[^\n]+text-slate-900/);
    assert.match(source, /font-semibold text-slate-900 dark:text-white/);
});
