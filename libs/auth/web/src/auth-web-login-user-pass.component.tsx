import React from 'react';
import {
  useNavigate
} from 'react-router-dom';
import {
  Box,
  Button,
  Fade,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Paper,
  Typography
} from '@mui/material';
import Zoom from '@mui/material/Zoom';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
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
  themeColors,
  uiActions
} from '@dx/ui-web';
import {
  userProfileActions
} from '@dx/user-profile-web';
import { LoginPayloadType } from '@dx/auth-shared';
import * as UI from './auth-web-login.ui';
import { authActions } from './auth-web.reducer';
import { useLoginMutation } from './auth-web.api';

export const WebLoginUserPass: React.FC = () => {
  const [mobileBreak, setMobileBreak] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginAttempts, setLoginAttempts] = React.useState(0);
  const username = useAppSelector((state: RootState) => state.auth.username);
  const password = useAppSelector((state: RootState) => state.auth.password);
  const logo = useAppSelector((state: RootState) => state.ui.logoUrl);
  const windowWidth = useAppSelector((state: RootState) => state.ui.windowWidth) || 0;
  const stringLogin = useAppSelector((state: RootState) => state.ui.strings['LOGIN']);
  const stringPassword = useAppSelector((state: RootState) => state.ui.strings['PASSWORD']);
  const stringUsername = useAppSelector((state: RootState) => state.ui.strings['USERNAME']);
  const stringTryAnotherMethod = useAppSelector((state: RootState) => state.ui.strings['TRY_ANOTHER_WAY']);
  const navigate = useNavigate();
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
    clearInputs();

    setMobileBreak(windowWidth < MEDIA_BREAK.MOBILE);

    return function cleanup() {
      clearInputs();
    };
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
      clearInputs();
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

  const clearInputs = (): void => {
    dispatch(authActions.usernameUpdated(''));
    dispatch(authActions.passwordUpdated(''));
  };

  const submitDisabled = (): boolean => {
    if (
      (!username || !password)
      || (username && !password)
      || (username && password.length < 6)
      // || (!regexEmail.test(username))
    ) {
      return true;
    }

    return false;
  };

  const handleLogin = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();

    if (submitDisabled()) {
      return;
    }

    if (
      typeof username === 'string'
      && typeof password === 'string'
    ) {
      const data: LoginPayloadType = {
        value: username,
        password: password
      };

      await requestLogin(data);
      setLoginAttempts(loginAttempts + 1);
    }
  };

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(authActions.usernameUpdated(event.target.value));
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(authActions.passwordUpdated(event.target.value));
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
            {/* <Divider style={{ width: '100%'}} /> */}
            <UI.Form
              name="form-login"
              onSubmit={handleLogin}
            >
              <FormControl
                disabled={isFetchingLogin}
                margin="normal"
                variant="standard"
              >
                <InputLabel
                  htmlFor="username"
                >
                  { stringUsername }
                </InputLabel>
                <Input
                  id="username"
                  name="username"
                  onChange={handleChangeUsername}
                  type="text"
                  spellCheck={false}
                  autoCorrect="off"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={username}
                  fullWidth
                />
              </FormControl>
              <FormControl
                disabled={isFetchingLogin}
                margin="normal"
                variant="standard"
              >
                <InputLabel
                  htmlFor="password"
                >
                  { stringPassword }
                </InputLabel>
                <Input
                  id="password"
                  name="password"
                  onChange={handleChangePassword}
                  type={showPassword ? 'text' : 'password'}
                  spellCheck={false}
                  autoCorrect="off"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  value={password}
                  fullWidth
                  endAdornment={showPassword ?
                    <Visibility
                      sx={{
                        cursor: 'pointer'
                      }}
                      color="primary"
                      onClick={() => setShowPassword(false)}
                    />
                    :
                    <VisibilityOff
                      sx={{
                        cursor: 'pointer'
                      }}
                      color="primary"
                      onClick={() => setShowPassword(true)}
                    />
                  }
                />
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                onClick={handleLogin}
                disabled={submitDisabled()}
                sx={{
                  marginTop: '50px'
                }}
                fullWidth
              >
                {
                  isFetchingLogin ? (
                    <BeatLoader
                      color={themeColors.secondary}
                      size={16}
                      margin="2px"
                    />
                  )
                  :
                  stringLogin
                }
              </Button>
            </UI.Form>
            {
              loginAttempts > 2 && (
                <Zoom in={true}>
                  <Typography
                    variant="subtitle2"
                    align="right"
                    marginTop={'2em'}
                    marginBottom={'0'}
                    color="primary"
                    alignSelf="flex-end"
                    style={
                      { cursor: 'pointer' }
                    }
                    onClick={
                      () => navigate(ROUTES.AUTH.CONFIRM)
                    }
                  >
                    { stringTryAnotherMethod }
                  </Typography>
                </Zoom>
              )
            }
          </Paper>
        </Grid>
      </Box>
    </Fade>
  );
};
