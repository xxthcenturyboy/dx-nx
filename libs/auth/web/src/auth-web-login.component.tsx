import React from 'react';
import {
  useLocation,
  useNavigate
} from 'react-router-dom';
import {
  Box,
  Fade,
  Grid,
  Paper,
} from '@mui/material';
import { toast } from 'react-toastify';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import {
  loginBootstrap,
  WebConfigService
} from '@dx/config-web';
import {
  FADE_TIMEOUT_DUR,
  MEDIA_BREAK
} from '@dx/ui-web';
import { setDocumentTitle } from '@dx/utils-misc-web';
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

export const WebLogin: React.FC = () => {
  const [mobileBreak, setMobileBreak] = React.useState(false);
  const [loginType, setLoginType] = React.useState<'USER_PASS' | 'OTP'>('USER_PASS');
  const user = useAppSelector((state: RootState) => state.userProfile);
  const isProfileValid = useAppSelector((state: RootState) => selectIsUserProfileValid(state));
  const logo = useAppSelector((state: RootState) => state.ui.logoUrl);
  // const windowHeight = useAppSelector((state: RootState) => state.ui.windowHeight) || 0;
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
      if (
        loginError.code
        && loginError.code === '429'
      ) {
        navigate(ROUTES.LIMITED);
        'error' in loginError && toast.error(loginError.error);
        return;
      }

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
      loginBootstrap(profile, mobileBreak);
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
          style={{ minHeight: mobileBreak ? 'unset' : '80vh' }}
        >
          <Paper
            elevation={mobileBreak ? 0 : 2}
            sx={
              (theme) => {
                return {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: mobileBreak ? '20px' : '40px',
                  minWidth: windowWidth < 375 ? `${windowWidth - 40}px` : '330px',
                  minHeight: '500px',
                  maxWidth: '420px',
                  width: '100%',
                  backgroundColor: mobileBreak ? 'transparent' : undefined
                };
              }
            }
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
                  hasCallbackError={!!loginError}
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
