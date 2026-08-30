import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('partner transaction register exposes its finance proof action', async () => {
    const component = await readFile(
        new URL(
            '../../resources/js/pages/finance/components/partner-advances-view.tsx',
            import.meta.url,
        ),
        'utf8',
    );
    const page = await readFile(
        new URL('../../resources/js/pages/finance/index.tsx', import.meta.url),
        'utf8',
    );

    assert.match(component, /entity: 'partner-transactions'/);
    assert.match(component, /Lihat Bukti Transaksi Partner/);
    assert.match(component, /Unggah Bukti Transaksi Partner/);
    assert.match(component, /<Paperclip className="size-3\.5" \/>/);
    assert.match(page, /onViewProof=\{setProofTarget\}/);
});

test('payroll register exposes its finance proof action', async () => {
    const component = await readFile(
        new URL(
            '../../resources/js/pages/finance/components/payroll-view.tsx',
            import.meta.url,
        ),
        'utf8',
    );

    assert.match(component, /entity: 'payrolls'/);
    assert.match(component, /Lihat Bukti Pembayaran Gaji/);
    assert.match(component, /Unggah Bukti Pembayaran Gaji/);
    assert.match(component, /<Paperclip className="size-3\.5" \/>/);
});
