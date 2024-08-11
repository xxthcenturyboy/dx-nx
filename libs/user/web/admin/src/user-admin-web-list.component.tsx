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
import * as MuiColors from '@mui/material/colors';

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
  uiActions,
  useFocus
} from '@dx/ui-web';
import { CustomResponseErrorType } from '@dx/rtk-query-web';
import { debounce } from '@dx/utils-misc-web';
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
  const [mounted, setMounted] = useState<boolean>(false);
  const [searchInputRef, setSearchInputRef] = useFocus();
  const ROUTES = WebConfigService.getWebRoutes();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const smBreak = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const [
    fetchUserList,
    {
      data: userListResponse,
      error: userListError,
      isLoading: isLoadingUserList,
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
    setMounted(true);
    if (
      location
      && location.pathname
    ) {
      dispatch(userAdminActions.lastRouteSet(`${location.pathname}${location.search}`));
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
    && mounted
    && void fetchUsers();
  }, [limit, offset, orderBy, sortDir]);

  useEffect(() => {
    if (
      fetchUserListSuccess
    ) {
      if (!userListError) {
        dispatch(userAdminActions.listSet(userListResponse?.rows || []));
        dispatch(userAdminActions.userCountSet(userListResponse?.count));
      }
      if (
        userListError
      ) {
        dispatch(uiActions.apiDialogSet(userListError['error']));
      }
    }
  }, [fetchUserListSuccess]);

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
    if (user?.username === 'admin' && currentUser?.id !== user.id) {
      dispatch(uiActions.appDialogSet(
        <DialogAlert
          buttonText="Got it."
          message="You cannot edit the admin account."
        />
      ));
      return;
    }

    navigate(`${ROUTES.ADMIN.USER.EDIT}/${data.id}`);
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

    if (users && users.length) {
      for (const user of users) {
        const data = getRowData(user);
        rows.push(data);
      }
    }

    setRowData(rows);
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
    <Fade in={true} timeout={FADE_TIMEOUT_DUR}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Grid
          container
          direction={smBreak ? 'column-reverse' : 'row'}
          justifyContent={smBreak ? 'center' : 'space-between'}
          alignItems="center"
          style={{ marginBottom: '14px' }}
        >
          {/* Filter */}
          <Grid
            item
            style={{
              minWidth: smBreak ? '' : '260px',
              width: smBreak ? '100%' : '260px'
            }}
          >
            <FormControl
              margin="normal"
              variant="standard"
              style={{
                marginBottom: '16px',
                marginTop: 0,
                width: '100%'
              }}
            >
              <InputLabel htmlFor="input-filter">Filter</InputLabel>
              <Input
                id="input-filter"
                name="input-filter"
                ref={searchInputRef}
                onChange={handleFilterValueChange}
                type="search"
                autoCorrect="off"
                value={filterValue}
                fullWidth
              />
            </FormControl>
          </Grid>
          {/* New User */}
          {/* <Grid
            item
            style={{
              width: smBreak ? '100%' : '',
              marginBottom: smBreak ? '20px' : ''
            }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate(`${ROUTES.ADMIN.USER.EDIT}`)}
              disabled={userGetXhr}
              fullWidth={smBreak}
            >
              Create User
            </Button>
          </Grid> */}
        </Grid>
        <Divider style={{ width: '100%', marginBottom: '20px' }} />
        <TableComponent
          changeLimit={handleLimitChange}
          changeOffset={handleOffsetChange}
          changeSort={handleSortChange}
          clickRow={clickRow}
          count={usersCount || 0}
          collapsible
          header={headerData}
          loading={isLoadingUserList}
          limit={limit}
          // maxHeight="200px"
          offset={offset}
          orderBy={orderBy}
          refreshData={refreshTableData}
          rows={rowData}
          sortDir={sortDir}
          tableName="Users"
        />
      </Grid>
    </Fade>
  );
};
