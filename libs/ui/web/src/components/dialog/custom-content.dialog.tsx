import React from 'react';
import {
  DialogContent,
  useMediaQuery,
  useTheme
} from '@mui/material';

type CustomDialogContentType = {
  children?: React.ReactNode;
};

export const CustomDialogContent: React.FC<CustomDialogContentType> = ({ children }) => {
  const theme = useTheme();
  const smBreak = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <DialogContent
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        minHeight: '360px',
        minWidth: smBreak ? '' : '320px',
        maxWidth: '400px',
        overflow: 'visible'
      }}
    >
      {children}
    </DialogContent>
  );

};
