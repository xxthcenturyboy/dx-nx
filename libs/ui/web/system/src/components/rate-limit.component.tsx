import * as React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';

import { StopwatchLottie } from '../lottie/stopwatch.lottie';
import { StyledContentWrapper } from './content/content-wrapper.styled';

export const RateLimitComponent: React.FC = () => {
  return (
    <StyledContentWrapper>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '80vh' }}
      >
        <StopwatchLottie />
        <Typography variant="h1" color="primary">
          Timeout, Turbo
        </Typography>
        <Typography variant="h5" color="secondary" margin="15px">
          You have made too many requests. Please wait several minutes before
          trying again.
        </Typography>
      </Grid>
    </StyledContentWrapper>
  );
};
