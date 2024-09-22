import React from 'react';
import Typography from '@mui/material/Typography';
import { IconButton, Grid2 } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import InfoIcon from '@mui/icons-material/Info';
import ReportIcon from '@mui/icons-material/Report';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import WarningIcon from '@mui/icons-material/Warning';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import { toast } from 'react-toastify';
import { NIL as NIL_UUID } from 'uuid';

import { RootState, useAppDispatch, useAppSelector } from '@dx/store-web';
import { themeColors } from '@dx/ui-web-system';
import {
  NotificationType,
  NOTIFICATION_LEVELS,
} from '@dx/notifications-shared';
import { selectHasSuperAdminRole } from '@dx/user-profile-web';
import { StyledNotification } from './notification-web-menu.ui';
import { notificationActions } from './notification-web.reducer';
import { useMarkAsDismissedMutation } from './notification-web.api';

type NotificationMenuPropsType = {
  notification: NotificationType;
};

export const NotificationComponent: React.FC<NotificationMenuPropsType> = (
  props
) => {
  const { notification } = props;
  const MAX_LEN = 100;
  const isSuperAdmin = useAppSelector((state: RootState) =>
    selectHasSuperAdminRole(state)
  );
  const dispatch = useAppDispatch();
  const [
    requestDismiss,
    {
      data: dismissResponse,
      error: dismissError,
      isLoading: isLoadingDismiss,
      isSuccess: dismissSuccess,
      isUninitialized: dismissUninitialized,
    },
  ] = useMarkAsDismissedMutation();

  React.useEffect(() => {
    if (!isLoadingDismiss && !dismissUninitialized) {
      if (!dismissError) {
        dispatch(notificationActions.removeNotification(notification.id));
      } else {
        'error' in dismissError && toast.error(dismissError['error']);
      }
    }
  }, [isLoadingDismiss]);

  const renderIcon = (): JSX.Element => {
    return (
      <>
        {notification.level === NOTIFICATION_LEVELS.DANGER && (
          <ReportIcon fontSize="large" color="error" />
        )}
        {notification.level === NOTIFICATION_LEVELS.INFO && (
          <InfoIcon fontSize="large" color="info" />
        )}
        {notification.level === NOTIFICATION_LEVELS.PRIMARY && (
          <WavingHandIcon fontSize="large" color="primary" />
        )}
        {notification.level === NOTIFICATION_LEVELS.SUCCESS && (
          <ThumbUpIcon fontSize="large" color="success" />
        )}
        {notification.level === NOTIFICATION_LEVELS.WARNING && (
          <WarningIcon fontSize="large" color="warning" />
        )}
      </>
    );
  };

  const getTitleColor = (): string => {
    switch (notification.level) {
      case NOTIFICATION_LEVELS.DANGER:
        return themeColors.error;
      case NOTIFICATION_LEVELS.INFO:
        return themeColors.info;
      case NOTIFICATION_LEVELS.PRIMARY:
        return themeColors.primary;
      case NOTIFICATION_LEVELS.SUCCESS:
        return themeColors.success;
      case NOTIFICATION_LEVELS.WARNING:
        return themeColors.warning;
      default:
        return themeColors.primary;
    }
  };

  const getTrimmedMessage = (): string => {
    if (notification.message.length < MAX_LEN) {
      return notification.message;
    }

    return `${notification.message.substring(0, MAX_LEN)}...`;
  };

  return (
    <StyledNotification isunread={notification.viewed ? 'false' : 'true'}>
      <Grid2 container direction="row" height={'100%'}>
        {/** Icon */}
        <Grid2 width="15%" alignItems="center" display="flex">
          {renderIcon()}
        </Grid2>

        {/** Title and Message */}
        <Grid2 width="75%">
          <Grid2 container direction="column">
            <Grid2 color={getTitleColor()}>
              <Typography variant="h6">{notification.title}</Typography>
            </Grid2>
            <Grid2>
              <Typography variant="body2">{getTrimmedMessage()}</Typography>
            </Grid2>
          </Grid2>
        </Grid2>

        {/** Dismiss Button */}
        {((notification.userId === NIL_UUID && isSuperAdmin) ||
          notification.userId !== NIL_UUID) && (
          <Grid2
            width="10%"
            alignItems="center"
            display="flex"
            justifyContent="flex-end"
          >
            <IconButton
              onClick={() =>
                requestDismiss({
                  id: notification.id,
                  userId: notification.userId,
                })
              }
            >
              <ClearIcon />
            </IconButton>
          </Grid2>
        )}
      </Grid2>
    </StyledNotification>
  );
};
