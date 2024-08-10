import React from 'react';
import {
  DialogContent,
  useMediaQuery,
  useTheme
} from '@mui/material';

type CustomDialogContentType = {
  justifyContent?: string;
  children?: React.ReactNode;
};

export const CustomDialogContent: React.FC<CustomDialogContentType> = (props) => {
  const theme = useTheme();
  const smBreak = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <DialogContent
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: props.justifyContent || 'space-around',
        alignItems: 'center',
        minHeight: '360px',
        minWidth: smBreak ? '' : '320px',
        maxWidth: '400px',
        overflow: 'visible'
      }}
    >
      { props.children }
    </DialogContent>
  );

};
