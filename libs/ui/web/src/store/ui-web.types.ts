import { ReactElement } from 'react';
import { ThemeOptions } from '@mui/material/styles';

export type UiStateType = {
  apiDialogOpen: boolean;
  apiDialogError: string | null;
  awaitDialogMessage: string;
  awaitDialogOpen: boolean;
  bootstrapped: boolean;
  dialogOpen: boolean;
  dialogComponent: ReactElement<any, any> | null;
  isShowingUnauthorizedAlert: boolean;
  logoUrl: string;
  logoUrlSmall: string;
  menuOpen: boolean;
  name: string;
  notifications: number;
  routes: RouteState;
  theme: ThemeOptions;
  windowWidth: number;
  windowHeight: number;
};

export type RouteState = {
  [routeKey: string]: string;
};
