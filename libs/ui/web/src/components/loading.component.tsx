import { BeatLoader } from 'react-spinners';
import {
  Button,
  Grid,
  Typography
} from '@mui/material';

import { themeColors } from '../mui-overrides/styles';

type LoadingProps = {
  error?: Error;
  timedOut?: Boolean;
  pastDelay?: Boolean;
  retry?: () => void;
};

export const UiLoadingComponent = (props: LoadingProps): JSX.Element | null => {
  const handleRetry = (): void => {
    if (typeof props.retry === 'function') {
      props.retry();
    }
  };

  if (props.error) {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '90vh' }}
      >
        <Button onClick={handleRetry}>retry</Button>
        <Typography>{props.error.message}</Typography>
      </Grid>
    );
  }

  if (props.timedOut) {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '90vh' }}
      >
        <Button onClick={handleRetry}>retry</Button>
        <Typography>timed out</Typography>
      </Grid>
    );
  }

  if (props.pastDelay) {
    return (
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
        <BeatLoader
          color={themeColors.secondary}
          size={30}
          margin="2px"
        />
      </Grid>
    );
  }

  return null;
};
