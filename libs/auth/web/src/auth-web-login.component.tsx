import React from 'react';
import {
  useLocation,
  useNavigate
} from 'react-router-dom';
import {
  Box,
  Button,
  // Divider,
  Fade,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Paper,
  Typography
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import Zoom from '@mui/material/Zoom';
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import {
  MenuConfigService,
  WebConfigService
} from '@dx/config-web';
import {
  AppMenuType,
  FADE_TIMEOUT_DUR,
  MEDIA_BREAK,
  setDocumentTitle,
  themeColors,
  uiActions
} from '@dx/ui-web';
import {
  selectIsUserProfileValid,
  userProfileActions
} from '@dx/user-profile-web';
import { LoginPayloadType } from '@dx/auth-shared';
import * as UI from './auth-web-login.ui';
import { authActions } from './auth-web.reducer';
import { useLoginMutation } from './auth-web.api';
import { WebLoginUserPass } from './auth-web-login-user-pass.component';

export const WebLogin: React.FC = () => {
  const [mobileBreak, setMobileBreak] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginAttempts, setLoginAttempts] = React.useState(0);
  const username = useAppSelector((state: RootState) => state.auth.username);
  const password = useAppSelector((state: RootState) => state.auth.password);
  const user = useAppSelector((state: RootState) => state.userProfile);
  const isProfileValid = useAppSelector((state: RootState) => selectIsUserProfileValid(state));
  const logo = useAppSelector((state: RootState) => state.ui.logoUrl);
  const windowWidth = useAppSelector((state: RootState) => state.ui.windowWidth) || 0;
  const stringLogin = useAppSelector((state: RootState) => state.ui.strings['LOGIN']);
  const location = useLocation();
  const navigate = useNavigate();
  const lastPath = location.pathname;
  const dispatch = useAppDispatch();
  const ROUTES = WebConfigService.getWebRoutes();

  React.useEffect(() => {
    setDocumentTitle(stringLogin);

    // we're already logged in
    if (
      user
      && isProfileValid
    ) {
      if (
        lastPath !== ROUTES.MAIN
        && lastPath !== ROUTES.AUTH.LOGIN
      ) {
        navigate(lastPath, { replace: true });
      }
      return;
    }
  }, []);

  return (
    <>
      <WebLoginUserPass />
    </>
  );
};
