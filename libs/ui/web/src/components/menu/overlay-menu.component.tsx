import React from 'react';
import { Drawer } from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '@dx/store-web';
import {
  DRAWER_WIDTH,
  MEDIA_BREAK,
  uiActions
} from '@dx/ui-web';
import { AppMenu } from './app-menu.component';

const DrawerContent = styled('div')<{ component?: React.ElementType }>({
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '53px',
  height: '100%',
});

export const OverlayMenu: React.FC = () => {
  const open = useAppSelector((state: RootState) => state.ui.menuOpen);
  const [mobileBreak, setMobileBreak] = React.useState(false);
  const windowWidth = useAppSelector((state: RootState) => state.ui.windowWidth) || 0;
  const dispatch = useAppDispatch();
  // const topPixel = mobileBreak ? 60 : 64;

  React.useEffect(() => {
    setMobileBreak(windowWidth <= MEDIA_BREAK.MOBILE);
  }, [windowWidth]);

  const toggleMenuState = (): void => {
    dispatch(uiActions.toggleMenuSet(false));
  };

  return (
    <Drawer
      sx={{
        width: `${DRAWER_WIDTH}px`,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          position: 'fixed',
          width: mobileBreak ? '100%' : `${DRAWER_WIDTH}px`,
          borderRadius: 0,
          borderTop: 'none',
          borderBottom: 'none',
          height: '100%'
          // top: `${topPixel}px`,
          // height: `calc(100% - ${topPixel}px)`
        },
      }}
      variant="temporary"
      anchor={mobileBreak ? 'bottom' : 'left'}
      open={open}
      onClose={toggleMenuState}
    >
      <DrawerContent>
        <AppMenu
          mobileBreak={mobileBreak}
        />
      </DrawerContent>
    </Drawer>
  );
};
