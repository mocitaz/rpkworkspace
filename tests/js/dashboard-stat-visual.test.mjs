import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('dashboard stat illustrations derive bounded progress from real metrics', async () => {
    const modulePath = new URL(
        '../../resources/js/lib/dashboard-stat-visual.ts',
        import.meta.url,
    );
    const statVisualModule = await import(modulePath).catch(() => null);

    assert.equal(statVisualModule?.getMetricProgress(3, 12), 25);
    assert.equal(statVisualModule?.getMetricProgress(18, 12), 100);
    assert.equal(statVisualModule?.getMetricProgress(-2, 12), 0);
    assert.equal(statVisualModule?.getMetricProgress(4, 0), 0);
});

test('dashboard stat cards use the clean white reference composition', async () => {
    const componentPath = new URL(
        '../../resources/js/components/dashboard-stat-card.tsx',
        import.meta.url,
    );
    const componentSource = await readFile(componentPath, 'utf8');

    assert.match(componentSource, /bg-white/);
    assert.match(componentSource, /mt-auto/);
    assert.match(componentSource, /absolute right-0 -bottom-0\.5/);
    assert.doesNotMatch(componentSource, /bg-gradient-to-br/);
    assert.doesNotMatch(componentSource, /footer: ReactNode/);
    assert.doesNotMatch(componentSource, /action: string/);
});

test('dashboard stat cards keep the approved compact proportions', async () => {
    const componentPath = new URL(
        '../../resources/js/components/dashboard-stat-card.tsx',
        import.meta.url,
    );
    const componentSource = await readFile(componentPath, 'utf8');

    assert.match(componentSource, /min-h-\[140px\]/);
    assert.match(componentSource, /p-\[18px\]/);
    assert.match(componentSource, /size-10/);
    assert.match(componentSource, /sm:h-\[72px\] sm:w-24/);
    assert.match(componentSource, /sm:text-\[30px\]/);
    assert.doesNotMatch(componentSource, /sm:min-h-44/);
    assert.doesNotMatch(componentSource, /sm:h-24/);
});

test('dashboard stat icons use soft circles and consistent domain glyphs', async () => {
    const componentPath = new URL(
        '../../resources/js/components/dashboard-stat-card.tsx',
        import.meta.url,
    );
    const componentSource = await readFile(componentPath, 'utf8');

    assert.match(componentSource, /size-10[^']*rounded-full/);
    assert.match(componentSource, /ListChecks/);
    assert.match(componentSource, /CalendarClock/);
    assert.match(componentSource, /FileCheck2/);
    assert.match(componentSource, /size-\[18px\]/);
    assert.match(componentSource, /strokeWidth=\{1\.8\}/);
    assert.doesNotMatch(componentSource, /rounded-xl transition-transform/);
});

test('dashboard stat values share an explicit bottom baseline', async () => {
    const componentPath = new URL(
        '../../resources/js/components/dashboard-stat-card.tsx',
        import.meta.url,
    );
    const componentSource = await readFile(componentPath, 'utf8');

    assert.match(componentSource, /absolute bottom-2 left-0/);
    assert.doesNotMatch(componentSource, /flex h-full max-w-\[50%\] items-end/);
});
