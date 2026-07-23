/* Build-time helper: prints the live-demo manifest (component → variant labels)
   so build_portal.py knows which tiles get a live mount vs the mockup fallback.
   Run via build-demos.mjs — never shipped to the browser. */
import { registry } from './registry';

const manifest: Record<string, string[]> = {};
for (const [name, mod] of Object.entries(registry)) {
  manifest[name] = Object.keys(mod.demos);
}
console.log(JSON.stringify(manifest, null, 2));
