import React from 'react';
import {
  Drawer,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  RootState,
  useAppSelector
} from '@dx/store-web';
import { DRAWER_WIDTH } from '@dx/ui-web';
import { AppMenu } from './app-menu.component';

const DrawerContent = styled('div')<{ component?: React.ElementType }>({
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '53px',
  height: '100%',
});

export const ResponsiveMenu: React.FC = () => {
  const open = useAppSelector((state: RootState) => state.ui.menuOpen);

  return (
    <Drawer
      sx={{
        width: `${DRAWER_WIDTH}px`,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          position: 'fixed',
          width: `${DRAWER_WIDTH}px`,
          borderRadius: 0,
          borderTop: 'none',
          borderBottom: 'none',
          top: '64px',
          height: `calc(100% - 64px)`
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
      elevation={0}
      PaperProps={{
        variant: 'outlined'
      }}
    >
      <DrawerContent>
        <AppMenu />
      </DrawerContent>
    </Drawer>
  );
};
