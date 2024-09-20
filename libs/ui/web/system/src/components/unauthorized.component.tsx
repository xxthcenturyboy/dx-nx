// import React from 'react';
import { Grid, Typography } from '@mui/material';
// import { themeColors } from '../mui-overrides/styles';
import { AccessDeniedLottie } from '@dx/ui-web-lottie';
import { StyledContentWrapper } from './content/content-wrapper.styled';

type LoadingProps = {
  error?: Error;
  timedOut?: Boolean;
  pastDelay?: Boolean;
  retry?: () => void;
};

export const UnauthorizedComponent = (
  props: LoadingProps
): JSX.Element | null => {
  return (
    <StyledContentWrapper>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{
          minHeight: '90vh',
        }}
      >
        <Typography variant="h3" align="center" color="primary">
          You are not authorized to access this feature.
        </Typography>
        <AccessDeniedLottie loop={false} />
      </Grid>
    </StyledContentWrapper>
  );
};
