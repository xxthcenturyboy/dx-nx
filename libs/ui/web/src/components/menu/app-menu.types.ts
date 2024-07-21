export type MenuRestrictionType = 'ADMIN' | 'SUPERADMIN' | 'BETA';

export type AppMenuItemType = {
  id: string;
  icon?: string;
  restriction?: MenuRestrictionType;
  routeKey: string;
  title: string;
  type: 'ROUTE' | 'SUB_HEADING';
};

export type AppMenuType = {
  id: string;
  collapsible: boolean;
  description: string;
  items: AppMenuItemType[];
  title: string;
};
