import React from 'react';
import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography
} from '@mui/material';

type UploadProgressComponentPropsType = {
  value: number
} & LinearProgressProps;

export const UploadProgressComponent: React.FC<UploadProgressComponentPropsType> = (props) => {
  return (
    <Box
      sx={
        {
          display: 'flex',
          alignItems: 'center'
          }
        }
      >
      <Box
        sx={
          {
            width: '100%',
            mr: 1
          }
        }
      >
        <LinearProgress
          variant="determinate"
          {...props}
        />
      </Box>
      <Box
        sx={
          {
            minWidth: 35
          }
        }
      >
        <Typography
          variant="body2"
          sx={
            {
              color: 'text.secondary'
            }
          }
        >
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};
