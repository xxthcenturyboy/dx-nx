import React from 'react';
import {
  Backdrop,
  Box,
  Typography,
} from '@mui/material';
import { BeatLoader } from 'react-spinners';

import {
  RootState,
  useAppSelector
} from '@dx/store-web';
import { themeColors } from '../mui-overrides/styles';

export const GlobalAwaiterComponent: React.FC = () => {
  const open = useAppSelector((state: RootState) => state.ui.awaitDialogOpen);
  const message = useAppSelector((state: RootState) => state.ui.awaitDialogMessage);

  return (
    <Backdrop
      open={open}
      style={{
        textAlign: 'center',
        zIndex: 10000
      }}
    >
      <Box>
        <BeatLoader
          color={themeColors.secondary}
          size={30}
          margin="2px"
        />
        {
          !!message && (
            <Box
              style={{
                backgroundColor: themeColors.primary,
                opacity: 0.75,
                padding: '20px',
                margin: '40px 20px',
                borderRadius: '50px'
              }}
            >
              <Typography
                align="center"
                color="white"
                margin="0 20px"
                variant="h5"
              >
                { message }
              </Typography>
            </Box>
          )
        }
      </Box>

    </Backdrop>
  );
};
