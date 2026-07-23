import React from 'react';
import * as BadgeDemos from './Badge.demo';
import * as BannerDemos from './Banner.demo';
import * as BreadcrumbsDemos from './Breadcrumbs.demo';
import * as ButtonDemos from './Button.demo';
import * as CardDemos from './Card.demo';
import * as ChipDemos from './Chip.demo';
import * as DataTableDemos from './DataTable.demo';
import * as DialogDemos from './Dialog.demo';
import * as DividerDemos from './Divider.demo';
import * as ExpansionPanelDemos from './ExpansionPanel.demo';
import * as ImageListDemos from './ImageList.demo';
import * as ListDemos from './List.demo';
import * as MenuDemos from './Menu.demo';
import * as NavigationDrawerDemos from './NavigationDrawer.demo';
import * as NavigationRailDemos from './NavigationRail.demo';
import * as PageHeaderDemos from './PageHeader.demo';
import * as PaginationDemos from './Pagination.demo';
import * as PickerDemos from './Picker.demo';
import * as ProgressIndicatorDemos from './ProgressIndicator.demo';
import * as SelectionControlDemos from './SelectionControl.demo';
import * as SideSheetDemos from './SideSheet.demo';
import * as SliderDemos from './Slider.demo';
import * as SnackbarDemos from './Snackbar.demo';
import * as StepperDemos from './Stepper.demo';
import * as TabsDemos from './Tabs.demo';
import * as TextFieldDemos from './TextField.demo';
import * as TooltipDemos from './Tooltip.demo';

/* One entry per component with live demos. Adding a component = write
   <Name>.demo.tsx (hero + demos keyed by doc.json variant labels exactly),
   register it here, re-run build-demos.mjs.
   Icon is deliberately absent: its .tsx wraps FontAwesome Pro (license-gated
   packages that can't ship in this public repo), so its page keeps mockups. */

export type DemoModule = { hero: React.ComponentType; demos: Record<string, React.ComponentType> };

export const registry: Record<string, DemoModule> = {
  Badge: BadgeDemos as DemoModule,
  Banner: BannerDemos as DemoModule,
  Breadcrumbs: BreadcrumbsDemos as DemoModule,
  Button: ButtonDemos as DemoModule,
  Card: CardDemos as DemoModule,
  Chip: ChipDemos as DemoModule,
  DataTable: DataTableDemos as DemoModule,
  Dialog: DialogDemos as DemoModule,
  Divider: DividerDemos as DemoModule,
  ExpansionPanel: ExpansionPanelDemos as DemoModule,
  ImageList: ImageListDemos as DemoModule,
  List: ListDemos as DemoModule,
  Menu: MenuDemos as DemoModule,
  NavigationDrawer: NavigationDrawerDemos as DemoModule,
  NavigationRail: NavigationRailDemos as DemoModule,
  PageHeader: PageHeaderDemos as DemoModule,
  Pagination: PaginationDemos as DemoModule,
  Picker: PickerDemos as DemoModule,
  ProgressIndicator: ProgressIndicatorDemos as DemoModule,
  SelectionControl: SelectionControlDemos as DemoModule,
  SideSheet: SideSheetDemos as DemoModule,
  Slider: SliderDemos as DemoModule,
  Snackbar: SnackbarDemos as DemoModule,
  Stepper: StepperDemos as DemoModule,
  Tabs: TabsDemos as DemoModule,
  TextField: TextFieldDemos as DemoModule,
  Tooltip: TooltipDemos as DemoModule,
};
