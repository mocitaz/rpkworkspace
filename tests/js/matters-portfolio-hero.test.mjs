import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('matter portfolio hero combines page identity, action, metrics, and illustration', async () => {
    const componentPath = new URL(
        '../../resources/js/components/matters-portfolio-hero.tsx',
        import.meta.url,
    );
    const componentSource = await readFile(componentPath, 'utf8');

    assert.match(componentSource, /Portofolio Perkara/);
    assert.match(
        componentSource,
        /Pantau perkara, penugasan, sidang, dan tenggat/,
    );
    assert.doesNotMatch(componentSource, /Matter portfolio/);
    assert.match(componentSource, /Registrasi Perkara Baru/);
    assert.match(componentSource, /metrics\.map/);
    assert.match(componentSource, /grid-cols-2/);
    assert.match(componentSource, /md:grid-cols-4/);
    assert.match(componentSource, /matters-portfolio-lawyer\.png/);
    assert.match(componentSource, /min-h-\[250px\]/);
    assert.match(componentSource, /matters-hero-line/);
    assert.match(componentSource, /matters-hero-line-secondary/);
    assert.match(componentSource, /text-white\/90/);
    assert.match(componentSource, /matters-hero-dots/);
    assert.match(componentSource, /matters-hero-glow/);
    assert.match(componentSource, /matters-hero-lawyer/);
});

test('matter portfolio lawyer uses a transparent PNG asset', async () => {
    const assetPath = new URL(
        '../../public/images/matters-portfolio-lawyer.png',
        import.meta.url,
    );
    const asset = await readFile(assetPath);

    assert.equal(asset.subarray(1, 4).toString(), 'PNG');
    assert.equal(asset[25], 6);
});
