import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('sidebar places the email profile beneath the brand instead of the footer', async () => {
    const sidebarPath = new URL(
        '../../resources/js/components/app-sidebar.tsx',
        import.meta.url,
    );
    const sidebarSource = await readFile(sidebarPath, 'utf8');
    const headerSource = sidebarSource.slice(
        sidebarSource.indexOf('<SidebarHeader'),
        sidebarSource.indexOf('</SidebarHeader>'),
    );
    const footerSource = sidebarSource.slice(
        sidebarSource.indexOf('<SidebarFooter'),
        sidebarSource.indexOf('</SidebarFooter>'),
    );

    assert.match(headerSource, /<NavUser variant="header" \/>/);
    assert.doesNotMatch(footerSource, /<NavUser/);
});

test('header profile is a centered non-interactive identity block', async () => {
    const navUserPath = new URL(
        '../../resources/js/components/nav-user.tsx',
        import.meta.url,
    );
    const navUserSource = await readFile(navUserPath, 'utf8');

    const headerStart = navUserSource.indexOf('if (isHeader)');
    const headerReturn = navUserSource.indexOf('return (', headerStart);
    const footerReturn = navUserSource.indexOf('return (', headerReturn + 8);
    const headerProfileSource = navUserSource.slice(headerStart, footerReturn);

    assert.match(navUserSource, /variant\?: 'footer' \| 'header'/);
    assert.match(headerProfileSource, /data-sidebar-profile="header"/);
    assert.match(headerProfileSource, /flex-col/);
    assert.match(headerProfileSource, /auth\.user\.email/);
    assert.match(headerProfileSource, /size-12/);
    assert.doesNotMatch(headerProfileSource, /bg-gradient-to-b/);
    assert.doesNotMatch(headerProfileSource, /border-slate-200\/70/);
    assert.doesNotMatch(headerProfileSource, /shadow-\[0_3px_12px/);
    assert.doesNotMatch(headerProfileSource, /DropdownMenu/);
    assert.doesNotMatch(headerProfileSource, /button/);
});

test('sidebar brand keeps only the RPK App name', async () => {
    const logoPath = new URL(
        '../../resources/js/components/app-logo.tsx',
        import.meta.url,
    );
    const logoSource = await readFile(logoPath, 'utf8');

    assert.match(logoSource, /RPK App/);
    assert.doesNotMatch(logoSource, /ADVOCATES/);
    assert.doesNotMatch(logoSource, /LEGAL SYSTEM/);
});

test('active sidebar navigation uses a simple neutral treatment', async () => {
    const navMainPath = new URL(
        '../../resources/js/components/nav-main.tsx',
        import.meta.url,
    );
    const navMainSource = await readFile(navMainPath, 'utf8');

    assert.match(navMainSource, /bg-slate-100 font-semibold text-slate-950/);
    assert.match(navMainSource, /text-slate-700 dark:text-zinc-100/);
    assert.doesNotMatch(navMainSource, /shadow-\[inset_2px_0_0_#2563eb\]/);
    assert.doesNotMatch(navMainSource, /text-blue-600 dark:text-blue-400/);
});
