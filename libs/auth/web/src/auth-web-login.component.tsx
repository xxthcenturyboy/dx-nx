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
  Typography,
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
import { AuthWebRequestOtpEntry } from './auth-web-request-otp.component';
import { UserProfileStateType } from '@dx/user-shared';

export const WebLogin: React.FC = () => {
  const [mobileBreak, setMobileBreak] = React.useState(false);
  const [loginType, setLoginType] = React.useState<'USER_PASS' | 'OTP'>('USER_PASS');
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
  const [
    requestLogin,
    {
      data: loginResponse,
      error: loginError,
      isLoading: isFetchingLogin,
      isSuccess: loginIsSuccess
    }
  ] = useLoginMutation();

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

  React.useEffect(() => {
    setMobileBreak(windowWidth < MEDIA_BREAK.MOBILE);
  }, [windowWidth]);

  React.useEffect(() => {
    if (loginError) {
      'error' in loginError && toast.warn(loginError.error);
      dispatch(userProfileActions.profileInvalidated());
      return;
    }
  }, [loginError]);

  React.useEffect(() => {
    if (loginResponse) {
      const {
        accessToken,
        profile
      } = loginResponse;
      dispatch(authActions.usernameUpdated(''));
      dispatch(authActions.passwordUpdated(''));
      dispatch(authActions.tokenAdded(accessToken));
      dispatch(authActions.setLogoutResponse(false));
      dispatch(userProfileActions.profileUpdated(profile));
      const menuService = new MenuConfigService();
      let menus: AppMenuType[] = [];
      if (profile.role.includes('SUPER_ADMIN')) {
        menus = menuService.getMenus('SUPER_ADMIN', profile.b);
      } else if (profile.role.includes('ADMIN')) {
        menus = menuService.getMenus('ADMIN', profile.b);
      } else {
        menus = menuService.getMenus(undefined, profile.b);
      }
      dispatch(uiActions.menusSet({ menus }));
      if (!mobileBreak) {
        dispatch(uiActions.toggleMenuSet(true));
      }
      navigate(ROUTES.DASHBOARD.MAIN);
    }
  }, [loginIsSuccess]);

  const handleLogin = async (payload: LoginPayloadType): Promise<void> => {
    await requestLogin(payload);
  };

  return (
    <Fade
      in={true}
      timeout={FADE_TIMEOUT_DUR}
    >
      <Box>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: mobileBreak ? 'unset' : '90vh' }}
        >
          <Paper
            elevation={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: mobileBreak ? '20px' : '40px',
              minWidth: windowWidth < 375 ? `${windowWidth - 40}px` : '330px',
              minHeight: '500px',
              maxWidth: '420px',
              width: '100%',
            }}
          >
            <UI.Logo src={logo} />
            {
              loginType === 'USER_PASS' && (
                <WebLoginUserPass
                  changeLoginType={
                    () => setLoginType('OTP')
                  }
                  isFetchingLogin={isFetchingLogin}
                  login={handleLogin}
                />
              )
            }
            {
              loginType === 'OTP' && (
                <AuthWebRequestOtpEntry
                  onCompleteCallback={
                    (value: string, code: string, region?: string) => {
                      const data: LoginPayloadType = {
                        code,
                        region,
                        value,
                      };
                      void handleLogin(data);
                    }
                  }
                />
              )
            }
          </Paper>
        </Grid>
      </Box>
    </Fade>
  );
};
