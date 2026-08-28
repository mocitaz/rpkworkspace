import assert from 'node:assert/strict';
import test from 'node:test';

test('detail header metadata only presents an available entity number', async () => {
    const modulePath = new URL(
        '../../resources/js/lib/detail-header-meta.ts',
        import.meta.url,
    );
    const detailHeaderModule = await import(modulePath).catch(() => null);

    assert.deepEqual(
        detailHeaderModule?.getDetailHeaderMetadata('RPK-2026-0001'),
        [
            {
                testId: 'detail-number-text',
                label: 'RPK-2026-0001',
                className: 'font-mono text-blue-600 dark:text-blue-400',
            },
        ],
    );

    assert.deepEqual(
        detailHeaderModule?.getDetailHeaderMetadata('CLI-2026-0001'),
        [
            {
                testId: 'detail-number-text',
                label: 'CLI-2026-0001',
                className: 'font-mono text-blue-600 dark:text-blue-400',
            },
        ],
    );

    assert.deepEqual(detailHeaderModule?.getDetailHeaderMetadata(), []);
});
