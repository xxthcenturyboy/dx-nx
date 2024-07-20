export type AppMenuItemType = {
  id: string;
  icon?: string;
  routeKey: string;
  title: string;
  type: 'ROUTE' | 'SUB_HEADING';
};

export type AppMenuType = {
  id: string;
  collapsible: boolean;
  items: AppMenuItemType[];
  title: string;
};
