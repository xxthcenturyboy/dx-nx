import React,
{
  useState
} from 'react';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import Badge from '@mui/material/Badge';
import {
  useLocation,
  useNavigate
} from 'react-router-dom';

import {
  RootState,
  useAppSelector,
  useAppDispatch
} from '@dx/store-web';
import {
  MEDIA_BREAK,
  uiActions
} from '@dx/ui-web-system';
import {
  getIcon,
  IconNames
} from '@dx/ui-web-global-components'
import {
  AppMenuItemType
} from './app-menu.types';

type AppMenuItemItemProps = {
  menuItem: AppMenuItemType;
  isFirst: boolean;
  isSubItem: boolean;
};

export const AppMenuItem: React.FC<AppMenuItemItemProps> = (props) => {
  const { isFirst, isSubItem, menuItem } = props;
  const windowWidth =
    useAppSelector((state: RootState) => state.ui.windowWidth) || 0;
  const location = useLocation();
  const { pathname } = location;
  const [route, _] = useState(menuItem.routeKey);
  const [menuBreak, setMenuBreak] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    setMenuBreak(windowWidth < MEDIA_BREAK.MENU);
  }, [windowWidth]);

  const isSelected = (): boolean => {
    return pathname.includes(route);
  };

  const goToRoute = (): void => {
    if (route && !isSelected()) {
      menuBreak && dispatch(uiActions.toggleMenuSet(false));
      navigate(route);
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
        px: 4,
      }}
      onClick={goToRoute}
      selected={isSelected()}
    >
      {!!menuItem.icon && (
        <ListItemIcon sx={{ color: 'inherit' }}>
          {renderIcon(menuItem.icon as IconNames)}
        </ListItemIcon>
      )}
      <ListItemText
        primary={menuItem.title}
        primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
      />
      {menuItem.beta && <Badge badgeContent="BETA" color="info" />}
    </ListItemButton>
  );
};
