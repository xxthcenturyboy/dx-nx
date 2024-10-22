import React from 'react';

import {
  useAppSelector
} from '@dx/utils-web-hooks';
import { MEDIA_BREAK } from '@dx/ui-web-system';
import { ResponsiveMenu } from './responsive-menu.component';
import { OverlayMenu } from './overlay-menu.component';

export const MenuNav: React.FC = () => {
  const [menuBreak, setMenuBreak] = React.useState(false);
  const windowWidth =
    useAppSelector(state => state.ui.windowWidth) || 0;

  React.useEffect(() => {
    setMenuBreak(windowWidth < MEDIA_BREAK.MENU);
  }, [windowWidth]);

  if (menuBreak) {
    return <OverlayMenu />;
  }

  return <ResponsiveMenu />;
};
