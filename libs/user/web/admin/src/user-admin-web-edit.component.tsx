import React,
{
  useEffect,
  useState
} from 'react';
import {
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid2,
  Paper,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  lightBlue,
  grey
} from '@mui/material/colors';
import { toast } from 'react-toastify';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import { uiActions } from '@dx/ui-web-system';
import { listSkeleton } from '@dx/ui-web-global-components';
import { ContentWrapper } from '@dx/ui-web-global-components';
import { DialogAlert } from '@dx/ui-web-dialogs';
import { setDocumentTitle } from '@dx/utils-misc-web';
import { UserRoleUi } from '@dx/user-shared';
import { ACCOUNT_RESTRICTIONS } from '@dx/auth-shared';
import { WebConfigService } from '@dx/config-web';
import { prepareRoleCheckboxes } from '@dx/user-privilege-web';
import { privilegeSetActions } from '@dx/user-privilege-web';
import { useLazyGetPrivilegeSetsQuery } from '@dx/user-privilege-web';
import { NotificationSendDialog } from '@dx/notifications-web';
import { userAdminActions } from './user-admin-web.reducer';
import { selectUserFormatted } from './user-admin-web.selectors';
import {
  useLazyGetUserAdminQuery,
  useUpdateUserRolesRestrictionsMutation,
} from './user-admin-web.api';

type UserRestriction = {
  restriction: keyof typeof ACCOUNT_RESTRICTIONS;
  isRestricted: boolean;
};

