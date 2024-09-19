import React from 'react';
import { Box } from '@mui/material';

type DialogWrapperType = {
  children?: React.ReactNode;
  maxWidth?: number;
};

export const DialogWrapper: React.FC<DialogWrapperType> = ({
  children,
  maxWidth,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      style={{
        maxWidth: maxWidth ? `${maxWidth}px` : '',
      }}
    >
      {children}
    </Box>
  );
};
