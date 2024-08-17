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
  Box,
  Checkbox,
  Chip,
  Divider,
  Fade,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import { lightBlue } from '@mui/material/colors';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import {
  DialogAlert,
  FADE_TIMEOUT_DUR,
  setDocumentTitle,
  uiActions
} from '@dx/ui-web';
import { UserRoleUi } from '@dx/user-shared';
import { ACCOUNT_RESTRICTIONS } from '@dx/auth-shared';
import { WebConfigService } from '@dx/config-web';
import { prepareRoleCheckboxes } from '@dx/user-privilege-web';
import { userAdminActions } from './user-admin-web.reducer';
import { selectUserFormatted } from './user-admin-web.selectors';
import {
  useLazyGetUserAdminQuery,
  useUpdateUserRolesRestrictionsMutation
} from './user-admin-web.api';
import { privilegeSetActions } from '@dx/user-privilege-web';
import { useLazyGetPrivilegeSetsQuery } from '@dx/user-privilege-web';
import { toast } from 'react-toastify';

type UserRestriction = {
  restriction: keyof typeof ACCOUNT_RESTRICTIONS;
  isRestricted: boolean;
};

export const UserAdminEdit: React.FC = () => {
  const user = useAppSelector((state: RootState) => selectUserFormatted(state));
  const sets = useAppSelector((state: RootState) => state.privileges.sets);
  const currentUser = useAppSelector((state: RootState) => state.userProfile);
  const [title, setTitle] = useState('Edit User');
  const [restrictions, setRestrictions] = useState<UserRestriction[]>([]);
  const [roles, setRoles] = useState<UserRoleUi[]>([]);
  const ROUTES = WebConfigService.getWebRoutes();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const theme = useTheme();
  const mdBreak = useMediaQuery(theme.breakpoints.down('md'));
  const smBreak = useMediaQuery(theme.breakpoints.down('sm'));
  const [
    fetchPrivilegeSets,
    {
      data: privilegeResponse,
      error: privilegeError,
      isFetching: isLoadingPrivilegeSet,
      isSuccess: privilegeSetSuccess,
      isUninitialized: privilegeSetUninitialized
    }
  ] = useLazyGetPrivilegeSetsQuery();
  const [
    fetchUser,
    {
      data: userResponse,
      error: userError,
      isFetching: isLoadingUser,
      isSuccess: fetchUserSuccess,
      isUninitialized: fetchUserUninitialized
    }
  ] = useLazyGetUserAdminQuery();
  const [
    fetchUserRolesRestrictionsUpdate,
    {
      data: updateUserResponse,
      error: updateUserError,
      isLoading: isLoadingUpdateUser,
      isSuccess: updateUserSuccess,
      isUninitialized: updateUserUninitialized
    }
  ] = useUpdateUserRolesRestrictionsMutation();

  useEffect(() => {
    void getUserData();
    setDocumentTitle(title);
    if (location && location.pathname) {
      dispatch(userAdminActions.lastRouteSet(`${location.pathname}${location.search}`));
    }
    if (
      !sets
      || !sets.length
    ) {
      void fetchPrivilegeSets();
    }

    return function cleanup() {
      dispatch(userAdminActions.userSet(undefined));
    };
  }, []);

  useEffect(() => {
    if (user) {
      setTitle(`Edit User: ${user.username}`);
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
    if (
      !isLoadingPrivilegeSet
    ) {
      if (
        !privilegeError
        && privilegeResponse
      ) {
        dispatch(privilegeSetActions.setPrivileges(privilegeResponse));
      }
      if (
        privilegeError
        && 'error' in privilegeError
      ) {
        dispatch(uiActions.apiDialogSet(privilegeError['error']));
      }
    }
  }, [isLoadingPrivilegeSet]);

  useEffect(() => {
    if (
      !isLoadingUser
    ) {
      if (!userError) {
        dispatch(userAdminActions.userSet(userResponse));
      }
      if (
        userError
      ) {
        'error' in userError && dispatch(uiActions.apiDialogSet(userError['error']));
      }
    }
  }, [isLoadingUser]);

  useEffect(() => {
    if (
      !isLoadingUpdateUser
      && !updateUserUninitialized
    ) {
      if (
        updateUserError
        && 'error' in updateUserError
      ) {
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
    const keys = Object.keys(ACCOUNT_RESTRICTIONS) as (keyof typeof ACCOUNT_RESTRICTIONS)[];
    const userRestrictions: UserRestriction[] = [];
    if (user?.restrictions && Array.isArray(user.restrictions)) {
      for (const key of keys) {
        const thisRestriction = ACCOUNT_RESTRICTIONS[key];
        userRestrictions.push({
          restriction: thisRestriction as keyof typeof ACCOUNT_RESTRICTIONS,
          isRestricted: user.restrictions.indexOf(thisRestriction) > -1
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
    if (
      currentUser?.id === user?.id
      && !currentUser?.sa
    ) {
      dispatch(uiActions.appDialogSet(
        <DialogAlert
          buttonText="Aw, shucks"
          message="You cannot edit your own privileges."
        />
      ));
      return;
    }

    if (
      user?.roles
      && Array.isArray(user.roles)
    ) {
      let nextRoles = [...new Set(user.roles)];
      if (user.roles.indexOf(clickedRole) > -1) {
        nextRoles = user?.roles.filter(role => role !== clickedRole);
      } else {
        nextRoles.push(clickedRole);
      }

      const updateData = {
        ...user,
        roles: nextRoles
      };

      dispatch(userAdminActions.userSet(updateData));
      setupRoles();
      void fetchUserRolesRestrictionsUpdate({
        id: user.id,
        roles: nextRoles
      });
    }
  };

  const renderHeader = (): JSX.Element => {
    return (
      <Grid
        container
        justifyContent="space-between"
        alignItems={mdBreak ? 'flex-start' : 'center'}
        padding="20px 10px"
        direction={smBreak ? 'column' : 'row'}
      >
        <Grid
          item
          justifyContent="flex-start"
          sx={{
            overflow: 'hidden',
            whiteSpace: 'break-spaces'
          }}
        >
          <Typography
            variant="h5"
            color="primary"
          >
            <IconButton
              color="primary"
              component="span"
              onClick={() => navigate(ROUTES.ADMIN.USER.LIST)}
            >
              <ChevronLeft />
            </IconButton>
            {title}
          </Typography>
        </Grid>
        <Grid item justifyContent="flex-end">
          {
            user?.optInBeta && (<Chip label="BETA" sx={{ backgroundColor: lightBlue[700], marginRight: '12px' }} />)
          }
          {
            user?.restrictions && user.restrictions.length > 0 && (<Chip label="RESTRICTED" color="error" />)
          }
        </Grid>
      </Grid>
    );
  };

  const renderDivider = (m?: string): JSX.Element => {
    return (<Divider sx={{ margin: m ? m : '10px 0', width: '100%' }} />);
  };

  const renderDefaultChip = (): JSX.Element => {
    return (
      <Chip label="Default" color="success" sx={{ height: '20px', marginRight: '12px' }} />
    );
  };

  const renderVerifiedChip = (): JSX.Element => {
    return (
      <Chip label="Verified" color="primary" sx={{ height: '20px', marginRight: '12px' }} />
    );
  };

  const renderColumnLeft = (): JSX.Element => {
    return (
      <Grid
        container
        width={mdBreak ? '100%' : '50%'}
        padding={mdBreak ? '10px' : '10px 24px'}
        direction="column"
      >
        <Grid container  margin="0 0 20px">
          <Grid item>
            <Typography>
              <span style={{ fontWeight: 700, marginRight: 12 }}>Name:</span>
              { user?.fullName }
            </Typography>
          </Grid>
        </Grid>
        <Grid container  margin="0 0 20px">
          <Typography style={{ fontWeight: 700 }}>Emails:</Typography>
          {/* {renderDivider('0 0 10')} */}
          <Grid container justifyContent="space-between">
            {
              user?.emails.map((email, index) => {
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
                        <Typography>
                          { email.email }
                        </Typography>
                      </Grid>
                      <Grid item>
                        { email.isVerified && renderVerifiedChip() }
                        { email.default && renderDefaultChip() }
                        { email.label }
                      </Grid>
                    </Grid>
                  </React.Fragment>
                );
              })
            }
          </Grid>
        </Grid>
        <Grid container  margin="0 0 20px">
          <Typography style={{ fontWeight: 700 }}>Phones:</Typography>
          {/* {renderDivider('0 0 10')} */}
          <Grid container justifyContent="space-between" direction="column">
            {
              user?.phones.map((phone, index) => {
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
              })
            }
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderColumnRight = (): JSX.Element => {
    return (
      <Grid
        container
        width={mdBreak ? '100%' : '50%'}
        padding={mdBreak ? '10px' : '10px 24px'}
        direction="column"
      >
        <Grid container margin="0 0 20px" direction="column">
          <Typography style={{ fontWeight: 700 }}>Roles:</Typography>
          {renderDivider('0 0 10')}
          <Grid container justifyContent="space-between">
            {
              roles.map((role, index) => {
                return (
                  <Grid container key={`role-${index}`}>
                    <Grid item>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox
                            checked={role.hasRole}
                            onClick={
                              () => void handleRoleClick(role.role)
                            }
                          />}
                          label={role.role}
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                );
              })
            }
          </Grid>
        </Grid>
        <Grid container direction="column">
          <Typography style={{ fontWeight: 700 }}>Restrictions:</Typography>
          {renderDivider('0 0 10')}
          <Grid container justifyContent="space-between">
            {
              restrictions.map((restriction, index) => {
                return (
                  <Grid container key={`restriction-${index}`}>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox
                          checked={restriction.isRestricted}
                          onClick={() => console.log('clicked', restriction.restriction)}
                        />}
                        label={restriction.restriction}
                      />
                    </FormGroup>
                  </Grid>
                );
              })
            }
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Fade in={true} timeout={FADE_TIMEOUT_DUR}>
      <Box>
        <Paper
          elevation={2}
        >
          {renderHeader()}
          <Divider />
          <Grid
            container
            justifyContent="flex-start"
            padding="20px"
            direction={mdBreak ? 'column' : 'row'}
          >
            {renderColumnLeft()}
            {renderColumnRight()}
          </Grid>
        </Paper>
      </Box>
    </Fade>
  );
};
