import * as React from 'react';
import {
  Box,
  Button,
  Grid,
  Typography
} from '@mui/material';

import { LottieNotFound } from '../lottie/LottieNotFound';

type NotFoundComponentPropsType = {
  routingFn?: () => void;
  buttonText?: string;
};

export const NotFoundComponent: React.FC<NotFoundComponentPropsType> = ({ routingFn, buttonText }) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '80vh' }}
    >
      <LottieNotFound />
      <Typography
        variant="h1"
        color="primary"
      >
        Page Not Found
      </Typography>
      <Typography
        variant="h5"
        color="secondary"
        margin="15px"
      >
        We couldn't find what you were looking for.
      </Typography>
      <Box
        margin="20px"
      >
        <Button
          onClick={
            () => {
              routingFn
                ? routingFn()
                : history.back();
            }
          }
          variant="outlined"
        >
          { buttonText || 'Go Back' }
        </Button>
      </Box>
    </Grid>
  );
};
