import React from 'react';
import { DialogContent, useMediaQuery, useTheme } from '@mui/material';

import { RootState, store, useAppSelector } from '@dx/store-web';
import { selectIsMobileWidth } from '../../store/ui-web.selector';

type CustomDialogContentType = {
  justifyContent?: string;
  maxWidth?: string;
  children?: React.ReactNode;
};

export const CustomDialogContent: React.FC<CustomDialogContentType> = (
  props
) => {
  const theme = useTheme();
  const smBreak = useMediaQuery(theme.breakpoints.down('sm'));
  const windowHeight =
    useAppSelector((state: RootState) => state.ui.windowHeight) || 0;
  const isMobileWidth = selectIsMobileWidth(store.getState());
  const height = isMobileWidth ? windowHeight - 140 : undefined;

  return (
    <DialogContent
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: props.justifyContent || 'space-around',
        alignItems: 'center',
        minHeight: '360px',
        minWidth: smBreak ? '' : '320px',
        maxWidth: props.maxWidth || '400px',
        overflow: 'visible',
        height: height,
      }}
    >
      {props.children}
    </DialogContent>
  );
};
