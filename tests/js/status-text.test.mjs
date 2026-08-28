import assert from 'node:assert/strict';
import test from 'node:test';

test('status text uses solid semantic colors and separators only between items', async () => {
    const modulePath = new URL(
        '../../resources/js/lib/status-text.ts',
        import.meta.url,
    );
    const statusTextModule = await import(modulePath).catch(() => null);

    assert.deepEqual(
        statusTextModule?.getStatusTextItems([
            'critical',
            'in_progress',
            'restricted',
        ]),
        [
            {
                value: 'critical',
                label: 'Kritis',
                colorClass: 'text-rose-600 dark:text-rose-400',
                hasLeadingSeparator: false,
            },
            {
                value: 'in_progress',
                label: 'Dikerjakan',
                colorClass: 'text-blue-600 dark:text-blue-400',
                hasLeadingSeparator: true,
            },
            {
                value: 'restricted',
                label: 'Terbatas',
                colorClass: 'text-rose-600 dark:text-rose-400',
                hasLeadingSeparator: true,
            },
        ],
    );

    assert.deepEqual(
        statusTextModule
            ?.getStatusTextItems([
                'rejected',
                'pending_documents',
                'in_review',
                'verified',
                'complete',
                'incomplete',
            ])
            .map(({ label, colorClass }) => ({ label, colorClass })),
        [
            {
                label: 'Ditolak / Risiko Tinggi',
                colorClass: 'text-rose-600 dark:text-rose-400',
            },
            {
                label: 'Menunggu Berkas',
                colorClass: 'text-amber-600 dark:text-amber-400',
            },
            {
                label: 'Dalam Penelaahan',
                colorClass: 'text-blue-600 dark:text-blue-400',
            },
            {
                label: 'Terverifikasi',
                colorClass: 'text-emerald-600 dark:text-emerald-400',
            },
            {
                label: 'Lengkap',
                colorClass: 'text-emerald-600 dark:text-emerald-400',
            },
            {
                label: 'Belum Terlampir',
                colorClass: 'text-amber-600 dark:text-amber-400',
            },
        ],
    );
});