export const UserAdminEdit: React.FC = () => {
  const user = useAppSelector((state: RootState) => selectUserFormatted(state));
  const sets = useAppSelector((state: RootState) => state.privileges.sets);
  const currentUser = useAppSelector((state: RootState) => state.userProfile);
  const [title, setTitle] = useState('User');
  const [restrictions, setRestrictions] = useState<UserRestriction[]>([]);
  const [roles, setRoles] = useState<UserRoleUi[]>([]);
  const ROUTES = WebConfigService.getWebRoutes();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const theme = useTheme();
  const MD_BREAK = useMediaQuery(theme.breakpoints.down('md'));
  const SM_BREAK = useMediaQuery(theme.breakpoints.down('sm'));
  const [
    fetchPrivilegeSets,
    {
      data: privilegeResponse,
      error: privilegeError,
      isFetching: isLoadingPrivilegeSet,
      isSuccess: privilegeSetSuccess,
      isUninitialized: privilegeSetUninitialized,
    },
  ] = useLazyGetPrivilegeSetsQuery();
  const [
    fetchUser,
    {
      data: userResponse,
      error: userError,
      isFetching: isLoadingUser,
      isSuccess: fetchUserSuccess,
      isUninitialized: fetchUserUninitialized,
    },
  ] = useLazyGetUserAdminQuery();
  const [
    fetchUserRolesRestrictionsUpdate,
    {
      data: updateUserResponse,
      error: updateUserError,
      isLoading: isLoadingUpdateUser,
      isSuccess: updateUserSuccess,
      isUninitialized: updateUserUninitialized,
    },
  ] = useUpdateUserRolesRestrictionsMutation();

  useEffect(() => {
    void getUserData();
    setDocumentTitle(title);
    if (location && location.pathname) {
      dispatch(
        userAdminActions.lastRouteSet(`${location.pathname}${location.search}`)
      );
    }
    if (!sets || !sets.length) {
      void fetchPrivilegeSets();
    }

    return function cleanup() {
      dispatch(userAdminActions.userSet(undefined));
    };
  }, []);

  useEffect(() => {
    if (user) {
      setTitle(`User: ${user.username}`);
      setupRestrictions();
      setupRoles();
    }
  }, [user]);

  useEffect(() => {
    if (user && sets) {
      setupRoles();
    }
  }, [sets]);

  useEffect(() => {
    if (!isLoadingPrivilegeSet) {
      if (!privilegeError && privilegeResponse) {
        dispatch(privilegeSetActions.setPrivileges(privilegeResponse));
      }
      if (privilegeError && 'error' in privilegeError) {
        dispatch(uiActions.apiDialogSet(privilegeError['error']));
      }
    }
  }, [isLoadingPrivilegeSet]);

  useEffect(() => {
    if (!isLoadingUser) {
      if (!userError) {
        dispatch(userAdminActions.userSet(userResponse));
      }
      if (userError) {
        'error' in userError &&
          dispatch(uiActions.apiDialogSet(userError['error']));
      }
    }
  }, [isLoadingUser]);

  useEffect(() => {
    if (!isLoadingUpdateUser && !updateUserUninitialized) {
      if (updateUserError && 'error' in updateUserError) {
        dispatch(uiActions.apiDialogSet(updateUserError.error));
      }

      if (!updateUserError) {
        toast.success('User updated.');
      }
    }
  }, [isLoadingUpdateUser]);

  const getUserData = async (): Promise<void> => {
    if (id) {
      await fetchUser(id);
    }
  };

  const setupRestrictions = (): void => {
    const keys = Object.keys(
      ACCOUNT_RESTRICTIONS
    ) as (keyof typeof ACCOUNT_RESTRICTIONS)[];
    const userRestrictions: UserRestriction[] = [];
    if (user?.restrictions && Array.isArray(user.restrictions)) {
      for (const key of keys) {
        const thisRestriction = ACCOUNT_RESTRICTIONS[key];
        userRestrictions.push({
          restriction: thisRestriction as keyof typeof ACCOUNT_RESTRICTIONS,
          isRestricted: user.restrictions.indexOf(thisRestriction) > -1,
        });
      }
    }

    setRestrictions(userRestrictions);
  };

  const setupRoles = (): void => {
    if (sets && user) {
      const roleCheckboxes = prepareRoleCheckboxes(sets, user);
      setRoles(roleCheckboxes);
    }
  };

  const handleRoleClick = async (clickedRole: string): Promise<void> => {
    if (currentUser?.id === user?.id && !currentUser?.sa) {
      dispatch(
        uiActions.appDialogSet(
          <DialogAlert
            buttonText="Aw, shucks"
            message="You cannot edit your own privileges."
          />
        )
      );
      return;
    }

    if (user?.roles && Array.isArray(user.roles)) {
      let nextRoles = [...new Set(user.roles)];
      if (user.roles.indexOf(clickedRole) > -1) {
        nextRoles = user?.roles.filter((role) => role !== clickedRole);
      } else {
        nextRoles.push(clickedRole);
      }

      const updateData = {
        ...user,
        roles: nextRoles,
      };

      dispatch(userAdminActions.userSet(updateData));
      setupRoles();
      void fetchUserRolesRestrictionsUpdate({
        id: user.id,
        roles: nextRoles,
      });
    }
  };

  const renderDivider = (m?: string): JSX.Element => {
    return <Divider sx={{ margin: m ? m : '10px 0', width: '100%' }} />;
  };

  const renderDefaultChip = (): JSX.Element => {
    return (
      <Chip
        label="Default"
        color="info"
        sx={{
          height: '20px',
          marginRight: '12px',
        }}
      />
    );
  };

  const renderVerifiedChip = (): JSX.Element => {
    return (
      <Chip
        label="Verified"
        color="success"
        sx={{
          height: '20px',
          marginRight: '12px',
        }}
      />
    );
  };

  const renderEmailsPhones = (): JSX.Element => {
    return (
      <Grid2
        container
        width={MD_BREAK ? '100%' : '50%'}
        padding={MD_BREAK ? '10px' : '10px 24px'}
        direction="column"
      >
        {/** NAME */}
        <Grid2
          container
          margin="0 0 20px"
        >
          <Grid2
            width={'100%'}
          >
            {
              isLoadingUser && (
                <Skeleton
                  animation="wave"
                  variant="text"
                  style={{
                    height: '56px',
                    width: '100%',
                  }}
                />
              )
            }
            {
              !isLoadingUser && (
                <>
                  <Grid2
                    sx={(theme) => {
                      return {
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.common.white,
                        padding: MD_BREAK ? '4px 0' : '4px 4px 4px 8px',
                        textAlign: MD_BREAK ? 'center' : 'left'
                      }
                    }}
                  >
                    <Typography fontWeight={700}>Name</Typography>
                  </Grid2>
                  <Grid2>
                    <Typography
                        variant="body1"
                      >
                        { user?.fullName }
                      </Typography>
                  </Grid2>
                </>
              )
            }
          </Grid2>
        </Grid2>

        {/** EMAILS */}
        <Grid2
          container
          margin="0 0 20px"
          direction={'column'}
        >
          <Grid2
            sx={(theme) => {
              return {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.common.white,
                padding: MD_BREAK ? '4px 0' : '4px 4px 4px 8px',
                textAlign: MD_BREAK ? 'center' : 'left'
              }
            }}
          >
            <Typography fontWeight={700}>Emails</Typography>
          </Grid2>

          {/* {renderDivider('0 0 10')} */}
          {
            isLoadingUser && listSkeleton(2, '48px')
          }
          {
            !isLoadingUser && (
              <Grid2
                container
                justifyContent="space-between"
                direction="column"
              >
                {
                  user?.emails.map((email, index) => {
                    return (
                      <React.Fragment key={`email-${index}`}>
                        <Grid2
                          container
                          direction={MD_BREAK ? 'column' : 'row'}
                          width="100%"
                          justifyContent={MD_BREAK ? 'flex-start' : 'space-between'}
                          borderTop="1px solid lightgray"
                          padding="10px 0px 3px"
                          display="flex"
                          alignItems={MD_BREAK ? 'flex-start' : 'center'}
                        >
                          <Grid2
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <Typography
                              variant="body1"
                            >
                              { email.email }
                            </Typography>
                          </Grid2>
                          {
                            MD_BREAK && (
                              <>
                                <Grid2 padding={'4px 0 0'}>
                                  <Typography
                                    variant="body1"
                                  >
                                    { email.label }
                                  </Typography>
                                </Grid2>
                                <Grid2 padding={'4px 0'}>
                                  { email.isVerified && renderVerifiedChip() }
                                  { email.default && renderDefaultChip() }
                                </Grid2>
                              </>
                            )
                          }
                          {
                            !MD_BREAK && (
                              <Grid2>
                                { email.isVerified && renderVerifiedChip() }
                                { email.default && renderDefaultChip() }
                                { email.label }
                              </Grid2>
                            )
                          }
                        </Grid2>
                      </React.Fragment>
                    );
                  })
                }
              </Grid2>
            )
          }
        </Grid2>

        {/** PHONES */}
        <Grid2
          container
          margin="0 0 20px"
          direction={'column'}
        >
          <Grid2
            sx={(theme) => {
              return {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.common.white,
                padding: MD_BREAK ? '4px 0' : '4px 4px 4px 8px',
                textAlign: MD_BREAK ? 'center' : 'left'
              }
            }}
          >
            <Typography fontWeight={700}>Phones</Typography>
          </Grid2>
          {/* {renderDivider('0 0 10')} */}
          {
            isLoadingUser && listSkeleton(2, '48px')
          }
          {
            !isLoadingUser && (
              <Grid2
                container
                justifyContent="space-between"
                direction="column"
              >
                {
                  user?.phones.map((phone, index) => {
                    return (
                      <React.Fragment key={`phone-${index}`}>
                        <Grid2
                          container
                          direction={MD_BREAK ? 'column' : 'row'}
                          width="100%"
                          justifyContent={MD_BREAK ? 'flex-start' : 'space-between'}
                          borderTop="1px solid lightgray"
                          padding="10px 0px 3px"
                          display="flex"
                          alignItems={MD_BREAK ? 'flex-start' : 'center'}
                        >
                          <Grid2
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <Typography
                              variant="body1"
                            >
                              { phone.uiFormatted || phone.phoneFormatted }
                            </Typography>
                          </Grid2>
                          {
                            MD_BREAK && (
                              <>
                                <Grid2 padding={'4px 0 0'}>
                                  <Typography
                                    variant="body1"
                                  >
                                    { phone.label }
                                  </Typography>
                                </Grid2>
                                <Grid2 padding={'4px 0'}>
                                  { phone.isVerified && renderVerifiedChip() }
                                  { phone.default && renderDefaultChip() }
                                </Grid2>
                              </>
                            )
                          }
                          {
                            !MD_BREAK && (
                              <Grid2>
                                { phone.isVerified && renderVerifiedChip() }
                                { phone.default && renderDefaultChip() }
                                <Typography
                                  variant="body1"
                                  display={'inline-flex'}
                                >
                                  { phone.label }
                                </Typography>
                              </Grid2>
                            )
                          }
                        </Grid2>
                      </React.Fragment>
                    );
                  })
                }
              </Grid2>
            )
          }
        </Grid2>
      </Grid2>
    );
  };

  const renderRolesRestrictions = (): JSX.Element => {
    return (
      <Grid2
        container
        width={MD_BREAK ? '100%' : '50%'}
        padding={MD_BREAK ? '10px' : '10px 24px'}
        direction="column"
      >
        {/** ROLES */}
        <Grid2
          container
          margin="0 0 20px"
          direction="column"
        >
          <Grid2
            sx={(theme) => {
              return {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.common.white,
                padding: MD_BREAK ? '4px 0' : '4px 4px 4px 8px',
                textAlign: MD_BREAK ? 'center' : 'left'
              }
            }}
          >
            <Typography fontWeight={700}>Roles</Typography>
          </Grid2>
          {
            renderDivider('0 0 10')
          }
          {
            isLoadingUser && listSkeleton(2, '48px')
          }
          {
            !isLoadingUser && (
              <Grid2
                container
                justifyContent="space-between"
                direction={'column'}
              >
                {
                  roles.map((role, index) => {
                    return (
                      <Grid2 container key={`role-${index}`}>
                        <Grid2>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="large"
                                  checked={role.hasRole}
                                  onClick={() => void handleRoleClick(role.role)}
                                />
                              }
                              label={role.role}
                            />
                          </FormGroup>
                        </Grid2>
                      </Grid2>
                    );
                  })
                }
              </Grid2>
            )
          }
        </Grid2>

        {/** RESTRICTIONS */}
        <Grid2
          container
          direction="column"
        >
          <Grid2
            sx={(theme) => {
              return {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.common.white,
                padding: MD_BREAK ? '4px 0' : '4px 4px 4px 8px',
                textAlign: MD_BREAK ? 'center' : 'left'
              }
            }}
          >
            <Typography fontWeight={700}>Restrictions</Typography>
          </Grid2>
          { renderDivider('0 0 10') }
          {
            isLoadingUser && listSkeleton(2, '48px')
          }
          {
            !isLoadingUser && (
              <Grid2
                container
                justifyContent="space-between"
                direction={'column'}
              >
                {
                  restrictions.map((restriction, index) => {
                    return (
                      <Grid2 container key={`restriction-${index}`}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                className="Mui-checked-error"
                                size="large"
                                checked={restriction.isRestricted}
                                onClick={() =>
                                  console.log('clicked', restriction.restriction)
                                }
                              />
                            }
                            label={restriction.restriction}
                          />
                        </FormGroup>
                      </Grid2>
                    );
                  })
                }
              </Grid2>
            )
          }
        </Grid2>
      </Grid2>
    );
  };

  const renderActionArea = (): JSX.Element => {
    return (
      <Grid2>
        <Button
          variant="contained"
          onClick={() =>
            dispatch(
              uiActions.appDialogSet(<NotificationSendDialog user={user} />)
            )
          }
          color={'primary'}
        >
          Send Notification
        </Button>
      </Grid2>
    );
  };

  return (
    <ContentWrapper
      headerTitle={title}
      contentMarginTop={SM_BREAK ? '108px' : '64px'}
      headerColumnRightJustification={SM_BREAK ? 'flex-start' : 'flex-end'}
      headerColumnsBreaks={{
        left: {
          xs: 12,
          sm: 6,
        },
        right: {
          xs: 12,
          sm: 6,
        },
      }}
      navigation={() => navigate(ROUTES.ADMIN.USER.LIST)}
      headerContent={
        <>
          {user?.optInBeta && (
            <Chip
              label="Opt-in Beta"
              sx={{
                backgroundColor: lightBlue[700],
                color: grey[50],
                margin: SM_BREAK ? '0 0 0 12px' : '0 12px 0 0',
              }}
            />
          )}
          {user?.restrictions && user.restrictions.length > 0 && (
            <Chip label="RESTRICTED" color="error" />
          )}
        </>
      }
    >
      <Paper elevation={2}>
        {/** Phones Emails Roles Restrictions */}
        <Grid2
          container
          justifyContent="flex-start"
          padding="20px"
          direction={MD_BREAK ? 'column' : 'row'}
          size={12}
        >
          { renderEmailsPhones() }
          { renderRolesRestrictions() }
        </Grid2>

        {/** Action Area */}
        <Grid2
          container
          justifyContent="flex-start"
          padding="20px"
          direction={MD_BREAK ? 'column' : 'row'}
          size={12}
        >
          { renderDivider('12px 0 12px') }
          { renderActionArea() }
        </Grid2>
      </Paper>
    </ContentWrapper>
  );
};
