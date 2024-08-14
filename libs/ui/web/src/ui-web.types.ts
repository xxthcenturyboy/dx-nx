import { ThemeOptions } from '@mui/material/styles';
import { AppMenuType } from './components/menu';

export type UiStateType = {
  apiDialogOpen: boolean;
  apiDialogError: string | null;
  awaitDialogMessage: string;
  awaitDialogOpen: boolean;
  bootstrapped: boolean;
  dialogOpen: boolean;
  dialogComponent: React.ReactNode | null;
  isShowingUnauthorizedAlert: boolean;
  logoUrl: string;
  logoUrlSmall: string;
  menuOpen: boolean;
  menus: AppMenuType[] | null;
  name: string;
  notifications: number;
  strings: Record<string, string>,
  theme: ThemeOptions;
  windowWidth: number;
  windowHeight: number;
};

export type RouteState = {
  [routeKey: string]: string;
};
