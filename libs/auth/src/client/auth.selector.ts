import { createSelector } from 'reselect';

import { WebRootStateType } from '@dx/config-web';

const getAuthState = (state: WebRootStateType): WebRootStateType['auth'] =>
  state.auth;
export const getAuthToken = (state: WebRootStateType): string | null =>
  state.auth.token;
