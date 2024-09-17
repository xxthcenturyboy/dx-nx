import React,
{
  ReactElement
} from 'react';
import { BeatLoader } from 'react-spinners';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent
} from '@mui/material';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import { logger } from '@dx/logger-web';
import {
  CustomDialogContent,
  DialogError,
  DialogWrapper,
  SuccessLottie,
  selectIsMobileWidth,
  themeColors,
  uiActions
} from '@dx/ui-web';
import { UserType } from '@dx/user-shared';
import {
  NotificationCreationParamTypes,
  NOTIFICATION_LEVELS
} from '@dx/notifications-shared';
import {
  useSendNotificationToAllMutation,
  useSendNotificationToUserMutation
} from './notification-web.api';
import { SendNotificationForm } from './notification-web-dialog.ui';

type NotificationSendPropsType = {
  user?: UserType;
};

export const NotificationSendDialog: React.FC<NotificationSendPropsType> = (props): ReactElement => {
  const [allSucceeded, setAllSucceeded] = React.useState(false);
  const [showLottieError, setShowLottieError] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [level, setLevel] = React.useState(NOTIFICATION_LEVELS.INFO);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [sendToMobile, setSendToMobile] = React.useState(!!props.user?.phones.find(phone => phone.default && phone.isVerified));
  const isMobileWidth = useAppSelector((state: RootState) => selectIsMobileWidth(state));
  const dispatch = useAppDispatch();
  const [
    requestSendNotificationToAll,
    {
      data: sendToAllResponse,
      error: sendToAllError,
      isLoading: isLoadingSendToAll,
      isSuccess: sendToAllSuccess,
      isUninitialized: sendToAllUninitialized
    }
  ] = useSendNotificationToAllMutation();
  const [
    requestSendNotificationToUser,
    {
      data: sendToUserResponse,
      error: sendToUserError,
      isLoading: isLoadingSendToUser,
      isSuccess: sendToUserSuccess,
      isUninitialized: sendToUserUninitialized
    }
  ] = useSendNotificationToUserMutation();

  React.useEffect(() => {
  }, []);

  React.useEffect(() => {
    if (
      !isLoadingSendToUser
      && !sendToUserUninitialized
    ) {
      if (!sendToUserError) {
        setShowLottieError(false);
        setAllSucceeded(true);
      } else {
        if ('error' in sendToUserError) {
          setErrorMessage(sendToUserError['error']);
        }
        setShowLottieError(true);
      }
    }
  }, [isLoadingSendToUser]);

  React.useEffect(() => {
    if (
      !isLoadingSendToAll
      && !sendToAllUninitialized
    ) {
      if (!sendToAllError) {
        setShowLottieError(false);
        setAllSucceeded(true);
      } else {
        if ('error' in sendToAllError) {
          setErrorMessage(sendToAllError['error']);
        }
        setShowLottieError(true);
      }
    }
  }, [isLoadingSendToAll]);

  const handleClose = (): void => {
    dispatch(uiActions.appDialogSet(null));
  };

  const submitDisabled = (): boolean => {
    if (
      !(message)
      || isLoadingSendToAll
      || isLoadingSendToUser
    ) {
      return true;
    }

    return false;
  };

  const handleSend = async (): Promise<void> => {
    if (
      !submitDisabled()
      && props.user?.id
    ) {
      try {
        const payload: NotificationCreationParamTypes = {
          level,
          title,
          message,
          suppressPush: !sendToMobile,
          userId: props.user.id
        };

        await requestSendNotificationToUser(payload);
      } catch (err) {
        logger.error((err as Error).message, err);
      }
    }
    if (
      !submitDisabled()
      && !props.user?.id
    ) {
      try {
        const payload: Partial<NotificationCreationParamTypes> = {
          level,
          title,
          message,
          suppressPush: !sendToMobile,
        };

        await requestSendNotificationToAll(payload);
      } catch (err) {
        logger.error((err as Error).message, err);
      }
    }
  };

  const handleSetTitle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value);
  };

  const handleSetMessage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };

  const handleChangeLevel = (event: SelectChangeEvent<string>): void => {
    setLevel(event.target.value);
  };

  const renderFormContent = (): JSX.Element => {
    return (
      <CustomDialogContent
        justifyContent={isMobileWidth ? 'flex-start' : 'space-around'}
      >
        <SendNotificationForm
          name="form-send-notification"
          onSubmit={handleSend}
        >
          {/** Title */}
          <FormControl
            disabled={isLoadingSendToAll || isLoadingSendToUser}
            margin="normal"
            sx={
              {
                minWidth: 300,
              }
            }
          >
            <InputLabel htmlFor="input-title">Title</InputLabel>
            <OutlinedInput
              id="input-title"
              name="input-title"
              onChange={handleSetTitle}
              type="text"
              autoCapitalize="on"
              autoCorrect="on"
              value={title || ''}
              placeholder={'Title'}
              fullWidth
              inputProps={{ maxLength: 30 }}
              label={'Title'}
            />
            <span
              style={{
                height: '2px',
                margin: '6px 6px 0',
                fontSize: '0.75em'
              }}
            >
              {
                title.length
                  ? `${30 - title.length} characters remaining.`
                  : ''
              }
            </span>
          </FormControl>

          {/** Message */}
          <FormControl
            disabled={isLoadingSendToAll || isLoadingSendToUser}
            margin="normal"
            sx={{
                minWidth: 300,
            }}
          >
            <InputLabel
              htmlFor="input-title"
              required
            >
              Message
            </InputLabel>
            <OutlinedInput
              id="input-message"
              name="input-message"
              onChange={handleSetMessage}
              type="text"
              autoCapitalize="on"
              autoCorrect="on"
              value={message || ''}
              placeholder={'Message'}
              fullWidth
              multiline
              rows={4}

              // maxRows={4}
              inputProps={{ maxLength: 255 }}
              label={'Message'}
            />
            <span
              style={{
                margin: '6px',
                fontSize: '0.75em'
              }}
            >
              { `${255 - message.length} characters remaining.` }
            </span>
          </FormControl>

          {/** Level */}
          <FormControl
            disabled={isLoadingSendToAll || isLoadingSendToUser}
            margin="normal"
            variant="outlined"
          >
            <InputLabel htmlFor="level-select">Type</InputLabel>
            <Select
              id="level-select"
              name="level-select"
              value={level || ''}
              onChange={handleChangeLevel}
              notched
              label="Type"
            >
              {
                Object.values(NOTIFICATION_LEVELS).map((labelValue) => {
                  return (
                    <MenuItem
                      key={labelValue}
                      value={labelValue}
                    >
                      { labelValue }
                    </MenuItem>
                  );
                })
              }
            </Select>
          </FormControl>

          {/** Send Push Notification */}
          <FormControlLabel
            label="Send Push Notification To Phone"
            control={
              <Checkbox
                size='large'
                checked={sendToMobile}
                onChange={() => setSendToMobile(!sendToMobile)}
              />
            }
          />
        </SendNotificationForm>
      </CustomDialogContent>
    );
  };

  return (
    <DialogWrapper
      maxWidth={400}
    >
      <DialogTitle
        style={
          {
            textAlign: 'center'
          }
        }
      >
        {
          props.user
            ? `Send to: ${props.user.username}`
            : 'Send to all users'
        }
      </DialogTitle>
      {
        !allSucceeded
        && !showLottieError
        && renderFormContent()
      }
      {
        showLottieError && (
          <CustomDialogContent>
            <DialogError
              message={errorMessage}
            />
          </CustomDialogContent>
        )
      }
      {
        allSucceeded && (
          <CustomDialogContent>
            <SuccessLottie
              complete={
                () => setTimeout(() => handleClose(), 500)
              }
            />
          </CustomDialogContent>
        )
      }
      {
        !allSucceeded && (
          <DialogActions
            style={
              {
                justifyContent: isMobileWidth ? 'center' : 'flex-end'
              }
            }
          >
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isLoadingSendToAll || isLoadingSendToUser}
            >
              { showLottieError ? 'Close' : 'Cancel' }
            </Button>
            {
              !showLottieError && (
                <Button
                  onClick={handleSend}
                  variant="contained"
                  disabled={submitDisabled()}
                >
                  {
                    (
                      isLoadingSendToAll
                      || isLoadingSendToUser
                    ) ? (
                      <BeatLoader
                        color={themeColors.secondary}
                        size={16}
                        margin="2px"
                      />
                    )
                    :
                    'Send'
                  }
                </Button>
              )
            }
          </DialogActions>
        )
      }
    </DialogWrapper>
  );
};
