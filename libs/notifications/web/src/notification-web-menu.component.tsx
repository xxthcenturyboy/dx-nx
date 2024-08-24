import React from 'react';
import Typography from '@mui/material/Typography';
import {
  IconButton,
  Fade,
  Grid
} from '@mui/material';
import GradingIcon from '@mui/icons-material/Grading';
import Collapse from '@mui/material/Collapse';
import { TransitionGroup } from 'react-transition-group';
import { toast } from 'react-toastify';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import {
  MEDIA_BREAK,
  themeColors
} from '@dx/ui-web';
import {
  StyledNotificationActionArea,
  StyledNotificationsList,
  StyledNotificationMenu
} from './notification-web-menu.ui';
import { NotificationComponent } from './notification-web.component';
import { notificationActions } from './notification-web.reducer';
import { useMarkAllAsDismissedMutation } from './notification-web.api';

type NotificationMenuPropsType = {
  anchorElement: HTMLElement | null;
  clickCloseMenu: () => void;
};

export const NotificationMenu: React.FC<NotificationMenuPropsType> = (props) => {
  const [mobileBreak, setMobileBreak] = React.useState(false);
  const windowWidth = useAppSelector((state: RootState) => state.ui.windowWidth) || 0;
  const notifications = useAppSelector((state: RootState) => state.notification.notifications);
  const userId = useAppSelector((state: RootState) => state.userProfile.id);
  const dispatch = useAppDispatch();
  const [
    requestDismissAll,
    {
      data: dismissAllResponse,
      error: dismissAllError,
      isLoading: isLoadingDismissAll,
      isSuccess: dismissAllSuccess,
      isUninitialized: dismissAllUninitialized
    }
  ] = useMarkAllAsDismissedMutation();

  React.useEffect(() => {
    setMobileBreak(windowWidth < MEDIA_BREAK.MOBILE);
  }, [windowWidth]);

  React.useEffect(() => {
    if (
      !isLoadingDismissAll
      && !dismissAllUninitialized
    ) {
      if (!dismissAllError) {
        dispatch(notificationActions.setNotifications([]));
      } else {
        'error' in dismissAllError && toast.error(dismissAllError['error']);
      }
    }
  }, [isLoadingDismissAll]);

  return (
    <StyledNotificationMenu
      anchorEl={props.anchorElement}
      anchorOrigin={
        {
          vertical: 'top',
          horizontal: 'right',
        }
      }
      id="notification-menu"
      keepMounted
      mobilebreak={mobileBreak.toString()}
      open={Boolean(props.anchorElement)}
      onClose={props.clickCloseMenu}
      transformOrigin={
        {
          vertical: 'top',
          horizontal: 'right',
        }
      }
    >
      <StyledNotificationActionArea>
        <Grid
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
              <Fade
                in={notifications.length > 0}
              >
                <span>{ `: ${notifications.length ? notifications.length : ''}` }</span>
              </Fade>

            }
          </Typography>
        </Grid>
      </StyledNotificationActionArea>
      <Collapse
        in={notifications.length === 0}
      >
        <Grid
          item
          minHeight="100px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            variant="h4"
            textAlign="center"
            color={themeColors.primary}
          >
            You're all caught up!
          </Typography>
        </Grid>
      </Collapse>
      <StyledNotificationsList>
        <TransitionGroup>
          {
            notifications.map((notification) => {
              return (
                <Collapse
                  key={notification.title}
                >
                  <NotificationComponent
                    notification={notification}
                  />
                </Collapse>
              );
            })
          }
        </TransitionGroup>
      </StyledNotificationsList>
      <Collapse
        in={notifications.length > 0}
      >
        <StyledNotificationActionArea>
          <Grid
            container
            display="flex"
            direction="row"
            justifyContent="flex-end"
            margin="3px"
            width="auto"
          >
            <Grid item>
              <IconButton
                color="info"
                onClick={
                  async () => {
                    requestDismissAll({ userId });
                  }
                }
              >
                <GradingIcon />
              </IconButton>
            </Grid>
          </Grid>
        </StyledNotificationActionArea>
      </Collapse>
    </StyledNotificationMenu>
  );
};