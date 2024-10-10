import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Fade, Grid2, Typography, useMediaQuery, useTheme } from '@mui/material';

import { APP_NAME } from '@dx/config-shared';
import { WebConfigService } from '@dx/config-web';
import { FADE_TIMEOUT_DUR, MEDIA_BREAK } from '@dx/ui-web-system';
import { useLazyGetShortlinkTargetQuery } from './shortlink-web.api';

export const ShortlinkComponent: React.FC = () => {
  const { token } = useParams() as { token: string };
  const theme = useTheme();
  const smBreak = useMediaQuery(theme.breakpoints.down('sm'));
  const [hasFetched, setHasFetched] = useState(false);
  const navigate = useNavigate();
  const [
    fetchShortlink,
    {
      data: shortlinkResponse,
      error: shortlinkError,
      isFetching: isLoadingShortlink,
      isSuccess: shortlinkSuccess,
      isUninitialized: shortlinkUninitialized,
    },
  ] = useLazyGetShortlinkTargetQuery();

  useEffect(() => {
    if (!token) {
      routeToMain();
      return;
    }

    void fetchShortlink({ id: token });
  }, []);

  useEffect(() => {
    if (isLoadingShortlink) {
      setHasFetched(true);
    }
  }, [isLoadingShortlink]);

  useEffect(() => {
    if (hasFetched && shortlinkError) {
      routeToMain();
    }
  }, [shortlinkError]);

  useEffect(() => {
    if (hasFetched && !shortlinkError && shortlinkResponse) {
      navigate(shortlinkResponse, { replace: true });
    }
  }, [shortlinkResponse]);

  const routeToMain = () => {
    const ROUTES = WebConfigService.getWebRoutes();
    if (ROUTES && ROUTES.MAIN) {
      navigate(ROUTES.MAIN);
    }
  };

  return (
    <Fade in={true} timeout={FADE_TIMEOUT_DUR}>
      <Grid2
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '80vh' }}
        wrap="nowrap"
      >
        <Typography
          variant={smBreak ? 'h3' : 'h1'}
          color="primary"
          align="center"
        >
          {APP_NAME}
        </Typography>
      </Grid2>
    </Fade>
  );
};
