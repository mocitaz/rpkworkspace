import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const layoutPath = new URL(
    '../../resources/js/layouts/app/app-sidebar-layout.tsx',
    import.meta.url,
);
const assetPath = new URL(
    '../../resources/images/workspace-landscape-bg.png',
    import.meta.url,
);

test('workspace uses a visible fixed landscape on the application content surface', async () => {
    const source = await readFile(layoutPath, 'utf8');

    assert.match(source, /import workspaceLandscapeBackground from/);
    assert.match(source, /workspace-landscape-bg\.png/);
    assert.match(source, /backgroundImage/);
    assert.match(source, /radial-gradient/);
    assert.match(source, /linear-gradient/);
    assert.match(source, /rgba\(250, 250, 252, 0\.24\)/);
    assert.match(source, /rgba\(250, 250, 252, 0\.72\)/);
    assert.match(source, /bg-fixed/);
    assert.match(source, /bg-cover/);
    assert.match(source, /bg-bottom/);
    assert.match(source, /\[&>div\.min-h-screen\]:!bg-transparent/);
    assert.doesNotMatch(source, /workspace-landscape-background/);
    assert.doesNotMatch(source, /workspace-background-wash/);
    assert.doesNotMatch(source, /bg-\[url\('\/images\//);
});

test('workspace landscape is a valid PNG asset', async () => {
    const asset = await readFile(assetPath);

    assert.equal(asset.subarray(1, 4).toString(), 'PNG');
});
