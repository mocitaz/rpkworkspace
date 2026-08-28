import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const layoutPath = new URL(
    '../../resources/js/layouts/app/app-sidebar-layout.tsx',
    import.meta.url,
);
const cssPath = new URL('../../resources/css/app.css', import.meta.url);
const dashboardHeroPath = new URL(
    '../../resources/js/components/dashboard-welcome-hero.tsx',
    import.meta.url,
);
const auditHeroPath = new URL(
    '../../resources/js/components/audit-log-hero.tsx',
    import.meta.url,
);

test('application layout enables shared mobile-safe behavior', async () => {
    const source = await readFile(layoutPath, 'utf8');

    assert.match(source, /workspace-mobile-safe/);
});

test('mobile foundation constrains pages and dialogs to the viewport', async () => {
    const source = await readFile(cssPath, 'utf8');

    assert.match(source, /@media \(width < 40rem\)/);
    assert.match(source, /\.workspace-mobile-safe/);
    assert.match(source, /max-width: 100%/);
    assert.match(source, /\[data-slot='dialog-content'\]/);
    assert.match(source, /calc\(100dvh - 1rem\)/);
    assert.match(source, /overscroll-behavior-inline: contain/);
});

test('high-risk hero content can wrap naturally on phones', async () => {
    const dashboardSource = await readFile(dashboardHeroPath, 'utf8');
    const auditSource = await readFile(auditHeroPath, 'utf8');

    assert.match(dashboardSource, /min-h-\[202px\]/);
    assert.match(dashboardSource, /max-w-full/);
    assert.match(auditSource, /flex-wrap/);
});
