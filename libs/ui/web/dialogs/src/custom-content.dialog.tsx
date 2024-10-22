import React from 'react';
import {
  DialogContent,
  useMediaQuery,
  useTheme
} from '@mui/material';

import { useAppSelector } from '@dx/utils-web-hooks';
import { selectIsMobileWidth } from '@dx/ui-web-system';

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
    useAppSelector(state => state.ui.windowHeight) || 0;
  const isMobileWidth = useAppSelector(state => selectIsMobileWidth(state));
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
