import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('dashboard bento panels stay compact without internal scrollbars or boxed statuses', async () => {
    const dashboardPath = new URL(
        '../../resources/js/pages/dashboard.tsx',
        import.meta.url,
    );
    const dashboardSource = await readFile(dashboardPath, 'utf8');

    assert.match(dashboardSource, /h-\[320px\]/);
    assert.match(dashboardSource, /currentQueueItems\s*\.slice\(0, 4\)/);
    assert.match(dashboardSource, /executive_actions\s*\.slice\(0, 4\)/);
    assert.match(dashboardSource, /case_milestones\s*\.slice\(0, 4\)/);
    assert.doesNotMatch(dashboardSource, /h-\[390px\]/);
    assert.doesNotMatch(dashboardSource, /\[scrollbar-width:thin\]/);
    assert.doesNotMatch(dashboardSource, /Buka Seluruh Daftar Tugas/);
    assert.doesNotMatch(dashboardSource, /Buka Kalender &amp; Agenda/);
    assert.doesNotMatch(dashboardSource, /Buka Daftar Prioritas/);
    assert.doesNotMatch(dashboardSource, /Buka Seluruh Perkara/);
});

test('dashboard bento statuses render as plain colored text', async () => {
    const dashboardPath = new URL(
        '../../resources/js/pages/dashboard.tsx',
        import.meta.url,
    );
    const dashboardSource = await readFile(dashboardPath, 'utf8');

    assert.match(dashboardSource, /const statusColorClass/);
    assert.doesNotMatch(dashboardSource, /const badgeColorClass/);
    assert.doesNotMatch(dashboardSource, /size-1\.5 shrink-0 rounded-full/);
});
