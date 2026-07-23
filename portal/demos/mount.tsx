import React from 'react';
import { createRoot } from 'react-dom/client';
import { registry } from './registry';

/* Mounts live demos into the generated portal pages.
   build_portal.py emits <div data-live-demo="<Component>" data-demo="hero|<variant label>">
   for every component present in demos-manifest.json; this script hydrates them. */

function mountAll() {
  document.querySelectorAll<HTMLElement>('[data-live-demo]').forEach((el) => {
    const mod = registry[el.dataset.liveDemo || ''];
    if (!mod) return;
    const name = el.dataset.demo || 'hero';
    const Demo = name === 'hero' ? mod.hero : mod.demos[name];
    if (!Demo) return;
    createRoot(el).render(<Demo />);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountAll);
} else {
  mountAll();
}
