import * as React from 'react';
import {
  Box,
  Button,
  Grid,
  Typography
} from '@mui/material';

import { LottieStopwatch } from '../lottie/LottieStopwatch';

export const RateLimitComponent: React.FC = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '80vh' }}
    >
      <LottieStopwatch />
      <Typography
        variant="h1"
        color="primary"
      >
        Timeout, Turbo
      </Typography>
      <Typography
        variant="h5"
        color="secondary"
        margin="15px"
      >
        You have made too many requests. Please wait several minutes before trying again.
      </Typography>
    </Grid>
  );
};
