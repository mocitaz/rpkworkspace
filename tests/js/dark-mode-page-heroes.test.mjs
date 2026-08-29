import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const heroes = [
    ['clients-directory-hero.tsx', 'clients-directory-hero'],
    ['contacts-directory-hero.tsx', 'contacts-directory-hero'],
    ['tasks-work-hero.tsx', 'tasks-work-hero'],
    ['calendar-dashboard-hero.tsx', 'calendar-legal-hero-v3'],
    ['finance-dashboard-hero.tsx', 'finance-dashboard-hero-v3'],
    ['governance-compliance-hero.tsx', 'governance-compliance-hero'],
    ['documents-vault-hero.tsx', 'documents-vault-hero'],
    ['audit-log-hero.tsx', 'audit-log-hero'],
];

function hasPngTransparency(asset) {
    const colorType = asset[25];
    const hasAlphaColorType = colorType === 4 || colorType === 6;
    const hasTransparencyChunk = asset.includes(Buffer.from('tRNS'));

    return hasAlphaColorType || hasTransparencyChunk;
}

for (const [componentName, assetName] of heroes) {
    test(`${componentName} keeps its illustration transparent in dark mode`, async () => {
        const component = await readFile(
            new URL(
                `../../resources/js/components/${componentName}`,
                import.meta.url,
            ),
            'utf8',
        );
        const lightAsset = await readFile(
            new URL(`../../public/images/${assetName}.png`, import.meta.url),
        );

        assert.match(component, new RegExp(`${assetName}\\.png`));
        assert.doesNotMatch(component, new RegExp(`${assetName}-dark\\.png`));
        assert.doesNotMatch(component, /dark:hidden/);
        assert.equal(lightAsset.subarray(1, 4).toString(), 'PNG');
        assert.equal(hasPngTransparency(lightAsset), true);
    });
}

test('settings layout already provides native dark surfaces and typography', async () => {
    const source = await readFile(
        new URL(
            '../../resources/js/layouts/settings/layout.tsx',
            import.meta.url,
        ),
        'utf8',
    );

    assert.match(source, /dark:bg-\[#0c0d10\]/);
    assert.match(source, /dark:bg-\[#14161b\]/);
    assert.match(source, /dark:text-white/);
    assert.match(source, /dark:border-white\/\[0\.06\]/);
});
