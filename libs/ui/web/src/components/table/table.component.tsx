import React,
{
  useEffect,
  useState
} from 'react';
import {
  Box,
  Collapse,
  Fade,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  // useMediaQuery,
  useTheme,
} from '@mui/material';
import { BeatLoader } from 'react-spinners';

import {
  RootState,
  useAppSelector
} from '@dx/store-web';
import {
  FADE_TIMEOUT_DUR,
  selectCurrentThemeMode
} from '@dx/ui-web';
import {
  TableCellData,
  TableComponentProps,
  TableDummyColumn,
  TableDummyRow,
  TableHeaderItem,
  TableRowType,
} from './types';
import {
  getIcon,
  IconNames
} from '../../Icons';
import { waveItem } from '../skeletons.ui';
import { TablePaginationActions } from './pagination.component';
import {
  BORDER_RADIUS,
  themeColors
} from '../../mui-overrides/styles';
import {
  StyledTableCell,
  StyledTableRow,
  StyledTableSortLabel
} from './table.ui';

export const TableComponent: React.FC<TableComponentProps> = React.forwardRef((props, ref) => {
  const {
    changeLimit,
    changeOffset,
    changeSort,
    clickRow,
    count,
    header,
    isInitialized,
    loading,
    limit,
    maxHeight,
    offset,
    orderBy,
    rows,
    sortDir,
    tableName,
  } = props;
  const theme = useTheme();
  const themeMode = useAppSelector((state: RootState) => selectCurrentThemeMode(state));
  const tableId = tableName?.toLowerCase().replace(' ', '-') || '';
  // const smBreak = useMediaQuery(theme.breakpoints.down('sm'));
  const [dummyData, setDummyData] = useState<TableDummyRow>([]);
  const [rowsPerPageOptions, setRowsPerPageOptions] = useState<number[]>();
  const rowHeight = '32px';
  const order = sortDir === 'ASC' ? 'asc' : 'desc';

  useEffect(() => {
    getLoadingData();
    setupRowsPerPage();
  }, []);

  useEffect(() => {
    getLoadingData();
  }, [header, limit]);

  const setupRowsPerPage = () => {
    const data: number[] = [10];
    if (count > 10) {
      data.push(25);
    }
    if (count > 25) {
      data.push(50);
    }
    if (count > 50) {
      data.push(100);
    }
    setRowsPerPageOptions(data);
  };

  const getLoadingData = () => {
    const rowData: TableDummyRow = [];
    const columnData: TableDummyColumn = [];
    header.map((data, index) => {
      columnData.push(index);
    });
    const max = count > limit ? limit : count;
    for (let i = 0; i < max; i += 1) {
      rowData.push(columnData);
    }
    setDummyData(rowData);
  };

  const renderIcon = (iconName: IconNames, color?: string) => {
    const Icon = getIcon(iconName, color);
    return Icon;
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    nextOffset: number,
  ) => {
    typeof changeOffset === 'function' && changeOffset(nextOffset);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const nextLimit = parseInt(event.target.value, 10);
    typeof changeLimit === 'function' && changeLimit(nextLimit);
    typeof changeOffset === 'function' && changeOffset(0);
  };

  return (
    <Paper
      elevation={2}
      sx={
        {
          borderRadius: '6px',
          width: '100%'
        }
      }
    >
      <Collapse
        in={isInitialized}
      >
        <Box
          padding="0"
          ref={ref}
          width="100%"
        >
          <TableContainer
            component={Box}
            style={
              {
                maxHeight,
                borderRadius: BORDER_RADIUS
              }
            }
          >
            <Table
              stickyHeader
              sx={
                {
                  minWidth: 1200
                }
              }
              size="small"
              aria-label=""
              id={tableId}
            >
              <TableHead>
                <TableRow>
                  {
                    header.map((data: TableHeaderItem, index: number) => {
                      return (
                        <StyledTableCell
                          key={`table-header-cell-${tableId}-${index}`}
                          align={data.align}
                          width={data.width}
                          sx={
                            {
                              cursor: data.sortable ? 'pointer' : ''
                            }
                          }
                          sortDirection={orderBy === data.fieldName ? order : false}
                          themeMode={themeMode || 'light'}
                        >
                          {
                            data.sortable ? (
                              <StyledTableSortLabel
                                active={orderBy === data.fieldName}
                                direction={orderBy === data.fieldName ? order : 'asc'}
                                onClick={
                                  () => typeof changeSort === 'function' && changeSort(data.fieldName)
                                }
                              >
                                { data.title }
                              </StyledTableSortLabel>
                            ) : (
                              <>{ data.title }</>
                            )
                          }
                        </StyledTableCell>
                      );
                    })
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  isInitialized
                  && !loading
                  && !rows.length
                  && (
                    <TableRow
                      sx={
                        {
                          height: '100px',
                          backgroundColor: themeMode === 'dark'
                            ? theme.palette.grey[700]
                            : theme.palette.grey[200],
                          '&:hover': {
                            backgroundColor: 'default'
                          }
                        }
                      }
                    >
                      <TableCell
                        colSpan={header.length + 1}
                        sx={
                          {
                            height: '200px',
                            textAlign: 'center',
                            fontSize: '42px',
                            color: 'primary'
                          }
                        }
                      >
                        <Fade
                          in={true}
                          timeout={FADE_TIMEOUT_DUR}
                        >
                          <Typography
                            variant='h2'
                          >
                            No Data
                          </Typography>
                        </Fade>
                      </TableCell>
                    </TableRow>
                  )
                }
                {
                  isInitialized
                  && loading
                  && dummyData.map((row, index) => {
                    return (
                      <StyledTableRow
                        key={`dummy-row-${index}`}
                        loading={loading ? 'true' : ''}
                        sx={
                          {
                            height: rowHeight
                          }
                        }
                        themeMode={themeMode || 'light'}
                      >
                        <TableCell
                          key={`dummy-cell-${index}`}
                          colSpan={row.length + 1}
                          sx={
                            {
                              minHeight: rowHeight
                            }
                          }
                        >
                          <Fade in={true} timeout={FADE_TIMEOUT_DUR}>
                            { waveItem(rowHeight) }
                          </Fade>
                        </TableCell>
                        {/* {
                          row.map((item, index) => {
                            return (
                              <TableCell
                                key={`dummy-cell-${item}-${index}`}
                                sx={
                                  {
                                    minHeight: rowHeight
                                  }
                                }
                              >
                                { waveItem(rowHeight) }
                              </TableCell>
                            )
                          })
                        } */}
                      </StyledTableRow>
                    );
                  })
                }
                {
                  !loading
                  && rows.length > 0
                  && rows.map((row: TableRowType) => {
                    const clickable = !!clickRow && typeof clickRow === 'function';
                    return (
                      <StyledTableRow
                        key={row.id}
                        loading={loading ? 'true' : ''}
                        sx={
                          {
                            cursor: clickable ? 'pointer' : '',
                            height: rowHeight
                          }
                        }
                        onClick={
                          () => clickRow && clickRow(row)
                        }
                        themeMode={themeMode || 'light'}
                      >
                        {
                          row.columns.map((cell: TableCellData, index: number) => {
                            return (
                              <TableCell
                                key={`table-data-cell-${row.id}-${index}`}
                                align={cell.align}
                                sx={
                                  {
                                    height: rowHeight
                                  }
                                }
                              >
                                <Fade in={true} timeout={FADE_TIMEOUT_DUR}>
                                  <span>
                                  {
                                    cell.componentType === 'text' && cell.data as string
                                  }
                                  {
                                    cell.componentType === 'icon' && !!cell.icon && renderIcon(cell.icon, cell.color)
                                  }
                                  </span>
                                </Fade>
                              </TableCell>
                            );
                          })
                        }
                      </StyledTableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
          <Table>
            <TableFooter
              sx={
                {
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '12px'
                }
              }
            >
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={count > 10 ? rowsPerPageOptions : undefined}
                  colSpan={header.length + 1}
                  count={count}
                  rowsPerPage={limit}
                  page={offset}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                  sx={
                    {
                      borderBottom: 'none',
                      borderTop: 'none',
                      // borderTop: `1px solid ${theme.palette.grey[400]}`,
                      color: themeColors.primary
                    }
                  }
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Box>
      </Collapse>
      {
        !isInitialized
        && (
          <Box
            display={'flex'}
            flexDirection={'row'}
            width={'100%'}
            padding={6}
            alignContent={'center'}
            justifyContent={'center'}
          >
            <BeatLoader
              color={themeColors.secondary}
              size={24}
              margin="2px"
            />
          </Box>
        )
      }
    </Paper>
  );
});
