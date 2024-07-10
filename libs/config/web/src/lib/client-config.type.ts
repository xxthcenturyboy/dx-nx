import { RouterState } from 'connected-react-router';

import { AuthStateType } from '@dx/auth-web';

export type WebRootStateType = {
  auth: AuthStateType;
  router: RouterState;
};
