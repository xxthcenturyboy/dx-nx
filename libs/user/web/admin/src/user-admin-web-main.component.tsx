import React from 'react';
import {
  useNavigate
} from 'react-router-dom';

import {
  useAppSelector
} from '@dx/utils-web-hooks';
import { WebConfigService } from '@dx/config-web';

export const UserAdminMain: React.FC = () => {
  const lastRoute = useAppSelector(state => state.userAdmin.lastRoute);
  const navigate = useNavigate();
  const ROUTES = WebConfigService.getWebRoutes();

  React.useEffect(() => {
    let nextRoute = ROUTES.ADMIN.USER.LIST;
    if (lastRoute) {
      nextRoute = lastRoute;
    }

    navigate(nextRoute, { replace: true });
  }, []);

  return null;
};
