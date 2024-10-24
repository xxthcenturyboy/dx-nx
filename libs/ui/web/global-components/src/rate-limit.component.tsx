import * as React from 'react';
import {
  Grid2,
  Typography
} from '@mui/material';

import { StopwatchLottie } from '@dx/ui-web-lottie';
import { StyledContentWrapper } from './content/content-wrapper.styled';

export const RateLimitComponent: React.FC = () => {
  return (
    <StyledContentWrapper>
      <Grid2
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
      </Grid2>
    </StyledContentWrapper>
  );
};
