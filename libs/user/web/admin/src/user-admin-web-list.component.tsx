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
  FilledInput,
  Grid,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Cached
} from '@mui/icons-material';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import {
  ContentWrapper,
  DEBOUNCE,
  DialogAlert,
  TableComponent,
  TableRowType,
  uiActions,
  useFocus
} from '@dx/ui-web';
import {
  debounce,
  setDocumentTitle
} from '@dx/utils-misc-web';
import {
  GetUsersListQueryType
} from '@dx/user-shared';
import { WebConfigService } from '@dx/config-web';
import { userAdminActions } from './user-admin-web.reducer';
import {
  selectUsersFormatted,
  selectUsersListData
} from './user-admin-web.selectors';
import { useLazyGetUserAdminListQuery } from './user-admin-web.api';
import { UserAdminWebListService } from './user-admin-web-list.service';

export const UserAdminList: React.FC = () => {
  const filterValue = useAppSelector((state: RootState) => state.userAdmin.filterValue);
  const limit = useAppSelector((state: RootState) => state.userAdmin.limit || 10);
  const offset = useAppSelector((state: RootState) => state.userAdmin.offset);
  const orderBy = useAppSelector((state: RootState) => state.userAdmin.orderBy);
  const sortDir = useAppSelector((state: RootState) => state.userAdmin.sortDir);
  const users = useAppSelector((state: RootState) => selectUsersFormatted(state));
  const userRowData = useAppSelector((state: RootState) => selectUsersListData(state));
  const usersCount = useAppSelector((state: RootState) => state.userAdmin.usersCount);
  const currentUser = useAppSelector((state: RootState) => state.userProfile);
  const usersListHeaders = UserAdminWebListService.getListHeaders();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
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
      // setTimeout(() => setIsInitialized(true), 1000);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (
      isInitialized
      && !isLoadingUserList
    ) {
      void fetchUsers();
      return;
    }

    setIsFetching(false);
  }, [limit, offset, orderBy, sortDir]);

  useEffect(() => {
    if (
      !isLoadingUserList
    ) {
      if (
        !userListError
        && userListResponse?.rows
      ) {
        dispatch(userAdminActions.listSet(userListResponse?.rows || []));
        dispatch(userAdminActions.userCountSet(userListResponse?.count));
        setIsFetching(false);
      }
      if (
        userListError
      ) {
        'error' in userListError && dispatch(uiActions.apiDialogSet(userListError['error']));
        setIsFetching(false);
      }
    }
  }, [isLoadingUserList]);

  const debounceFetch = useRef(debounce((value: string) => {
    void fetchUsers(value);
  }, DEBOUNCE)).current;

  const fetchUsers = async (searchValue?: string): Promise<void> => {
    setIsFetching(true);
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
    await fetchUsers();
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
              margin="none"
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
              <IconButton
                color="primary"
                onClick={
                  (event: React.SyntheticEvent) => {
                    event.stopPropagation();
                    void refreshTableData();
                  }
                }
                sx={
                  {
                    boxShadow: 1
                  }
                }
              >
                <Tooltip title="Refresh List">
                  <Cached />
                </Tooltip>
              </IconButton>

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
        <TableComponent
          changeLimit={handleLimitChange}
          changeOffset={handleOffsetChange}
          changeSort={handleSortChange}
          clickRow={clickRow}
          count={usersCount || limit}
          header={usersListHeaders}
          isInitialized={isInitialized}
          loading={isFetching}
          limit={limit}
          // maxHeight="272px"
          offset={offset}
          orderBy={orderBy}
          rows={userRowData}
          sortDir={sortDir}
          tableName="Users"
        />
      </Grid>
    </ContentWrapper>
  );
};
