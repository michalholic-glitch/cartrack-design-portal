import React from 'react';
import * as ButtonDemos from './Button.demo';
import * as DataTableDemos from './DataTable.demo';

/* One entry per component with live demos. Adding a component = write
   <Name>.demo.tsx (hero + demos keyed by doc.json variant labels exactly),
   register it here, re-run build-demos.mjs. */

export type DemoModule = { hero: React.ComponentType; demos: Record<string, React.ComponentType> };

export const registry: Record<string, DemoModule> = {
  Button: ButtonDemos as DemoModule,
  DataTable: DataTableDemos as DemoModule,
};
