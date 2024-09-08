import React,
{
  ReactElement
} from 'react';
import { BeatLoader } from 'react-spinners';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Button,
  Grid,
  Slider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AvatarEditor from 'react-avatar-editor';

import {
  store,
  useAppDispatch
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
import { useUploadAvatarMutation } from '@dx/media-web';
import { MediaDataType } from '@dx/media-shared';

type UserProfileWebAvatarPropTypes = {
  avatarDataCallback: (email: MediaDataType) => void;
};

export const UserProfileWebAvatarDialog: React.FC<UserProfileWebAvatarPropTypes> = (props): ReactElement => {
  const [allSucceeded, setAllSucceeded] = React.useState(false);
  const [showLottieError, setShowLottieError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [imageSource, setImageSource] = React.useState<File | string >('');
  const [scale, setScale] = React.useState(1.2);
  const isMobileWidth = selectIsMobileWidth(store.getState());
  const avatarEditorRef = React.useRef<null | AvatarEditor>(null);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const smBreak = useMediaQuery(theme.breakpoints.down('sm'));
  const [
    uplodAvatar,
    {
      data: uploadAvatarResponse,
      error: uploadAvatarError,
      isLoading: isUploadingdAvatar,
      isSuccess: uploadAvatarSuccess,
      isUninitialized: uploadAvatarUninitialized
    }
  ] = useUploadAvatarMutation();

  React.useEffect(() => {
    if (
      !isUploadingdAvatar
      && !uploadAvatarUninitialized
    ) {
      if (!uploadAvatarError) {
        setShowLottieError(false);
        setAllSucceeded(true);
      } else {
        if ('error' in uploadAvatarError) {
          setErrorMessage(uploadAvatarError['error']);
        }
        setShowLottieError(true);
      }
    }
  }, [isUploadingdAvatar]);

  React.useEffect(() => {
    if (
      uploadAvatarSuccess
      && props.avatarDataCallback
      && typeof props.avatarDataCallback === 'function'
    ) {
      props.avatarDataCallback(uploadAvatarResponse);
    }
  }, [uploadAvatarSuccess]);

  const handleClose = (): void => {
    dispatch(uiActions.appDialogSet(null));
  };

  const submitDisabled = (): boolean => {
    return !imageSource || isUploadingdAvatar;
  };

  const handleCreate = async (): Promise<void> => {
    if (
      !submitDisabled()
    ) {
      if (avatarEditorRef.current) {
        const canvas = avatarEditorRef.current.getImage();
        if (canvas) {
          canvas.toBlob((blob) => {
            if (blob) {
              try {
                void uplodAvatar(blob);
              } catch (err) {
                logger.error((err as Error).message, err);
              }

            }
          });
        }
      }
    }
  };

  const renderFormContent = (): JSX.Element => {
    return (
      <CustomDialogContent
        justifyContent={smBreak ? 'flex-start' : 'space-around' }
        maxWidth={smBreak ? undefined : '100%' }
      >
        <Grid
          container
          display={'flex'}
          flexDirection={'column'}
          flexWrap={'nowrap'}
          alignItems={'center'}
        >
          <Grid
            item
            xs={12}
            display={'flex'}
            justifyContent={'center'}
          >
            <AvatarEditor
              ref={
                (ref) => {
                  avatarEditorRef.current = ref;
                }
              }
              border={smBreak ? 30 : 50}
              borderRadius={200}
              width={smBreak ? 290 : 390}
              height={smBreak ? 290 : 390}
              scale={scale}
              image={imageSource}
            />
          </Grid>

          <Grid
            item
            xs={12}
            display={'flex'}
            justifyContent={'center'}
            width={smBreak ? '100%' : '400px'}
            mt={2}
          >
            <Slider
              color='secondary'
              disabled={!imageSource}
              value={scale}
              step={0.1}
              min={1}
              max={2}
              onChange={(event, value) => setScale(value as number)}
            />
          </Grid>

          <Grid
            item
            xs={12}
            display={'flex'}
            justifyContent={'center'}
            mt={2}
            mb={2}
            width={'100%'}
          >
            <Button
              variant='contained'
              component="label"
              fullWidth={smBreak}
            >
              Choose Image
              <input
                type='file'
                hidden
                id="profile_pic"
                name="profile_pic"
                accept=".jpg, .jpeg, .png"
                onChange={
                  (event) => {
                    const files = event.target.files;
                    if (files) {
                      setImageSource(URL.createObjectURL(files[0]))
                    }
                  }
                }
              />
            </Button>
          </Grid>
        </Grid>

      </CustomDialogContent>
    );
  };

  return (
    <DialogWrapper>
      <DialogTitle
        style={
          {
            textAlign: 'center'
          }
        }
      >
        { `Avatar` }
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
              disabled={isUploadingdAvatar}
            >
              { showLottieError ? 'Close' : 'Cancel' }
            </Button>
            {
              !showLottieError && (
                <Button
                  onClick={handleCreate}
                  variant="contained"
                  disabled={submitDisabled()}
                >
                  {
                    isUploadingdAvatar
                    ? (
                      <BeatLoader
                        color={themeColors.secondary}
                        size={16}
                        margin="2px"
                      />
                    )
                    :
                    'Update'
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
