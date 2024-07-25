import React from 'react';
import {
  useLocation,
  useNavigate
} from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
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
import { BeatLoader } from 'react-spinners';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import { WebConfigService } from '@dx/config-web';
import { regexEmail } from '@dx/util-regex';
import {
  FADE_TIMEOUT_DUR,
  MEDIA_BREAK,
  setDocumentTitle,
  themeColors
} from '@dx/ui-web';
import * as UI from './auth-web-login.ui';
import { authActions } from './auth-web.reducer';
import {
  selectIsUserProfileValid,
  userProfileActions
} from '@dx/user-profile-web';

import requestLogin from 'client/Auth/actions/login';

export const WebLogin: React.FC = () => {
  const [mobileBreak, setMobileBreak] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const username = useAppSelector((state: RootState) => state.auth.username);
  const password = useAppSelector((state: RootState) => state.auth.password);
  const isFetchingLogin = useAppSelector((state: RootState) => state.auth.isFetchingLogin);
  const loginError = useAppSelector((state: RootState) => state.auth.loginError);
  const loginResponse = useAppSelector((state: RootState) => state.auth.loginResponse);
  const user = useAppSelector((state: RootState) => state.userProfile);
  const isProfileValid = useAppSelector((state: RootState) => selectIsUserProfileValid(state));
  const logo = useAppSelector((state: RootState) => state.ui.logoUrl);
  const windowWidth = useAppSelector((state: RootState) => state.ui.windowWidth) || 0;
  const location = useLocation();
  const navigate = useNavigate();
  const lastPath = location.pathname;
  const dispatch = useAppDispatch();
  const ROUTES = WebConfigService.getWebRoutes();

  React.useEffect(() => {
    clearInputs();
    setDocumentTitle('Login');

    // we're already logged in
    if (
      user
      && !isProfileValid
    ) {
      if (lastPath !== ROUTES.MAIN) {
        navigate(lastPath);
      }
      return;
    }

    setMobileBreak(windowWidth < MEDIA_BREAK.MOBILE);

    return function cleanup() {
      clearInputs();
    };
  }, []);

  React.useEffect(() => {
    setMobileBreak(windowWidth < MEDIA_BREAK.MOBILE);
  }, [windowWidth]);

  React.useEffect(() => {
    if (isFetchingLogin) {
      return;
    }

    if (loginError) {
      dispatch(userProfileActions.profileInvalidated());
      return;
    }

    if (
      loginResponse
      && !isProfileValid
    ) {
      clearInputs();
      dispatch(userProfileActions.profileUpdated(loginResponse));
      navigate(ROUTES.DASHBOARD.MAIN);
      // loginBootstrap();
    }
  }, [isFetchingLogin, loginError, loginResponse]);

  const clearInputs = (): void => {
    dispatch(authActions.usernameUpdated(''));
    dispatch(authActions.passwordUpdated(''));
  };

  const submitDisabled = (): boolean => {
    if (
      (!username || !password)
      || (username && !password)
      || (username && password.length < 6)
      || (!regexEmail.test(username))
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

    const data = {
      password,
      email: username
    };

    await dispatch(requestLogin(data));
  };

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(authActions.usernameUpdated(event.target.value));
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(authActions.passwordUpdated(event.target.value));
  };

  return (
    <Fade in={true} timeout={FADE_TIMEOUT_DUR}>
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
            <Divider style={{ width: '100%'}} />
            <UI.Form
              name="form-login"
              onSubmit={handleLogin}
            >
              <FormControl
                disabled={isFetchingLogin}
                margin="normal"
                variant="standard"
              >
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input
                  id="username"
                  name="username"
                  onChange={handleChangeUsername}
                  type="email"
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
                <InputLabel htmlFor="password">Password</InputLabel>
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
                  'Login'
                }
              </Button>
            </UI.Form>
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
              Forgot password?
            </Typography>
          </Paper>
        </Grid>
      </Box>
    </Fade>

  );
};
