import React, { useEffect, useState } from 'react';
import {
  Divider,
  List,
  ListItem,
  ListSubheader,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import { drawerWidth } from 'client/core/UI/muiOverrides/muiTheme';
import { LogoutContext } from 'client/App/enums';
import { LogoutButton } from 'client/App/components/LogoutButton';
import { AppMenuType } from 'client/App/types';
import { LottieAlert, LottieAwaiter } from 'client/core/UI/lottie';
import { AppMenuGroup } from './app-menu-group.component';
import { AppMenuItem } from './app-menu-item.component';
import { AppMenuItemType } from 'shared/types';
import { MenuItemComponentType } from 'shared/enums';

const LoadingDiv = styled('div')<{ component?: React.ElementType }>({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  overflow: 'hidden'
});

const LoadingErrorDiv = styled('div')<{ component?: React.ElementType }>({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  overflow: 'hidden',
  margin: '24px'
});

const ListNav = styled(List)<{ component?: React.ElementType }>({
  flexGrow: 1,
  margin: 0,
  paddingTop: 0,
  height: '100%',
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

const LogoutContainer = styled(List)<{ component?: React.ElementType }>({
  marginTop: 'auto',
  paddingBottom: '0',
  position: 'fixed',
  bottom: 0
});

const LogoutItem = styled(ListItem)<{ component?: React.ElementType }>({
  display: 'flex',
  justifyContent: 'center'
});

type AppMenuItemsProps = {
  mobileBreak?: boolean;
};

export const AppMenu: React.FC<AppMenuItemsProps> = (props) => {
  const { mobileBreak } = props;
  const [shouldRenderMenus, setShouldRenderMenus] = useState<boolean>(false);
  const menus = useAppSelector((state: RootState) => state.app.menus);
  const loadingError = useAppSelector((state: RootState) => state.app.xhrMenuError);
  const isLoading = useAppSelector((state: RootState) => state.app.xhrMenus);

  useEffect(() => {
    if (menus && Array.isArray(menus)) {
      setShouldRenderMenus(true);
      return;
    }

    if (isLoading) {
      setShouldRenderMenus(false);
    }
  }, [isLoading, loadingError]);

  const menuItemDivider = (key: string): JSX.Element => {
    const id = `divider-${key}`;
    return (<Divider key={id} id={id} style={{ margin: 0 }} />);
  };

  const renderItems = (items: AppMenuItemType[], index: number, isFirst: boolean, isSubItem?: boolean): JSX.Element => {
    return (
      <React.Fragment key={`inner-frag-${index}`}>
        {
          items.map((item: AppMenuItemType, idx: number) => {
            if (item.type === MenuItemComponentType.ROUTE) {
              return (
                <React.Fragment key={`inner-inner-frag-${idx}`}>
                  <AppMenuItem menuItem={item} isFirst={isFirst} isSubItem={isSubItem || false} />
                  {
                    !isSubItem && (
                      menuItemDivider(item.id)
                    )
                  }
                </React.Fragment>
              );
            }
            if (item.type === MenuItemComponentType.SUBITEM) {
              return (
                <ListSubheader
                  key={item.id}
                  component="div"
                  color="primary"
                  sx={{
                    fontSize: '0.75rem',
                    bgcolor: 'transparent'
                  }}
                >
                  {item.title}
                </ListSubheader>
              );
            }
          })
        }
      </React.Fragment>
    );
  };

  const logoutContainerStyle: React.CSSProperties = {
    width: mobileBreak ? '90%' : `${drawerWidth}px`,
  };

  return (
    <>
      <ListNav>
        {
          shouldRenderMenus && !isLoading &&
          menus.map((menu: AppMenuType, index: number) => {
            const isFirst = index === 0;
            if (menu.collapsible) {
              return (
                <React.Fragment key={`outer-frag-${index}`}>
                  <AppMenuGroup menu={menu} isFirst={isFirst}>
                    {
                      renderItems(menu.items, index, isFirst, true)
                    }
                  </AppMenuGroup>
                  {
                    menuItemDivider(menu.id)
                  }
                </React.Fragment>
              );
            }

            return renderItems(menu.items, index, isFirst);
          })
        }
        {
          isLoading && (
            <LoadingDiv key="loading-animation">
              <LottieAwaiter />
            </LoadingDiv>
          )
        }
        {
          !isLoading && !!loadingError && (
            <LoadingErrorDiv key="loading-error">
              <LottieAlert />
              <Divider style={{ margin: '30px 0' }} />
              <Typography>
                Something went wrong!
              </Typography>
              <Typography>
                The menus could not be loaded. Please contact support.
              </Typography>
            </LoadingErrorDiv>
          )
        }
      </ListNav>
      <LogoutContainer style={logoutContainerStyle}>
        <Divider key="logout-divider" />
        <LogoutItem key="logout-item">
          <LogoutButton context={LogoutContext.APP_MENU} />
        </LogoutItem>
      </LogoutContainer>
    </>
  );
};
