import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const heroFiles = [
    'matters-portfolio-hero.tsx',
    'clients-directory-hero.tsx',
    'contacts-directory-hero.tsx',
    'tasks-work-hero.tsx',
    'calendar-dashboard-hero.tsx',
    'governance-compliance-hero.tsx',
    'documents-vault-hero.tsx',
    'personnel-access-hero.tsx',
    'audit-log-hero.tsx',
    'finance-dashboard-hero.tsx',
];

test('header statistic values use a neutral black color', async () => {
    for (const heroFile of heroFiles) {
        const source = await readFile(
            new URL(
                `../../resources/js/components/${heroFile}`,
                import.meta.url,
            ),
            'utf8',
        );

        assert.match(source, /text-slate-950 dark:text-white/, heroFile);
    }
});
