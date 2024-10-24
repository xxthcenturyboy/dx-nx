import React from 'react';
import Typography from '@mui/material/Typography';
import {
  IconButton,
  Fade,
  Grid2
} from '@mui/material';
import GradingIcon from '@mui/icons-material/Grading';
import Collapse from '@mui/material/Collapse';
import { TransitionGroup } from 'react-transition-group';
import { toast } from 'react-toastify';
import { NIL as NIL_UUID } from 'uuid';

import {
  useAppDispatch,
  useAppSelector
} from '@dx/utils-web-hooks';
import {
  MEDIA_BREAK,
  themeColors
} from '@dx/ui-web-system';
import { NoDataLottie } from '@dx/ui-web-lottie';
import { selectHasSuperAdminRole } from '@dx/user-profile-web';
import {
  StyledNotificationActionArea,
  StyledNotificationsList,
  StyledNotificationMenu,
} from './notification-web-menu.ui';
import { NotificationComponent } from './notification-web.component';
import { notificationActions } from './notification-web.reducer';
import { selectNotificationCount } from './notification-web.selectors';
import { useMarkAllAsDismissedMutation } from './notification-web.api';

type NotificationMenuPropsType = {
  anchorElement: HTMLElement | null;
  clickCloseMenu: () => void;
};

export const NotificationMenu: React.FC<NotificationMenuPropsType> = (
  props
) => {
  const [mobileBreak, setMobileBreak] = React.useState(false);
  const windowWidth =
    useAppSelector(state => state.ui.windowWidth) || 0;
  const systemNotifications = useAppSelector(
    state => state.notification.system
  );
  const userNotifications = useAppSelector(
    state => state.notification.user
  );
  const notificationCount = useAppSelector(state =>
    selectNotificationCount(state)
  );
  const userId = useAppSelector(state => state.userProfile.id);
  const isSuperAdmin = useAppSelector(state =>
    selectHasSuperAdminRole(state)
  );
  const dispatch = useAppDispatch();
  const [
    requestDismissAll,
    {
      data: dismissAllResponse,
      error: dismissAllError,
      isLoading: isLoadingDismissAll,
      isSuccess: dismissAllSuccess,
      isUninitialized: dismissAllUninitialized,
    },
  ] = useMarkAllAsDismissedMutation();

  React.useEffect(() => {
    setMobileBreak(windowWidth < MEDIA_BREAK.MOBILE);
  }, [windowWidth]);

  React.useEffect(() => {
    if (!isLoadingDismissAll && !dismissAllUninitialized) {
      if (!dismissAllError) {
        if (userNotifications.length) {
          dispatch(notificationActions.setUserNotifications([]));
        }
        if (systemNotifications.length && isSuperAdmin) {
          dispatch(notificationActions.setSystemNotifications([]));
        }
      } else {
        'error' in dismissAllError && toast.error(dismissAllError['error']);
      }
    }
  }, [isLoadingDismissAll]);

  return (
    <StyledNotificationMenu
      anchorEl={props.anchorElement}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id="notification-menu"
      keepMounted
      mobilebreak={mobileBreak.toString()}
      open={Boolean(props.anchorElement)}
      onClose={props.clickCloseMenu}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <StyledNotificationActionArea>
        <Grid2
          container
          display="flex"
          direction="row"
          justifyContent="center"
          margin="12px"
          width="auto"
        >
          <Typography
            variant="body1"
            color={themeColors.primary}
            fontWeight={700}
          >
            Notifications
            {
              <Fade in={notificationCount > 0}>
                <span>{`: ${notificationCount || ''}`}</span>
              </Fade>
            }
          </Typography>
        </Grid2>
      </StyledNotificationActionArea>
      <Collapse in={notificationCount === 0}>
        <Grid2
          container
          minHeight="100px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          {props.anchorElement && <NoDataLottie />}
          <Typography
            variant="h6"
            textAlign="center"
            color={themeColors.primary}
            mb={3}
            pl={4}
            pr={4}
          >
            Notifications will appear here as you receive them.
          </Typography>
        </Grid2>
      </Collapse>
      <StyledNotificationsList>
        <TransitionGroup>
          {systemNotifications.map((notification) => {
            return (
              <Collapse key={notification.id}>
                <NotificationComponent notification={notification} />
              </Collapse>
            );
          })}
        </TransitionGroup>
        <TransitionGroup>
          {userNotifications.map((notification) => {
            return (
              <Collapse key={notification.id}>
                <NotificationComponent notification={notification} />
              </Collapse>
            );
          })}
        </TransitionGroup>
      </StyledNotificationsList>
      <Collapse in={notificationCount > 0}>
        <StyledNotificationActionArea>
          <Grid2
            container
            display="flex"
            direction="row"
            justifyContent="flex-end"
            margin="3px"
            width="auto"
          >
            <Grid2>
              <IconButton
                color="info"
                onClick={async () => {
                  if (systemNotifications.length && isSuperAdmin) {
                    requestDismissAll({ userId: NIL_UUID });
                  }
                  if (userNotifications.length) {
                    requestDismissAll({ userId });
                  }
                }}
              >
                <GradingIcon />
              </IconButton>
            </Grid2>
          </Grid2>
        </StyledNotificationActionArea>
      </Collapse>
    </StyledNotificationMenu>
  );
};
