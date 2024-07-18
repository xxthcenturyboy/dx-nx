import * as React from 'react';
import {
  Button,
  Fade,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import {
  APP_NAME,
  APP_DESCRIPTION
} from '@dx/config-shared';
import { FADE_TIMEOUT_DUR } from '@dx/config-web';
import { WEB_ROUTES } from '@dx/config-web';
import { LottieWelcomeDog } from 'client/core/UI/lottie';
import { setDocumentTitle } from 'client/core/browser/setDocumentTitle';

export const HomeComponent: React.FC = () => {
  const theme = useTheme();
  const smBreak = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    setDocumentTitle();
  }, []);

  const goToLogin = () => {
    // dispatch(push(WEB_ROUTES.LOGIN));
  };

  return (
    <Fade in={true} timeout={FADE_TIMEOUT_DUR}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '80vh' }}
        wrap="nowrap"
      >
        <LottieWelcomeDog />
        <Typography
          variant={smBreak ? 'h3' : 'h1'}
          color="primary"
          align="center"
        >
          {APP_NAME}
        </Typography>
        <Typography
          variant="h5"
          color="secondary"
          margin="15px"
          align="center"
        >
          {APP_DESCRIPTION}
        </Typography>
        <Grid
          item
          justifyContent="center"
          margin="20px"
          width={smBreak ? '100%' : 'auto'}
          flex={0}
        >
          <Button
            onClick={goToLogin}
            variant="contained"
            fullWidth={smBreak}
            size="large"
            style={{
              minWidth: '200px'
            }}
          >
              Login
          </Button>
        </Grid>
      </Grid>
    </Fade>
  );
};
