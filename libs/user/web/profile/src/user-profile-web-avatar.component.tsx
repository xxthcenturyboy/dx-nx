import React from 'react';
import { Avatar, Badge, IconButton, Grid2 } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PhotoCamera } from '@mui/icons-material';

import { RootState, useAppSelector } from '@dx/store-web';
import { APP_COLOR_PALETTE } from '@dx/ui-web-system';
import { setDocumentTitle } from '@dx/utils-misc-web';
import { selectProfileFormatted } from './user-profile-web.selectors';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: APP_COLOR_PALETTE.PRIMARY[700],
    borderRadius: '50%',
    color: APP_COLOR_PALETTE.PRIMARY[200],
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    cursor: 'pointer',
    height: '25%',
    width: '25%',
    padding: '15%',
    // '&::after': {
    //   position: 'absolute',
    //   top: 0,
    //   left: 0,
    //   width: '100%',
    //   height: '100%',
    //   borderRadius: '50%',
    //   animation: 'ripple 1.2s infinite ease-in-out',
    //   border: '1px solid currentColor',
    //   content: '""',
    // },
  },
  // '@keyframes ripple': {
  //   '0%': {
  //     transform: 'scale(.8)',
  //     opacity: 1,
  //   },
  //   '100%': {
  //     transform: 'scale(2.4)',
  //     opacity: 0,
  //   },
  // },
}));

type UserProfileAvatarPropTypes = {
  fontSize?: string;
  justifyContent?: string;
  size?: { height?: number; width?: number };
  handleChangeImage?: () => void;
};

export const UserProfileAvatar: React.FC<UserProfileAvatarPropTypes> = (
  props
) => {
  const { fontSize, handleChangeImage, justifyContent, size } = props;
  const profile = useAppSelector((state: RootState) =>
    selectProfileFormatted(state)
  );

  React.useEffect(() => {
    setDocumentTitle('Profile');
  }, []);

  return (
    <Grid2
      container
      display={'flex'}
      direction={'row'}
      justifyContent={justifyContent || 'flex-start'}
    >
      {!!handleChangeImage && (
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="standard"
          onClick={handleChangeImage}
          badgeContent={
            <IconButton
              component="span"
              sx={{
                color: APP_COLOR_PALETTE.SECONDARY[600],
              }}
            >
              <PhotoCamera style={{ padding: '5px' }} />
            </IconButton>
          }
        >
          <Avatar
            alt={profile.fullName}
            src={profile.profileImageUrl}
            sx={{
              color: APP_COLOR_PALETTE.PRIMARY[700],
              bgcolor: APP_COLOR_PALETTE.SECONDARY[600],
              fontSize: fontSize || '1rem',
              height: size?.height || 64,
              width: size?.width || 64,
            }}
            variant="circular"
          />
        </StyledBadge>
      )}
      {!handleChangeImage && (
        <Avatar
          alt={profile.fullName}
          src={profile.profileImageUrl}
          sx={{
            color: APP_COLOR_PALETTE.PRIMARY[700],
            bgcolor: APP_COLOR_PALETTE.SECONDARY[600],
            fontSize: fontSize || '1rem',
            height: size?.height || 64,
            width: size?.width || 64,
          }}
          variant="circular"
        />
      )}
    </Grid2>
  );
};
