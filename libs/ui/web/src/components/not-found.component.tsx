import * as React from 'react';
import {
  Box,
  Button,
  Grid,
  Typography
} from '@mui/material';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import {
  WEB_ROUTES
} from '@dx/config-web';
import { LottieNotFound } from '../lottie/LottieNotFound';
import { selectAuthToken } from '@dx/auth-web';

export const NotFoundComponent: React.FC = () => {
  const isAuthenticated = useAppSelector((state: RootState) => selectAuthToken(state));
  const dispatch = useAppDispatch();

  const goHome = () => {
    if (isAuthenticated) {
      dispatch(push(WEB_ROUTES.USER_PROFILE));
      return;
    }
    dispatch(push(WEB_ROUTES.MAIN));
  };

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
          onClick={goHome}
          variant="outlined"
        >
          Go Back to Home
        </Button>
      </Box>
    </Grid>
  );
};
