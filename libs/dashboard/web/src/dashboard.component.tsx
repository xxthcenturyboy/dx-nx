import * as React from 'react';
import {
  Fade,
  Grid,
  Typography
} from '@mui/material';

import {
  FADE_TIMEOUT_DUR,
  LottieWelcomeRobot,
  setDocumentTitle
} from '@dx/ui-web';

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
        <LottieWelcomeRobot />
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
