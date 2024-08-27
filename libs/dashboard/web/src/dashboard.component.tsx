import * as React from 'react';
import {
  Fade,
  Grid,
  Typography
} from '@mui/material';

import {
  FADE_TIMEOUT_DUR,
  WelcomeRobotLottie
} from '@dx/ui-web';
import { setDocumentTitle } from '@dx/utils-misc-web';

export const Dashboard: React.FC = () => {
  React.useEffect(() => {
    setDocumentTitle('Dashboard');
  }, []);

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
        <WelcomeRobotLottie />
        <Typography
          variant="h5"
          color="secondary"
          margin="15px"
          align="center"
        >
          Have a look around.
        </Typography>
      </Grid>
    </Fade>
  );
};
