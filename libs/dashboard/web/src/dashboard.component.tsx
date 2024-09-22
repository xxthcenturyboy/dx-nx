import * as React from 'react';
import { Grid2, Typography } from '@mui/material';

import { ContentWrapper } from '@dx/ui-web-global-components';
import { WelcomeRobotLottie } from '@dx/ui-web-lottie';
import { setDocumentTitle } from '@dx/utils-misc-web';

export const Dashboard: React.FC = () => {
  React.useEffect(() => {
    setDocumentTitle('Dashboard');
  }, []);

  return (
    <ContentWrapper
      headerTitle={'Dashboard'}
      contentMarginTop={'64px'}
      headerColumnRightJustification={'flex-end'}
      headerColumnsBreaks={{
        left: {
          xs: 11,
        },
      }}
    >
      <Grid2
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '80vh' }}
        wrap="nowrap"
      >
        <WelcomeRobotLottie />
        <Typography variant="h5" color="secondary" margin="15px" align="center">
          Have a look around.
        </Typography>
      </Grid2>
    </ContentWrapper>
  );
};
