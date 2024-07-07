import {
  getType,
  ActionType
} from 'typesafe-actions';
import * as authActions from './actions';
import { AuthStateType } from '../model/auth.types';
import {
  authInitialState,
  authPersistConfig
} from './auth-initial-state';

type AuthActionType = ActionType<typeof authActions>;
export {
  AuthActionType,
  AuthStateType,
  authInitialState,
  authPersistConfig
};

export const authReducer = (
  state: AuthStateType = authInitialState,
  action: AuthActionType
): AuthStateType => {
  switch (action.type) {
    case getType(authActions.setToken): return {
      ...state,
      token: action.payload
    }
  }
};
