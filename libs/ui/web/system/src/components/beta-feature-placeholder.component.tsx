import * as React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';

import { setDocumentTitle } from '@dx/utils-misc-web';
import { BetaBadgeLottie } from '../lottie/beta-badge.lottie';
import { StyledContentWrapper } from './content/content-wrapper.styled';

export const BetaFeatureComponent: React.FC = () => {
  React.useEffect(() => {
    setDocumentTitle('Coming Soon');
  }, []);

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
        <BetaBadgeLottie />
        <Typography variant="h1" color="primary">
          Coming Soon
        </Typography>
        <Typography variant="h5" color="secondary" margin="15px">
          This feature is not ready yet. Check back for updates.
        </Typography>
      </Grid>
    </StyledContentWrapper>
  );
};
