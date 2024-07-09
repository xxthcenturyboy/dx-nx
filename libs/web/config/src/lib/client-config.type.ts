import { RouterState } from 'connected-react-router';

import { AuthStateType } from 'libs/auth/src/model/auth.types';

export type WebRootStateType = {
  auth: AuthStateType;
  router: RouterState;
};
