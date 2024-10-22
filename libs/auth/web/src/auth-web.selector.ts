import { createSelector } from 'reselect';

import { AuthStateType } from '@dx/auth-model-web';
import type { RootState } from '@dx/store-web';

const selectAuthState = (state: RootState): AuthStateType => state.auth;
export const selectAuthToken = (state: RootState): string | null => state.auth.token;

export const selectIsAuthenticated = createSelector(
  [selectAuthToken],
  (authToken): boolean => {
    return !!authToken;
  }
);
