// import React from 'react';
import {
  Grid,
  Typography
} from '@mui/material';
// import { themeColors } from '../mui-overrides/styles';
import { LottieAccessDenied } from '../lottie/LottieAccessDenied';

type LoadingProps = {
  error?: Error;
  timedOut?: Boolean;
  pastDelay?: Boolean;
  retry?: () => void;
};

export const UnauthorizedComponent = (props: LoadingProps): JSX.Element | null => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{
        minHeight: '90vh'
      }}
    >
      <Typography
        variant="h3"
        align="center"
        color="primary"
      >
        You are not authorized to access this feature.
      </Typography>
      <LottieAccessDenied
        loop={false}
      />
    </Grid>
  );
};
