import * as React from 'react';
import {
  Box,
  Button,
  Grid2,
  Typography
} from '@mui/material';

import { NotFoundLottie } from '@dx/ui-web-lottie';
import { StyledContentWrapper } from './content/content-wrapper.styled';

type NotFoundComponentPropsType = {
  routingFn?: () => void;
  buttonText?: string;
};

export const NotFoundComponent: React.FC<NotFoundComponentPropsType> = ({
  routingFn,
  buttonText,
}) => {
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
        <NotFoundLottie />
        <Typography variant="h1" color="primary">
          Not Found
        </Typography>
        <Typography variant="h5" color="secondary" margin="15px">
          We couldn't find what you were looking for.
        </Typography>
        <Box margin="20px">
          <Button
            onClick={() => {
              routingFn ? routingFn() : history.back();
            }}
            variant="outlined"
          >
            {buttonText || 'Go Back'}
          </Button>
        </Box>
      </Grid2>
    </StyledContentWrapper>
  );
};
