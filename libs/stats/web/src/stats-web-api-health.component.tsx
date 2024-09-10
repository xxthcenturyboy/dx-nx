import React,
{
  useEffect
} from 'react';
import {
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Cached
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
  red,
  green,
  grey
} from '@mui/material/colors';
import { toast } from 'react-toastify';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import {
  ContentWrapper,
  selectCurrentThemeMode,
  uiActions
} from '@dx/ui-web';
import { setDocumentTitle } from '@dx/utils-misc-web';
import {
  statsActions
} from './stats-web.reducer';
import {
  useLazyGetApiHealthzQuery
} from './stats-web-api';

export const StatsWebApiHealthComponent: React.FC = () => {
  const apiStats = useAppSelector((state: RootState) => state.stats.api);
  const themeMode = useAppSelector((state: RootState) => selectCurrentThemeMode(state));
  const theme = useTheme();
  const MD_BREAK = useMediaQuery(theme.breakpoints.down('md'));
  const SM_BREAK = useMediaQuery(theme.breakpoints.down('sm'));
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
    setDocumentTitle('Api Health');
    void fetchApiStats();
  }, []);

  useEffect(() => {
    if (!isLoadingApiStats) {
      dispatch(uiActions.awaitDialogOpenSet(false));
      if (!apiStatsError) {
        dispatch(statsActions.setApiStats(apiStatsResponse));
      }
      if (apiStatsError) {
        'error' in apiStatsError && toast.error(apiStatsError['error']);
      }
    }

    if (isLoadingApiStats) {
      dispatch(uiActions.awaitDialogOpenSet(true));
    }
  }, [isLoadingApiStats]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: themeMode === 'dark' ? theme.palette.common.black : theme.palette.primary.light,
      color: theme.palette.common.white,
      padding: '16px',
    },
  }));

  return (
    <ContentWrapper
      headerTitle={'API Health'}
      contentMarginTop={'56px'}
      headerColumnRightJustification={'flex-end'}
      headerColumnsBreaks={
        {
          left: {
            xs: 6
          },
          right: {
            xs: 6
          }
        }
      }
      headerContent={(
        <Tooltip title="Refresh Data">
          <Cached
            onClick={
              (event: React.SyntheticEvent) => {
                event.stopPropagation();
                void fetchApiStats();
              }
            }
            style={
              {
                cursor: 'pointer',
                width: '0.75em',
                margin: '0 10 0 0',
                color: 'inherit'
              }
            }
          />
        </Tooltip>
      )}
    >
      <Paper
        elevation={2}
      >
        <Grid
          container
          direction="column"
          padding="20px"
        >
          {/* HTTP */}
          <Grid
            item
          >
            <Table
              size="medium"
              id="http"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    colSpan={2}
                  >
                    HTTP
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <StyledTableCell
                    width={MD_BREAK ? '80%' : '20%'}
                  >
                    Status
                  </StyledTableCell>
                  <StyledTableCell
                    align={MD_BREAK ? 'right' : 'left'}
                  >
                    <Chip
                      label={apiStats?.http?.status || 'Down'}
                      sx={
                        {
                          backgroundColor: apiStats?.http?.status === 'OK' ? green[500] : grey[600],
                          color: grey[50]
                        }
                      }
                    />
                  </StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>

          {/* MEMORY */}
          <Grid
            item
          >
            <Table
              size="medium"
              id="memory"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    colSpan={2}
                  >
                    MEMORY
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <StyledTableCell
                    width={MD_BREAK ? '80%' : '20%'}
                  >
                    Status
                  </StyledTableCell>
                  <StyledTableCell
                    align={MD_BREAK ? 'right' : 'left'}
                  >
                    <Chip
                      label={apiStats?.memory?.status || 'Down'}
                      sx={
                        {
                          backgroundColor: apiStats?.memory?.status === 'OK' ? green[500] : grey[600],
                          color: grey[50]
                        }
                      }
                    />
                  </StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell>
                    Array Buffers
                  </StyledTableCell>
                  <StyledTableCell
                    align={MD_BREAK ? 'right' : 'left'}
                  >
                    { apiStats?.memory?.usage.arrayBuffers || 0 }
                  </StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell>
                    External
                  </StyledTableCell>
                  <StyledTableCell
                    align={MD_BREAK ? 'right' : 'left'}
                  >
                    { apiStats?.memory?.usage.external || 0 }
                  </StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell>
                    Heap Total
                  </StyledTableCell>
                  <StyledTableCell
                    align={MD_BREAK ? 'right' : 'left'}
                  >
                    { apiStats?.memory?.usage.heapTotal || 0 }
                  </StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell>
                    Heap Used
                  </StyledTableCell>
                  <StyledTableCell
                    align={MD_BREAK ? 'right' : 'left'}
                  >
                    { apiStats?.memory?.usage.heapUsed || 0 }
                  </StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell>
                    RSS
                  </StyledTableCell>
                  <StyledTableCell
                    align={MD_BREAK ? 'right' : 'left'}
                  >
                    { apiStats?.memory?.usage.rss || 0 }
                  </StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>

          {/* POSTGRES */}
          <Grid
            item
          >
            <Table
              size="medium"
              id="postgres"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    colSpan={2}
                  >
                    POSTGRES
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <StyledTableCell
                    width={MD_BREAK ? '80%' : '20%'}
                  >
                    Status
                  </StyledTableCell>
                  <StyledTableCell
                    align={MD_BREAK ? 'right' : 'left'}
                  >
                    <Chip
                      label={apiStats?.postgres?.status || 'No Data'}
                      sx={
                        {
                          backgroundColor: apiStats?.postgres?.status === 'OK' ? green[500] : grey[600],
                          color: grey[50]
                        }
                      }
                    />
                  </StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell>
                    Version
                  </StyledTableCell>
                  <StyledTableCell
                    align={MD_BREAK ? 'right' : 'left'}
                  >
                    { apiStats?.postgres?.version || '-' }
                  </StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>

          {/* REDIS */}
          <Grid
            item
          >
            <Table
              size="medium"
              id="redis"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    colSpan={2}
                  >
                    REDIS
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <StyledTableCell
                    width={MD_BREAK ? '80%' : '20%'}
                  >
                    Status
                  </StyledTableCell>
                  <StyledTableCell
                    align={MD_BREAK ? 'right' : 'left'}
                  >
                    <Chip
                      label={apiStats?.redis?.status || 'Down'}
                      sx={
                        {
                          backgroundColor: apiStats?.redis?.status === 'OK' ? green[500] : grey[600],
                          color: grey[50]
                        }
                      }
                    />
                  </StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell>
                    Ping
                  </StyledTableCell>
                  <StyledTableCell
                    align={MD_BREAK ? 'right' : 'left'}
                  >
                    <Chip
                      label={apiStats?.redis?.profile.ping ? 'OK' : 'FAIL'}
                      sx={
                        {
                          backgroundColor: apiStats?.redis?.profile.ping ? green[500] : red[600],
                          color: grey[50]
                        }
                      }
                    />
                  </StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell>
                    Read
                  </StyledTableCell>
                  <StyledTableCell
                    align={MD_BREAK ? 'right' : 'left'}
                  >
                      <Chip
                      label={apiStats?.redis?.profile.read ? 'OK' : 'FAIL'}
                      sx={
                        {
                          backgroundColor: apiStats?.redis?.profile.read ? green[500] : red[600],
                          color: grey[50]
                        }
                      }
                    />
                  </StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell>
                    Write
                  </StyledTableCell>
                  <StyledTableCell
                    align={MD_BREAK ? 'right' : 'left'}
                  >
                      <Chip
                      label={apiStats?.redis?.profile.write ? 'OK' : 'FAIL'}
                      sx={
                        {
                          backgroundColor: apiStats?.redis?.profile.write ? green[500] : red[600],
                          color: grey[50]
                        }
                      }
                    />
                  </StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>

        </Grid>
      </Paper>
    </ContentWrapper>
  );
};
