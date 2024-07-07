import {
  RouterAction,
  LocationChangeAction
} from 'connected-react-router';
import { ActionType } from 'typesafe-actions';

import { authActions } from '@dx/auth';

const allActions = {
  ...authActions
};

type AppAction = ActionType<typeof allActions>;
type ReactRouterAction = RouterAction | LocationChangeAction;

type RootAction =
  | AppAction
  | ReactRouterAction;

export {
  allActions,
  RootAction
};
