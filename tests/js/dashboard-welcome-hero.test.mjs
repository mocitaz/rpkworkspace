import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('welcome hero greets users with their first two names', async () => {
    const modulePath = new URL(
        '../../resources/js/lib/dashboard-welcome.ts',
        import.meta.url,
    );
    const welcomeModule = await import(modulePath).catch(() => null);

    assert.equal(
        welcomeModule?.getDashboardDisplayName('Muhamad Fajar Roni, S.H.'),
        'Muhamad Fajar',
    );
    assert.equal(welcomeModule?.getDashboardDisplayName('Sonia'), 'Sonia');
    assert.equal(welcomeModule?.getDashboardDisplayName('  '), 'Rekan');
});

test('welcome hero uses an Indonesian time-aware greeting', async () => {
    const modulePath = new URL(
        '../../resources/js/lib/dashboard-welcome.ts',
        import.meta.url,
    );
    const welcomeModule = await import(modulePath).catch(() => null);

    assert.equal(welcomeModule?.getDashboardGreeting(8), 'Selamat pagi');
    assert.equal(welcomeModule?.getDashboardGreeting(12), 'Selamat siang');
    assert.equal(welcomeModule?.getDashboardGreeting(16), 'Selamat sore');
    assert.equal(welcomeModule?.getDashboardGreeting(21), 'Selamat malam');
});

test('welcome hero uses a bright illustrated banner without action buttons', async () => {
    const componentPath = new URL(
        '../../resources/js/components/dashboard-welcome-hero.tsx',
        import.meta.url,
    );
    const componentSource = await readFile(componentPath, 'utf8');

    assert.match(componentSource, /from-white/);
    assert.match(componentSource, /sm:h-\[195px\]/);
    assert.match(componentSource, /dashboard-legal-team-hero\.png/);
    assert.match(componentSource, /dashboard-legal-team-hero-dark\.png/);
    assert.match(componentSource, /dark:hidden/);
    assert.match(componentSource, /dark:block/);
    assert.match(componentSource, /dashboard-hero-team/);
    assert.match(componentSource, /w-\[520px\][^"]*overflow-hidden/);
    assert.match(componentSource, /object-cover/);
    assert.match(componentSource, /object-top/);
    assert.match(componentSource, /mask-image:linear-gradient/);
    assert.match(componentSource, /sm:max-w-\[50%\]/);
    assert.match(componentSource, /sm:text-\[31px\]/);
    assert.match(componentSource, /radial-gradient/);
    assert.doesNotMatch(componentSource, /function LegalBriefingVisual/);
    assert.doesNotMatch(componentSource, /Legal workspace/);
    assert.doesNotMatch(componentSource, /dateLabel/);
    assert.doesNotMatch(componentSource, /actions: ReactNode/);
    assert.doesNotMatch(componentSource, /\{actions\}/);
});

test('welcome hero provides valid light and dark illustration assets', async () => {
    const lightAsset = await readFile(
        new URL(
            '../../public/images/dashboard-legal-team-hero.png',
            import.meta.url,
        ),
    );
    const darkAsset = await readFile(
        new URL(
            '../../public/images/dashboard-legal-team-hero-dark.png',
            import.meta.url,
        ),
    );

    assert.equal(lightAsset.subarray(1, 4).toString(), 'PNG');
    assert.equal(darkAsset.subarray(1, 4).toString(), 'PNG');
});
