import React from 'react';
import * as AccordionDemos from './Accordion.demo';
import * as BadgeDemos from './Badge.demo';
import * as BannerDemos from './Banner.demo';
import * as BreadcrumbsDemos from './Breadcrumbs.demo';
import * as ButtonDemos from './Button.demo';
import * as CardDemos from './Card.demo';
import * as CheckboxDemos from './Checkbox.demo';
import * as ChipDemos from './Chip.demo';
import * as CircularProgressDemos from './CircularProgress.demo';
import * as DialogDemos from './Dialog.demo';
import * as DividerDemos from './Divider.demo';
import * as DrawerDemos from './Drawer.demo';
import * as ImageListDemos from './ImageList.demo';
import * as LinearProgressDemos from './LinearProgress.demo';
import * as ListDemos from './List.demo';
import * as MenuDemos from './Menu.demo';
import * as NavigationRailDemos from './NavigationRail.demo';
import * as PageHeaderDemos from './PageHeader.demo';
import * as PaginationDemos from './Pagination.demo';
import * as RadioDemos from './Radio.demo';
import * as SliderDemos from './Slider.demo';
import * as SnackbarDemos from './Snackbar.demo';
import * as StepperDemos from './Stepper.demo';
import * as SwitchDemos from './Switch.demo';
import * as TabsDemos from './Tabs.demo';
import * as TextFieldDemos from './TextField.demo';
import * as TooltipDemos from './Tooltip.demo';

/* One entry per component with live demos. Adding a component = write
   <Name>.demo.tsx (hero + demos keyed by doc.json variant labels exactly),
   register it here, re-run build-demos.mjs.
   Deliberately absent:
   - Icon: wraps license-gated FontAwesome Pro; page keeps text-only variants.
   - DataGrid, DatePicker: MUI X — live demos would need an @mui/x-license key
     this public portal can't ship, so their pages keep static mockups
     (decision 2026-07-24). */

export type DemoModule = { hero: React.ComponentType; demos: Record<string, React.ComponentType> };

export const registry: Record<string, DemoModule> = {
  Accordion: AccordionDemos as DemoModule,
  Badge: BadgeDemos as DemoModule,
  Banner: BannerDemos as DemoModule,
  Breadcrumbs: BreadcrumbsDemos as DemoModule,
  Button: ButtonDemos as DemoModule,
  Card: CardDemos as DemoModule,
  Checkbox: CheckboxDemos as DemoModule,
  Chip: ChipDemos as DemoModule,
  CircularProgress: CircularProgressDemos as DemoModule,
  Dialog: DialogDemos as DemoModule,
  Divider: DividerDemos as DemoModule,
  Drawer: DrawerDemos as DemoModule,
  ImageList: ImageListDemos as DemoModule,
  LinearProgress: LinearProgressDemos as DemoModule,
  List: ListDemos as DemoModule,
  Menu: MenuDemos as DemoModule,
  NavigationRail: NavigationRailDemos as DemoModule,
  PageHeader: PageHeaderDemos as DemoModule,
  Pagination: PaginationDemos as DemoModule,
  Radio: RadioDemos as DemoModule,
  Slider: SliderDemos as DemoModule,
  Snackbar: SnackbarDemos as DemoModule,
  Stepper: StepperDemos as DemoModule,
  Switch: SwitchDemos as DemoModule,
  Tabs: TabsDemos as DemoModule,
  TextField: TextFieldDemos as DemoModule,
  Tooltip: TooltipDemos as DemoModule,
};
