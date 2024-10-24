import { BeatLoader } from 'react-spinners';
import {
  Button,
  Grid2,
  Typography
} from '@mui/material';

import { themeColors } from '@dx/ui-web-system';
import { StyledContentWrapper } from './content/content-wrapper.styled';

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
      <StyledContentWrapper>
        <Grid2
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '90vh' }}
        >
          <Button onClick={handleRetry}>retry</Button>
          <Typography>{props.error.message}</Typography>
        </Grid2>
      </StyledContentWrapper>
    );
  }

  if (props.timedOut) {
    return (
      <StyledContentWrapper>
        <Grid2
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '90vh' }}
        >
          <Button onClick={handleRetry}>retry</Button>
          <Typography>timed out</Typography>
        </Grid2>
      </StyledContentWrapper>
    );
  }

  if (props.pastDelay) {
    return (
      <StyledContentWrapper>
        <Grid2
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{
            minHeight: '90vh',
          }}
        >
          <BeatLoader color={themeColors.secondary} size={30} margin="2px" />
        </Grid2>
      </StyledContentWrapper>
    );
  }

  return null;
};
