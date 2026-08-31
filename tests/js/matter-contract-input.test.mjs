import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('matter forms expose contract and billing fields', async () => {
    const create = await readFile(
        new URL('../../resources/js/pages/matters/create.tsx', import.meta.url),
        'utf8',
    );
    const edit = await readFile(
        new URL('../../resources/js/pages/matters/edit.tsx', import.meta.url),
        'utf8',
    );

    for (const source of [create, edit]) {
        assert.match(source, /Informasi Kontrak &amp; Keuangan/);
        assert.match(source, /name="budget_amount"/);
        assert.match(source, /name="currency"/);
        assert.match(source, /name="contract_date"/);
        assert.match(source, /name="billing_model"/);
    }
});

test('finance profitability table exposes quick contract editing', async () => {
    const source = await readFile(
        new URL(
            '../../resources/js/pages/finance/components/profitability-table.tsx',
            import.meta.url,
        ),
        'utf8',
    );

    assert.match(source, /Atur Nilai Kontrak/);
    assert.match(
        source,
        /\/finance\/matters\/\$\{selectedMatter\.id\}\/contract/,
    );
});
