import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const astroPackagePath = require.resolve('astro/package.json');
const { bin } = JSON.parse(readFileSync(astroPackagePath, 'utf8'));
const astroCLI = resolve(dirname(astroPackagePath), bin.astro);
const slug = `draft-publishing-regression-${randomUUID()}`;
const title = `Unpublished regression fixture ${slug}`;
const fixture = resolve(root, 'src/content/posts', `${slug}.md`);

try {
  writeFileSync(fixture, `---\ntitle: "${title}"\npublishedAt: 2026-01-01\ndescription: "This draft must never be published."\nisDraft: true\n---\nPrivate draft body.\n`, { flag: 'wx' });
  const result = spawnSync(process.execPath, [astroCLI, 'build'], {
    cwd: root, stdio: 'inherit',
  });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, 'Production build must succeed');
  assert.equal(existsSync(resolve(root, 'dist/posts', slug)), false, 'Draft article must have no route');
  assert.equal(existsSync(resolve(root, 'dist/og', `${slug}.png`)), false, 'Draft must have no share image');
  for (const path of ['index.html', 'posts/index.html', ...readdirSync(resolve(root, 'dist')).filter(name => name.startsWith('sitemap') && name.endsWith('.xml'))]) {
    const content = readFileSync(resolve(root, 'dist', path), 'utf8');
    assert.equal(content.includes(slug), false, `Draft must not appear in ${path}`);
    assert.equal(content.includes(title), false, `Draft title must not appear in ${path}`);
  }
  assert.ok(existsSync(resolve(root, 'dist/posts/stop-overthinking-your-projects/index.html')), 'Published article remains available');
  assert.ok(existsSync(resolve(root, 'dist/og/stop-overthinking-your-projects.png')), 'Published share image remains available');
  console.log('Draft publishing regression passed: no route, listings, image, or sitemap entry.');
} finally {
  rmSync(fixture, { force: true });
}
