import React,
{
  useEffect,
  useRef,
  useState
} from 'react';
import {
  Button,
  Divider,
  Fade,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { toast } from 'react-toastify';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import {
  DEBOUNCE,
  DialogAlert,
  FADE_TIMEOUT_DUR,
  IconNames,
  setDocumentTitle,
  TableComponent,
  TableHeaderItem,
  TableRowType,
  themeColors,
  uiActions,
  useFocus
} from '@dx/ui-web';
import {
  statsActions
} from './stats-web.reducer';
import {
  useLazyGetApiHealthzQuery
} from './stats-web-api';

export const StatsWebApiHealthComponent: React.FC = () => {
  const apiStats = useAppSelector((state: RootState) => state.stats.api);
  const dispatch = useAppDispatch();
  const [
    fetchApiStats,
    {
      data: apiStatsResponse,
      error: apiStatsError,
      isFetching: isLoadingApiStats,
      isSuccess: apiStatsSuccess,
      isUninitialized: apiStatsUninitialized
    }
  ] = useLazyGetApiHealthzQuery();

  useEffect(() => {
    void fetchApiStats();
  }, []);

  useEffect(() => {
    if (!isLoadingApiStats) {
      if (!apiStatsError) {
        dispatch(statsActions.setApiStats(apiStatsResponse));
      }
      if (apiStatsError) {
        'error' in apiStatsError && toast.error(apiStatsError['error']);
      }
    }
  }, [isLoadingApiStats]);

  return (
    <Fade
      in={true}
      timeout={FADE_TIMEOUT_DUR}
    >
      <Grid
        container
        direction="column"
      >
        <Grid
          item
        >
          <pre>
            HTTP:
            { JSON.stringify(apiStats?.http, null, 2) }
          </pre>
        </Grid>
        <Grid
          item
        >
          <pre>
            MEMORY:
            { JSON.stringify(apiStats?.memory, null, 2) }
          </pre>
        </Grid>
        <Grid
          item
        >
          <pre>
            POSTGRES:
            { JSON.stringify(apiStats?.postgres, null, 2) }
          </pre>
        </Grid>
        <Grid
          item
        >
          <pre>
            REDIS:
            { JSON.stringify(apiStats?.redis, null, 2) }
          </pre>
        </Grid>

      </Grid>
    </Fade>
  );
};
