// Builds the portal's live-demo assets:
//   docs/assets/demos.js            — react + real components + demo instances
//   docs/assets/demos-manifest.json — which components/variants render live
//   docs/assets/cartrack-supplement.css — Cartrack extensions MDC doesn't style
// (docs/assets/mdc.cartrack.css is compiled separately — see md2-cartrack-library/build/BUILD.md)
// Invoked by build_portal.py; can also be run directly: node build-demos.mjs
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(here, '..', 'docs', 'assets');
fs.mkdirSync(assets, { recursive: true });

const alias = {
  react: path.join(here, 'node_modules', 'react'),
  'react-dom': path.join(here, 'node_modules', 'react-dom'),
};

// 1. browser bundle
await build({
  entryPoints: [path.join(here, 'mount.tsx')],
  bundle: true,
  minify: true,
  jsx: 'transform',
  alias,
  loader: { '.json': 'json' },
  outfile: path.join(assets, 'demos.js'),
  logLevel: 'warning',
});

// 2. manifest (bundle the generator for node, run it, capture stdout)
const tmp = path.join(here, '.gen-manifest.cjs');
await build({
  entryPoints: [path.join(here, 'gen-manifest.tsx')],
  bundle: true,
  platform: 'node',
  jsx: 'transform',
  alias,
  loader: { '.json': 'json' },
  outfile: tmp,
  logLevel: 'warning',
});
const manifest = execFileSync('node', [tmp], { encoding: 'utf-8' });
fs.writeFileSync(path.join(assets, 'demos-manifest.json'), manifest);
fs.rmSync(tmp);

// 3. supplement css
fs.copyFileSync(path.join(here, 'cartrack-supplement.css'), path.join(assets, 'cartrack-supplement.css'));

console.log('live demos built:', Object.entries(JSON.parse(manifest)).map(([k, v]) => `${k}(${v.length})`).join(', '));
