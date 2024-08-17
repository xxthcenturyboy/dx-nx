import React,
{
  ReactElement
} from 'react';
import {
  Grid,
  Typography
} from '@mui/material';
import { MuiOtpInput } from 'mui-one-time-password-input';

import { stringToTitleCase } from '@dx/util-strings';
import { OTP_LENGTH } from '@dx/auth-shared';

type AuthWebOtpPropsType = {
  method: 'EMAIL' | 'PHONE' | '';
  onCompleteCallback: (value: string) => void;
};

export const AuthWebOtpEntry: React.FC<AuthWebOtpPropsType> = (props): ReactElement => {
  const [otp, setOtp] = React.useState('');

  React.useEffect(() => {
    if (
      otp.length === OTP_LENGTH
      && typeof props.onCompleteCallback === 'function'
    ) {
      props.onCompleteCallback(otp);
    }
  }, [otp]);

  const handleChangeOtp = (value: string): void => {
    setOtp(value);
  };

  const handleOtpComplete = (value: string): void => {
    if (value !== otp) {
      setOtp(value);
    }
  };

  return (
    <Grid
      item
    >
      <Typography
        variant="h6"
        style={
          {
            margin: '0px auto 24px',
            textAlign: 'center'
          }
        }
      >
        { `Enter the code sent to your ${stringToTitleCase(props.method)}` }
      </Typography>
      <MuiOtpInput
        value={otp}
        onChange={handleChangeOtp}
        onComplete={handleOtpComplete}
        length={OTP_LENGTH}
        autoFocus={true}
      />
    </Grid>
  );
};
