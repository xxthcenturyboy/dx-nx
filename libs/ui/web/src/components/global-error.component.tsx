import * as React from 'react';
import {
  Box,
  Button,
  Grid,
  Typography
} from '@mui/material';

import { LottieError } from '../lottie/LottieError';

type GlobalErrorComponentPropsType = {
  routingFn?: () => void;
  buttonText?: string;
};

export const GlobalErrorComponent: React.FC<GlobalErrorComponentPropsType> = ({ routingFn, buttonText }) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '80vh' }}
    >
      <LottieError />
      <Typography
        variant="h1"
        color="primary"
      >
        Not Found
      </Typography>
      <Typography
        variant="h5"
        color="secondary"
        margin="15px"
      >
        We encountered a fatal system fault.
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
