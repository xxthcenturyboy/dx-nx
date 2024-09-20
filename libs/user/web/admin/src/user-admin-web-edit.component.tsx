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
  Grid,
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

  const renderColumnLeft = (): JSX.Element => {
    return (
      <Grid
        container
        width={MD_BREAK ? '100%' : '50%'}
        padding={MD_BREAK ? '10px' : '10px 24px'}
        direction="column"
      >
        <Grid container margin="0 0 20px">
          <Grid item width={'100%'}>
            {isLoadingUser && (
              <Skeleton
                animation="wave"
                variant="text"
                style={{
                  height: '56px',
                  width: '100%',
                }}
              />
            )}
            {!isLoadingUser && (
              <Typography>
                <span style={{ fontWeight: 700, marginRight: 12 }}>Name:</span>
                {user?.fullName}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Grid container margin="0 0 20px">
          <Typography style={{ fontWeight: 700 }}>Emails:</Typography>
          {/* {renderDivider('0 0 10')} */}
          {isLoadingUser && listSkeleton(2, '48px')}
          {!isLoadingUser && (
            <Grid container justifyContent="space-between">
              {user?.emails.map((email, index) => {
                return (
                  <React.Fragment key={`email-${index}`}>
                    <Grid
                      container
                      direction="row"
                      width="100%"
                      justifyContent="space-between"
                      borderTop="1px solid lightgray"
                      padding="10 0 3"
                      display="flex"
                      height="44px"
                      alignItems="center"
                    >
                      <Grid
                        item
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Typography>{email.email}</Typography>
                      </Grid>
                      <Grid item>
                        {email.isVerified && renderVerifiedChip()}
                        {email.default && renderDefaultChip()}
                        {email.label}
                      </Grid>
                    </Grid>
                  </React.Fragment>
                );
              })}
            </Grid>
          )}
        </Grid>
        <Grid container margin="0 0 20px">
          <Typography style={{ fontWeight: 700 }}>Phones:</Typography>
          {/* {renderDivider('0 0 10')} */}
          {isLoadingUser && listSkeleton(2, '48px')}
          {!isLoadingUser && (
            <Grid container justifyContent="space-between" direction="column">
              {user?.phones.map((phone, index) => {
                return (
                  <React.Fragment key={`phone-${index}`}>
                    <Grid
                      container
                      direction="row"
                      width="100%"
                      justifyContent="space-between"
                      borderTop="1px solid lightgray"
                      padding="10 0 3"
                      display="flex"
                      height="44px"
                      alignItems="center"
                    >
                      <Grid
                        item
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Typography>
                          {phone.uiFormatted || phone.phoneFormatted}
                        </Typography>
                      </Grid>
                      <Grid item>
                        {phone.isVerified && renderVerifiedChip()}
                        {phone.default && renderDefaultChip()}
                        {phone.label}
                      </Grid>
                    </Grid>
                  </React.Fragment>
                );
              })}
            </Grid>
          )}
        </Grid>
      </Grid>
    );
  };

  const renderColumnRight = (): JSX.Element => {
    return (
      <Grid
        container
        width={MD_BREAK ? '100%' : '50%'}
        padding={MD_BREAK ? '10px' : '10px 24px'}
        direction="column"
      >
        <Grid container margin="0 0 20px" direction="column">
          <Typography style={{ fontWeight: 700 }}>Roles:</Typography>
          {renderDivider('0 0 10')}
          {isLoadingUser && listSkeleton(2, '48px')}
          {!isLoadingUser && (
            <Grid container justifyContent="space-between">
              {roles.map((role, index) => {
                return (
                  <Grid container key={`role-${index}`}>
                    <Grid item>
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
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Grid>
        <Grid container direction="column">
          <Typography style={{ fontWeight: 700 }}>Restrictions:</Typography>
          {renderDivider('0 0 10')}
          {isLoadingUser && listSkeleton(2, '48px')}
          {!isLoadingUser && (
            <Grid container justifyContent="space-between">
              {restrictions.map((restriction, index) => {
                return (
                  <Grid container key={`restriction-${index}`}>
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
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Grid>
      </Grid>
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
        <Grid
          container
          justifyContent="flex-start"
          padding="20px"
          direction={MD_BREAK ? 'column' : 'row'}
        >
          {renderColumnLeft()}
          {renderColumnRight()}
        </Grid>

        <Grid
          container
          justifyContent="flex-start"
          padding="20px"
          direction={MD_BREAK ? 'column' : 'row'}
        >
          {renderDivider('12px 0 12px')}
          <Grid item>
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
          </Grid>
        </Grid>
      </Paper>
    </ContentWrapper>
  );
};
