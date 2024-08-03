import React, { ReactNode, useEffect, useState } from 'react';
import {
  Box,
  ListItemButton,
  ListItemText,
  useTheme
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { useLocation } from "react-router-dom";

import {
  RootState,
  useAppSelector
} from '@dx/store-web';
import { AppMenuType } from './app-menu.types';

type AppMenuGroupProps = {
  menu: AppMenuType;
  isFirst: boolean;
  children?: React.ReactNode
};

export const AppMenuGroup: React.FC<AppMenuGroupProps> = (props) => {
  const { isFirst, menu } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [backgroundColor, setBackgroundColor] = useState<string>('');
  const theme = useTheme();
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    const subItemRouteKeys = Array.from(menu.items, item => item.routeKey);
    for (const routeKey of subItemRouteKeys) {
      if (pathname.includes(routeKey)) {
        setOpen(true);
        break;
      }
    }
  }, []);

  useEffect(() => {
    setBackgroundColor(theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[200]);
  }, [theme]);

  return (
    <Box
      key={menu.id}
      sx={{
        bgcolor: open ? backgroundColor : null,
        pb: open ? 2 : 0,
        minHeight: isFirst ? 48 : 40,
      }}
    >
      <ListItemButton
        alignItems="flex-start"
        onClick={() => setOpen(!open)}
        sx={{
          px: 3,
          pl: -2,
          pt: 2.5,
          pb: open ? 0 : 2.5,
          '&:hover, &:focus': { '& svg': { opacity: open ? 1 : 0 } },
        }}
      >
        <ListItemText
          primary={menu.title}
          primaryTypographyProps={{
            fontSize: '0.85rem',
            fontWeight: 'medium',
            lineHeight: '20px',
            mb: '2px',
            color: 'primary',
            pl: -2
          }}
          secondary={menu.description}
          secondaryTypographyProps={{
            noWrap: true,
            fontSize: 11,
            lineHeight: '16px',
            color: open ? 'rgba(0,0,0,0)' : theme.palette.grey[500],
          }}
          sx={{ my: 0 }}
        />
        <KeyboardArrowDown
          sx={{
            mr: -1,
            opacity: 0,
            transform: open ? 'rotate(-180deg)' : 'rotate(0)',
            transition: '0.2s',
          }}
        />
      </ListItemButton>
      {
        open &&
        props.children
      }
    </Box>
  );
};
