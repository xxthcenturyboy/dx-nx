import React, { useEffect, useState } from 'react';
import { Divider, IconButton, ListSubheader } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import { RootState, useAppDispatch, useAppSelector } from '@dx/store-web';
import { LogoutButton } from '@dx/auth-web';
import { AppMenuType, AppMenuItemType } from './app-menu.types';
import { AppMenuGroup } from './app-menu-group.component';
import { AppMenuItem } from './app-menu-item.component';
import {
  CloseMenuItem,
  LogoutContainer,
  LogoutItem,
  ListNav,
} from './app-menu.ui';
import { uiActions } from '../../store/ui-web.reducer';

type AppMenuItemsProps = {
  mobileBreak?: boolean;
};

export const AppMenu: React.FC<AppMenuItemsProps> = (props) => {
  const { mobileBreak } = props;
  const [shouldRenderMenus, setShouldRenderMenus] = useState(false);
  const menus = useAppSelector((state: RootState) => state.ui.menus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (menus && Array.isArray(menus)) {
      setShouldRenderMenus(true);
      return;
    }
  }, [menus]);

  const menuItemDivider = (key: string): JSX.Element => {
    const id = `divider-${key}`;
    return <Divider key={id} id={id} style={{ margin: 0 }} />;
  };

  const renderItems = (
    items: AppMenuItemType[],
    index: number,
    isFirst: boolean,
    isSubItem?: boolean
  ): JSX.Element => {
    return (
      <React.Fragment key={`inner-frag-${index}`}>
        {items.map((item: AppMenuItemType, idx: number) => {
          if (item.type === 'ROUTE') {
            return (
              <React.Fragment key={`inner-inner-frag-${idx}`}>
                <AppMenuItem
                  menuItem={item}
                  isFirst={isFirst}
                  isSubItem={isSubItem || false}
                />
                {!isSubItem && menuItemDivider(item.id)}
              </React.Fragment>
            );
          }
          if (item.type === 'SUB_HEADING') {
            return (
              <ListSubheader
                key={item.id}
                component="div"
                color="primary"
                sx={{
                  fontSize: '0.75rem',
                  bgcolor: 'transparent',
                }}
              >
                {item.title}
              </ListSubheader>
            );
          }
        })}
      </React.Fragment>
    );
  };

  return (
    <>
      <ListNav>
        {mobileBreak && (
          <CloseMenuItem>
            <IconButton
              onClick={() => dispatch(uiActions.toggleMenuSet(false))}
              style={{
                padding: 0,
              }}
            >
              <ClearIcon
                style={{
                  fontSize: '26px',
                }}
              />
            </IconButton>
          </CloseMenuItem>
        )}
        {shouldRenderMenus &&
          (menus as AppMenuType[]).map((menu: AppMenuType, index: number) => {
            const isFirst = index === 0;
            if (menu.collapsible) {
              return (
                <React.Fragment key={`menu-outer-${index}`}>
                  <AppMenuGroup menu={menu} isFirst={isFirst}>
                    {renderItems(menu.items, index, isFirst, true)}
                  </AppMenuGroup>
                  {menuItemDivider(menu.id)}
                </React.Fragment>
              );
            }

            return renderItems(menu.items, index, isFirst);
          })}
      </ListNav>
      <LogoutContainer mobilebreak={mobileBreak?.toString() || 'false'}>
        <Divider key="logout-divider" />
        <LogoutItem key="logout-item">
          <LogoutButton context="APP_MENU" />
        </LogoutItem>
      </LogoutContainer>
    </>
  );
};
