import React from 'react';
import {
  Button,
  MenuItem,
} from '@mui/material';

import { useAppDispatch } from '@dx/store-web';
import { authActions } from '@dx/auth-web';
import { logger } from '@dx/logger-web';
import { uiActions } from '@dx/ui-web';
import { ConfirmationDialog } from '@dx/ui-web';

type LogoutButtonType = {
  context: 'APP_MENU' | 'APP_BAR';
  onLocalClick?: () => any;
};

export const LogoutButton: React.FC<LogoutButtonType> = ({ context, onLocalClick }) => {
  const dispatch = useAppDispatch();

  const logout = async (): Promise<void> => {
    if (
      onLocalClick
      && typeof onLocalClick === 'function'
    ) {
      onLocalClick();
    }

    try {
      dispatch(uiActions.appDialogSet(
        <ConfirmationDialog
          okText="Log Out"
          cancelText="Cancel"
          // bodyMessage="Is it really time to go?"
          noAwait={true}
          onComplete={
            (isConfirmed: boolean) => {
              if (isConfirmed) {
                dispatch(authActions.tokenRemoved());
                setTimeout(() => dispatch(uiActions.appDialogSet(null)), 1000);
              }

              if (!isConfirmed) {
                dispatch(uiActions.appDialogSet(null));
              }
            }
          }
        />
      ));

    } catch (err) {
      logger.error(err);
    }
  };

  if (context === 'APP_BAR') {
    return (
      <MenuItem
        onClick={logout}
      >
        Logout
      </MenuItem>
    );
  }

  if (context === 'APP_MENU') {
    return (
      <Button
        onClick={logout}
      >
        Logout
      </Button>
    );
  }

  return (
    <Button
      onClick={logout}
    >
      Logout
    </Button>
  );
};
