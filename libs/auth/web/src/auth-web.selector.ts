import { createSelector } from 'reselect';

import { AuthStateType } from './auth-web.types';
import { RootState } from '@dx/store-web';

const selectAuthState = (state: RootState): AuthStateType => state.auth;
export const selectAuthToken = (state: RootState): string | null => state.auth.token;

export const selectIsAuthenticated = createSelector(
  [selectAuthToken],
  (authToken): boolean => {
    return !!authToken;
  }
);
