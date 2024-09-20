export type MenuRestrictionType = 'ADMIN' | 'SUPER_ADMIN';

export type AppMenuItemType = {
  beta?: boolean;
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
