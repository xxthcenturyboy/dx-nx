import React,
{
  useEffect,
  useRef,
  useState
} from 'react';
import {
  useLocation,
  useNavigate
} from 'react-router-dom';
import {
  FormControl,
  Grid,
  FilledInput,
  Input,
  InputLabel,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import * as MuiColors from '@mui/material/colors';
import {
  Cached
} from '@mui/icons-material';
import { BeatLoader } from 'react-spinners';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import {
  ContentWrapper,
  DEBOUNCE,
  DialogAlert,
  IconNames,
  TableComponent,
  TableHeaderItem,
  TableRowType,
  themeColors,
  uiActions,
  useFocus
} from '@dx/ui-web';
import {
  debounce,
  setDocumentTitle
} from '@dx/utils-misc-web';
import {
  GetUsersListQueryType,
  UserType
} from '@dx/user-shared';
import { WebConfigService } from '@dx/config-web';
import { userAdminActions } from './user-admin-web.reducer';
import { userAdminTableMetaData } from './user-admin-web-list.config';
import { selectUsersFormatted } from './user-admin-web.selectors';
import { useLazyGetUserAdminListQuery } from './user-admin-web.api';

export const UserAdminList: React.FC = () => {
  const filterValue = useAppSelector((state: RootState) => state.userAdmin.filterValue);
  const limit = useAppSelector((state: RootState) => state.userAdmin.limit);
  const offset = useAppSelector((state: RootState) => state.userAdmin.offset);
  const orderBy = useAppSelector((state: RootState) => state.userAdmin.orderBy);
  const sortDir = useAppSelector((state: RootState) => state.userAdmin.sortDir);
  const users = useAppSelector((state: RootState) => selectUsersFormatted(state));
  const usersCount = useAppSelector((state: RootState) => state.userAdmin.usersCount);
  const currentUser = useAppSelector((state: RootState) => state.userProfile);
  const [headerData, setHeaderData] = useState<TableHeaderItem[]>([]);
  const [tableMeta, setTableMeta] = useState(userAdminTableMetaData);
  const [rowData, setRowData] = useState<TableRowType[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchInputRef, setSearchInputRef] = useFocus();
  const ROUTES = WebConfigService.getWebRoutes();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const MD_BREAK = useMediaQuery(theme.breakpoints.down('md'));
  const SM_BREAK = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const [
    fetchUserList,
    {
      data: userListResponse,
      error: userListError,
      isFetching: isLoadingUserList,
      isSuccess: fetchUserListSuccess,
      isUninitialized: fetchUserListUninitialized
    }
  ] = useLazyGetUserAdminListQuery();

  useEffect(() => {
    setDocumentTitle('Admin Users');
    if (
      !users
      || users.length === 0
    ) {
      void fetchUsers();
    }
    if (
      location
      && location.pathname
    ) {
      dispatch(userAdminActions.lastRouteSet(location.pathname));
    }
    if (
      users
      && users.length
    ) {
      setupRows();
    }
  }, []);

  useEffect(() => {
    setupHeaders();
    setupRows();
  }, [tableMeta]);

  useEffect(() => {
    setupRows();
  }, [users]);

  useEffect(() => {
    !isLoadingUserList
    && void fetchUsers();
  }, [limit, offset, orderBy, sortDir]);

  useEffect(() => {
    if (
      !isLoadingUserList
    ) {
      if (!userListError) {
        dispatch(userAdminActions.listSet(userListResponse?.rows || []));
        dispatch(userAdminActions.userCountSet(userListResponse?.count));
      }
      if (
        userListError
      ) {
        'error' in userListError && dispatch(uiActions.apiDialogSet(userListError['error']));
      }
    }
  }, [isLoadingUserList]);

  const debounceFetch = useRef(debounce((value: string) => {
    void fetchUsers(value);
  }, DEBOUNCE)).current;

  const fetchUsers = async (searchValue?: string): Promise<void> => {
    const params: GetUsersListQueryType = {
      limit,
      offset,
      orderBy,
      sortDir,
      filterValue: searchValue !== undefined ? searchValue : filterValue,
    };
    await fetchUserList(params);
  };

  const refreshTableData = async (): Promise<void> => {
    dispatch(uiActions.awaitDialogMessageSet('Refreshing Data...'));
    dispatch(uiActions.awaitDialogOpenSet(true));
    await fetchUsers();
    dispatch(uiActions.awaitDialogMessageSet(''));
    dispatch(uiActions.awaitDialogOpenSet(false));
  };

  const setupHeaders = (): void => {
    const data: TableHeaderItem[] = [];

    for (const meta of tableMeta) {
      data.push({
        align: meta.headerAlign,
        fieldName: meta.fieldName,
        title: meta.title,
        sortable: meta.sortable,
        width: meta.width
      });
    }

    setHeaderData(data);
  };

  const clickRow = (data: TableRowType ): void => {
    const user = users.find(user => user.id === data.id);
    if (
      user?.username === 'admin'
      && currentUser?.id !== user.id
    ) {
      dispatch(uiActions.appDialogSet(
        <DialogAlert
          buttonText="Got it."
          message="You cannot edit the admin account."
        />
      ));
      return;
    }

    navigate(`${ROUTES.ADMIN.USER.DETAIL}/${data.id}`);
  };

  const getRowData = (user: UserType): TableRowType => {
    const row: TableRowType = {
      id: user.id,
      columns: [],
    };

    for (const meta of tableMeta) {
      let cellData: any;
      let icon: any;
      let color: string | undefined = undefined;

      if (meta.fieldName === 'emails') {
        const e = user.emails?.find(email => email.default);
        if (e) {
          cellData = e.email;
        }
        if (!e && user.emails?.length > 0) {
          cellData = user.emails[0].email;
        }
      }
      if (meta.fieldName === 'phones') {
        const p = user.phones?.find(phone => phone.default);
        if (p) {
          cellData = p.uiFormatted || p.phone;
        }
        if (!p && user.phones?.length > 0) {
          cellData = user.phones[0].uiFormatted || user.phones[0].phone;
        }
      }
      if (meta.fieldName === 'restrictions') {
        cellData = Array.isArray(user.restrictions) && user.restrictions.length > 0;
        if (cellData) {
          icon = IconNames.CHECK;
          color = MuiColors.red[300];
        }
      }
      if (meta.fieldName === 'isAdmin') {
        cellData = user.isAdmin;
        if (cellData) {
          icon = IconNames.CHECK;
          color = MuiColors.blue[200];
        }
      }
      if (meta.fieldName === 'isSuperAdmin') {
        cellData = user.isSuperAdmin;
        if (cellData) {
          icon = IconNames.CHECK;
          color = MuiColors.blue[700];
        }
      }
      if (meta.fieldName === 'optInBeta') {
        cellData = user.optInBeta;
        if (cellData) {
          icon = IconNames.CHECK;
          color = MuiColors.green[600];
        }
      }

      if (cellData === undefined) {
        // @ts-expect-error - error lame
        cellData = user[meta.fieldName];
      }
      row.columns.push({
        align: meta.align,
        color,
        componentType: meta.componentType,
        data: cellData,
        dataType: meta.fieldType,
        icon,
        onClick: (id: string, actionType: string) => console.log(id, actionType)
      });
    }

    return row;
  };

  const setupRows = (): void => {
    const rows: TableRowType[] = [];

    if (
      users
      && users.length
    ) {
      for (const user of users) {
        const data = getRowData(user);
        rows.push(data);
      }
    }

    setRowData(rows);
    // setTimeout(() => setIsInitialized(true), 300);
    setIsInitialized(true);
  };

  const handleOffsetChange = (offset: number) => {
    dispatch(userAdminActions.offsetSet(offset));
  };

  const handleLimitChange = (limit: number) => {
    dispatch(userAdminActions.limitSet(limit));
  };

  const handleSortChange = (fieldName: string): void => {
    if (fieldName === orderBy) {
      dispatch(userAdminActions.sortDirSet(sortDir === 'ASC' ? 'DESC' : 'ASC'));
      return;
    }

    dispatch(userAdminActions.orderBySet(fieldName));
    dispatch(userAdminActions.sortDirSet('ASC'));
  };

  const handleFilterValueChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value !== filterValue) {
      debounceFetch(value);
    }
    dispatch(userAdminActions.filterValueSet(value));
    // setSearchInputRef(); // may not be necessary
  };

  return (
    <ContentWrapper
      headerTitle={'User List'}
      contentMarginTop={SM_BREAK ? '124px' : '74px'}
      headerColumnRightJustification={SM_BREAK ? 'center' : 'flex-end'}
      headerColumnsBreaks={
        {
          left: {
            xs: 12,
            sm: 6
          },
          right: {
            xs: 12,
            sm: 6
          }
        }
      }
      headerContent={(
        <Grid
          container
          direction={SM_BREAK ? 'column-reverse' : 'row'}
          justifyContent={SM_BREAK ? 'center' : 'flex-end'}
          alignItems="center"
          style={
            {
              marginRight: MD_BREAK ? '0px' : '24px'
            }
          }
        >
          {/* Filter */}
          <Grid
            item
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            style={
              {
                minWidth: SM_BREAK ? '' : '360px',
                width: SM_BREAK ? '100%' : '360px'
              }
            }
          >
            <FormControl
              margin="normal"
              style={
                {
                  marginRight: SM_BREAK ? '24px' : '24px',
                  marginTop: 0,
                  width: '100%'
                }
              }
            >
              <FilledInput
                id="input-filter"
                name="input-filter"
                ref={searchInputRef}
                onChange={handleFilterValueChange}
                type="search"
                autoCorrect="off"
                value={filterValue}
                fullWidth
                placeholder={'Filter'}
                hiddenLabel
                size="small"
              />
            </FormControl>
            <span>
              <Tooltip title="Refresh List">
                <Cached
                  onClick={
                    (event: React.SyntheticEvent) => {
                      event.stopPropagation();
                      void refreshTableData();
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
            </span>
          </Grid>
          {/* New User */}
          {/* <Grid
            item
            style={{
              width: SM_BREAK ? '100%' : '',
              marginBottom: SM_BREAK ? '20px' : ''
            }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate(`${ROUTES.ADMIN.USER.DETAIL}`)}
              disabled={userGetXhr}
              fullWidth={SM_BREAK}
            >
              Create User
            </Button>
          </Grid> */}
        </Grid>
      )}
    >
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
      >
        {
          isInitialized && (
            <TableComponent
              changeLimit={handleLimitChange}
              changeOffset={handleOffsetChange}
              changeSort={handleSortChange}
              clickRow={clickRow}
              count={usersCount || 0}
              header={headerData}
              loading={isLoadingUserList}
              limit={limit}
              // maxHeight="272px"
              offset={offset}
              orderBy={orderBy}
              rows={rowData}
              sortDir={sortDir}
              tableName="Users"
            />
          )
        }
        {
          !isInitialized && (
            <BeatLoader
              color={themeColors.secondary}
              size={24}
              margin="2px"
              style={
                {
                  marginTop: '50px'
                }
              }
            />
          )
        }
      </Grid>
    </ContentWrapper>
  );
};
