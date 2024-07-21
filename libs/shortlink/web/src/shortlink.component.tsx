import React,
{
  useEffect,
  useState
} from 'react';
import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import {
  useParams,
  useNavigate
} from 'react-router-dom';
import {
  Fade,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { APP_NAME } from '@dx/config-shared';
import { WebConfigService } from '@dx/config-web';
import {
  FADE_TIMEOUT_DUR,
  MEDIA_BREAK
} from '@dx/ui-web';
// import fetchShortlink from 'client/Shortlink/actions/fetchShortlink';

export const ShortlinkComponent: React.FC = () => {
  const { token } = useParams() as { token: string };
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const smBreak = useMediaQuery(theme.breakpoints.down('sm'));
  const [hasFetched, setHasFetched] = useState(false);
  const isFetching = useAppSelector((state: RootState) => state.shortlink.isFetchingShortlink);
  const fetchError = useAppSelector((state: RootState) => state.shortlink.fetchShortlinkError);
  const fetchedRoute = useAppSelector((state: RootState) => state.shortlink.fetchedRoute);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      routeToMain();
      return;
    }

    // dispatch(fetchShortlink(token));
  }, []);

  useEffect(() => {
    if (isFetching) {
      setHasFetched(true);
    };
  }, [isFetching]);

  useEffect(() => {
    if (hasFetched && fetchError) {
      routeToMain();
    }
  }, [fetchError]);

  useEffect(() => {
    if (
      hasFetched
      && !fetchError
      && fetchedRoute
    ) {
      navigate(fetchedRoute, { replace: true });
    }
  }, [fetchedRoute]);

  const routeToMain = () => {
    const routes = WebConfigService.getWebRoutes();
    if (routes && routes.MAIN) {
      navigate(routes.MAIN);
    }
  };

  return (
    <Fade in={true} timeout={FADE_TIMEOUT_DUR}>
      <Grid
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
      </Grid>
    </Fade>
  );
};
