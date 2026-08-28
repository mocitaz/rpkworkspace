import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const authLayoutPath = new URL(
    '../../resources/js/layouts/auth/auth-simple-layout.tsx',
    import.meta.url,
);
const workspaceBackgroundPath = new URL(
    '../../resources/images/workspace-landscape-bg.png',
    import.meta.url,
);

test('login uses the original scenic vector background', async () => {
    const source = await readFile(authLayoutPath, 'utf8');

    assert.match(source, /src="\/images\/rpk-login-vector-bg\.jpg"/);
    assert.match(source, /object-bottom/);
    assert.doesNotMatch(source, /rpk-login-city-bg\.png/);
});

test('workspace uses the original landscape background asset', async () => {
    const asset = await readFile(workspaceBackgroundPath);
    const digest = createHash('sha256').update(asset).digest('hex');

    assert.equal(
        digest,
        'a4ee4d9c9010fdb21442b410629fa7c7b96fe5c73d26e782be650508484f60e1',
    );
});
