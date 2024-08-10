import React,
{
  ReactElement
} from 'react';
import Typeography from '@mui/material/Typography'
import { MuiOtpInput } from 'mui-one-time-password-input';

import {
  CustomDialogContent
} from '@dx/ui-web';
import { OTP_LENGTH } from '@dx/auth-shared';

type AuthWebOtpPropsType = {
  method: 'Email' | 'Phone';
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
    <CustomDialogContent
      justifyContent="center"
    >
      <Typeography
        variant="h6"
        style={
          {
            margin: '0px auto 24px'
          }
        }
      >
        Enter the code sent to your { props.method }
      </Typeography>
      <MuiOtpInput
        value={otp}
        onChange={handleChangeOtp}
        onComplete={handleOtpComplete}
        length={OTP_LENGTH}
        autoFocus={true}
      />
    </CustomDialogContent>
  );
};
