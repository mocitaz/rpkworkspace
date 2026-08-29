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
const darkAssetPath = new URL(
    '../../resources/images/workspace-architectural-dark-bg.png',
    import.meta.url,
);

test('workspace uses a visible fixed landscape on the application content surface', async () => {
    const source = await readFile(layoutPath, 'utf8');

    assert.match(source, /import workspaceLandscapeBackground from/);
    assert.match(source, /workspace-landscape-bg\.png/);
    assert.match(source, /import workspaceArchitecturalDarkBackground from/);
    assert.match(source, /workspace-architectural-dark-bg\.png/);
    assert.match(
        source,
        /\[background-image:var\(--workspace-light-background\)\]/,
    );
    assert.match(source, /radial-gradient/);
    assert.match(source, /linear-gradient/);
    assert.match(source, /rgba\(250, 250, 252, 0\.24\)/);
    assert.match(source, /rgba\(250, 250, 252, 0\.72\)/);
    assert.match(source, /bg-fixed/);
    assert.match(source, /bg-cover/);
    assert.match(source, /bg-bottom/);
    assert.match(source, /--workspace-light-background/);
    assert.match(source, /--workspace-dark-background/);
    assert.match(
        source,
        /dark:\[background-image:var\(--workspace-dark-background\)\]/,
    );
    assert.match(source, /\[&>div\.min-h-screen\]:!bg-transparent/);
    assert.doesNotMatch(source, /workspace-landscape-background/);
    assert.doesNotMatch(source, /workspace-background-wash/);
    assert.doesNotMatch(source, /bg-\[url\('\/images\//);
});

test('workspace landscape is a valid PNG asset', async () => {
    const asset = await readFile(assetPath);
    const darkAsset = await readFile(darkAssetPath);

    assert.equal(asset.subarray(1, 4).toString(), 'PNG');
    assert.equal(darkAsset.subarray(1, 4).toString(), 'PNG');
});
