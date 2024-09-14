import * as React from 'react';
import {
  Button,
  Fade,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {
  APP_NAME,
  APP_DESCRIPTION
} from '@dx/config-shared';
import { WebConfigService } from '@dx/config-web';
import {
  FADE_TIMEOUT_DUR,
  WelcomeRobotLottie
} from '@dx/ui-web';
import { setDocumentTitle } from '@dx/utils-misc-web';

export const HomeComponent: React.FC = () => {
  const theme = useTheme();
  const smBreak = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  React.useEffect(() => {
    setDocumentTitle();
  }, []);

  const goToLogin = () => {
    const ROUTES = WebConfigService.getWebRoutes();
    if (
      ROUTES
      && ROUTES.AUTH
      && ROUTES.AUTH.LOGIN
    ) {
      navigate(ROUTES.AUTH.LOGIN);
    }
  };

  return (
    <Fade
      in={true}
      timeout={FADE_TIMEOUT_DUR}
    >
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={
          {
            padding: '24px',
            minHeight: '80vh'
          }
        }
        wrap="nowrap"
      >
        <WelcomeRobotLottie />
        <Typography
          variant={smBreak ? 'h3' : 'h1'}
          color="primary"
          align="center"
        >
          { APP_NAME }
        </Typography>
        <Typography
          variant="h5"
          color="secondary"
          margin="15px"
          align="center"
        >
          { APP_DESCRIPTION }
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
