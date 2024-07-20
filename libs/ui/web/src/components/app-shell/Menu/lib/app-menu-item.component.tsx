import React, { useState } from 'react';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import {
  RootState,
  useAppSelector,
  useAppDispatch
} from '@dx/store-web';
import { AppMenuItemType } from './app-menu.types';
import { routeState } from 'client/routes';
import {
  getIcon,
  IconNames,
  MEDIA_BREAK,
  uiActions
} from '@dx/ui-web';

type AppMenuItemItemProps = {
  menuItem: AppMenuItemType;
  isFirst: boolean;
  isSubItem: boolean;
};

export const AppMenuItem: React.FC<AppMenuItemItemProps> = (props) => {
  const { isFirst, isSubItem, menuItem } = props;
  const [route, setRoute] = useState<string>(routeState[menuItem.routeKey]);
  const [menuBreak, setMenuBreak] = useState<boolean>(false);
  const location = useAppSelector((state: RootState) => state.ui.location);
  const windowWidth = useAppSelector((state: RootState) => state.ui.windowWidth) || 0;
  const dispatch = useAppDispatch();
  const { pathname } = location;
  const Icon = menuItem.icon ? getIcon(menuItem.icon as IconNames) : null;

  React.useEffect(() => {
    setMenuBreak(windowWidth < MEDIA_BREAK.MENU);
  }, [windowWidth]);

  const isSelected = (): boolean => {
    return pathname.includes(route);
  };

  const goToRoute = (): void => {
    if (route && !isSelected()) {
      menuBreak && dispatch(uiActions.toggleMenuSet(false));
      dispatch(push(route));
    }
  };

  const renderIcon = (iconName: IconNames, color?: string) => {
    const Icon = getIcon(iconName, color);
    return Icon;
  };

  return (
    <ListItemButton
      key={menuItem.id}
      sx={{
        py: 0,
        minHeight: isFirst ? 48 : 40,
        px: 4
      }}
      onClick={goToRoute}
      selected={isSelected()}
    >
      {
        !!menuItem.icon && (
          <ListItemIcon sx={{ color: 'inherit' }}>
            { renderIcon(menuItem.icon as IconNames) }
          </ListItemIcon>
        )
      }
      <ListItemText
        primary={menuItem.title}
        primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
      />
    </ListItemButton>
  );
};
