import React from 'react';
import {
  Box,
  Button,
  Fade,
  FormControl,
  Input,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import Zoom from '@mui/material/Zoom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { BeatLoader } from 'react-spinners';

import type { RootState } from '@dx/store-web';
import { useAppDispatch, useAppSelector } from '@dx/utils-web-hooks';
import { FADE_TIMEOUT_DUR, themeColors } from '@dx/ui-web-system';
import { LoginPayloadType } from '@dx/auth-shared';
import * as UI from './auth-web-login.ui';
import { authActions } from '@dx/auth-model-web';

type WebLoginUserPassPropType = {
  changeLoginType: () => void;
  isFetchingLogin: boolean;
  login: (payload: LoginPayloadType) => Promise<void>;
};

export const WebLoginUserPass: React.FC<WebLoginUserPassPropType> =
  React.forwardRef((props, ref) => {
    const { isFetchingLogin } = props;
    const [showPassword, setShowPassword] = React.useState(false);
    const [loginAttempts, setLoginAttempts] = React.useState(0);
    const username = useAppSelector((state: RootState) => state.auth.username);
    const password = useAppSelector((state: RootState) => state.auth.password);
    const S_LOGIN = useAppSelector(
      (state: RootState) => state.ui.strings['LOGIN']
    );
    const S_PASSWORD = useAppSelector(
      (state: RootState) => state.ui.strings['PASSWORD']
    );
    const S_USERNAME = useAppSelector(
      (state: RootState) => state.ui.strings['USERNAME']
    );
    const S_TRY_ANOTHER_METHOD = useAppSelector(
      (state: RootState) => state.ui.strings['TRY_ANOTHER_WAY']
    );
    const dispatch = useAppDispatch();

    React.useEffect(() => {
      clearInputs();

      return function cleanup() {
        clearInputs();
      };
    }, []);

    const clearInputs = (): void => {
      dispatch(authActions.usernameUpdated(''));
      dispatch(authActions.passwordUpdated(''));
    };

    const submitDisabled = (): boolean => {
      if (
        !username ||
        !password ||
        (username && !password) ||
        (username && password.length < 6)
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

      if (typeof username === 'string' && typeof password === 'string') {
        const data: LoginPayloadType = {
          value: username,
          password: password,
        };

        await props.login(data);
        setLoginAttempts(loginAttempts + 1);
      }
    };

    const handleChangeUsername = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      dispatch(authActions.usernameUpdated(event.target.value));
    };

    const handleChangePassword = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      dispatch(authActions.passwordUpdated(event.target.value));
    };

    return (
      <Fade in={true} timeout={FADE_TIMEOUT_DUR}>
        <Box ref={ref} width={'100%'}>
          <UI.Form name="form-login" onSubmit={handleLogin}>
            <FormControl
              disabled={isFetchingLogin}
              margin="normal"
              variant="outlined"
            >
              <InputLabel htmlFor="input-username">{S_USERNAME}</InputLabel>
              <OutlinedInput
                id="input-username"
                name="input-username"
                onChange={handleChangeUsername}
                type="text"
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="none"
                // autoComplete="email"
                value={username}
                fullWidth
                label={S_USERNAME}
              />
            </FormControl>
            <FormControl
              disabled={isFetchingLogin}
              margin="normal"
              variant="outlined"
            >
              <InputLabel htmlFor="input-password">{S_PASSWORD}</InputLabel>
              <OutlinedInput
                id="input-password"
                name="input-password"
                onChange={handleChangePassword}
                type={showPassword ? 'text' : 'password'}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="none"
                autoComplete="current-password"
                value={password}
                fullWidth
                label={S_PASSWORD}
                endAdornment={
                  showPassword ? (
                    <Visibility
                      sx={{
                        cursor: 'pointer',
                      }}
                      color="primary"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <VisibilityOff
                      sx={{
                        cursor: 'pointer',
                      }}
                      color="primary"
                      onClick={() => setShowPassword(true)}
                    />
                  )
                }
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              onClick={handleLogin}
              disabled={submitDisabled()}
              sx={{
                marginTop: '50px',
              }}
              fullWidth
            >
              {isFetchingLogin ? (
                <BeatLoader
                  color={themeColors.secondary}
                  size={16}
                  margin="2px"
                />
              ) : (
                S_LOGIN
              )}
            </Button>
          </UI.Form>
          {loginAttempts > 2 && (
            <Zoom in={true}>
              <Typography
                variant="subtitle2"
                align="right"
                marginTop={'2em'}
                marginBottom={'0'}
                color="primary"
                alignSelf="flex-end"
                style={{ cursor: 'pointer' }}
                onClick={() => props.changeLoginType()}
              >
                {S_TRY_ANOTHER_METHOD}
              </Typography>
            </Zoom>
          )}
        </Box>
      </Fade>
    );
  });
