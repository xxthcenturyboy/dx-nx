import React from 'react';
import { BeatLoader } from 'react-spinners';
import {
  Box,
  Button,
  Fade,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Typography
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { CountryData } from 'react-phone-input-2';
import {
  CountryCode,
  isValidPhoneNumber
} from 'libphonenumber-js';

import {
  DialogError,
  FADE_TIMEOUT_DUR,
  themeColors
} from '@dx/ui-web';
import {
  RootState,
  useAppSelector
} from '@dx/store-web';
import { logger } from '@dx/logger-web';
import {
  selectIsUserProfileValid,
  selectUserEmails,
  selectUserPhones
} from '@dx/user-profile-web';
import { PhoneNumberInput } from '@dx/phone-web';
import { OTP_LENGTH } from '@dx/auth-shared';
import { regexEmail } from '@dx/util-regex';
import { Form } from './auth-web-login.ui'
import { AuthWebOtpEntry } from './auth-web-otp.component';
import {
  useOtpRequestEmailMutation,
  useOtpRequestPhoneMutation
} from './auth-web.api';

type AuthWebRequestOtpPropsType = {
  hasLoginError: boolean;
  onCompleteCallback: (value: string, code: string, region?: string) => void;
};

export const AuthWebRequestOtpEntry: React.FC<AuthWebRequestOtpPropsType> = React.forwardRef((props, ref) => {
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [countryData, setCountryData] = React.useState<CountryData | null>(null);
  const [hasSentOtp, setHasSentOtp] = React.useState(false);
  const [hasSentLogin, setHasSentLogin] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [selectedMethod, setSelectedMethod] = React.useState<'EMAIL' | 'PHONE' | ''>('');
  const isProfileValid = useAppSelector((state: RootState) => selectIsUserProfileValid(state));
  const userEmails = useAppSelector((state: RootState) => selectUserEmails(state));
  const userPhones = useAppSelector((state: RootState) => selectUserPhones(state));
  const [
    requestOtpCodeEmail,
    {
      data: sendOtpEmailResponse,
      error: sendOtpEmailError,
      isLoading: isLoadingSendOtpEmail,
      isSuccess: sendOtpEmailSuccess,
      isUninitialized: sendOtpEmailUninitialized
    }
  ] = useOtpRequestEmailMutation();
  const [
    requestOtpCodePhone,
    {
      data: sendOtpPhoneResponse,
      error: sendOtpPhoneError,
      isLoading: isLoadingSendOtpPhone,
      isSuccess: sendOtpPhoneSuccess,
      isUninitialized: sendOtpPhoneUninitialized
    }
  ] = useOtpRequestPhoneMutation();

  React.useEffect(() => {
  }, []);

  React.useEffect(() => {
    if (
      !isLoadingSendOtpEmail
      && !isLoadingSendOtpPhone
    ) {
      if (
        !sendOtpEmailError
        && !sendOtpPhoneError
      ) {
        setErrorMessage('');
        return;
      }

      if (
        sendOtpEmailError
        && 'error' in sendOtpEmailError
      ) {
        setErrorMessage(sendOtpEmailError['error']);
      }

      if (
        sendOtpPhoneError
        && 'error' in sendOtpPhoneError
      ) {
        setErrorMessage(sendOtpPhoneError['error']);
      }
    }
  }, [
    isLoadingSendOtpEmail,
    isLoadingSendOtpPhone
  ]);

  React.useEffect(() => {
    if (
      sendOtpEmailSuccess
      || sendOtpPhoneSuccess
    ) {
      setHasSentOtp(true);
    }
  }, [
    sendOtpEmailSuccess,
    sendOtpPhoneSuccess
  ]);

  React.useEffect(() => {
    if (
      otp.length === OTP_LENGTH
      && selectedMethod
    ) {
      const value = selectedMethod === 'PHONE'
        ? phone
        : email
      props.onCompleteCallback(value, otp, countryData?.countryCode);
      setHasSentLogin(true);
    }
  }, [otp]);

  const phoneSubmitButtonDisabled = (): boolean => {
    const countryCode = countryData?.countryCode
      ? countryData.countryCode.toUpperCase() as CountryCode
      : 'US';

      if (
      !(phone && countryData)
      || !isValidPhoneNumber(phone, countryCode)
      || isLoadingSendOtpPhone
    ) {
      return true;
    }

    return false;

  };

  const handleSendOtpCode = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();

    if (
      selectedMethod === 'EMAIL'
      && email
    ) {
      await requestOtpCodeEmail({ email })
        .catch((err) => logger.error((err as Error).message, err));
    }

    if (
      selectedMethod === 'PHONE'
      && phone
    ) {
      await requestOtpCodePhone({ phone, regionCode: (countryData as CountryData).countryCode, })
        .catch((err) => logger.error((err as Error).message, err));
    }
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const renderBackButton = (startOver?: boolean): JSX.Element | null => {
    if (startOver) {
      return (
        <Button
          variant="text"
          onClick={
            () => {
              setSelectedMethod('');
              setHasSentOtp(false);
              setHasSentLogin(false);
            }
          }
          fullWidth
          startIcon={<ChevronLeftIcon />}
          style={
            {
              justifyContent: 'center',
              marginTop: '50px'
            }
          }
        >
          Start Over
        </Button>
      );
    }

    return (
      <Button
        variant="text"
        onClick={
          () => {
            setSelectedMethod('');
            setHasSentOtp(false);
          }
        }
        fullWidth
        startIcon={<ChevronLeftIcon />}
        style={
          {
            justifyContent: 'start'
          }
        }
      >
        Back
      </Button>
    );
  };

  const renderPhoneInput = (): JSX.Element => {
    return (
      <Fade
        in={true}
        timeout={FADE_TIMEOUT_DUR}
      >
        <Grid
          item
        >
          <Form
            name="form-enter-phone"
            onSubmit={handleSendOtpCode}
          >
            <FormControl
              disabled={phoneSubmitButtonDisabled()}
              margin="normal"
              variant="standard"
              style={{ minWidth: 300 }}
            >
              <InputLabel
                htmlFor="new-user-phone"
                style={{
                  position: 'absolute',
                  top: -33,
                  left: 5,
                  fontSize: '14px'
                }}
              >
                Phone
              </InputLabel>
              <PhoneNumberInput
                defaultCountry="us"
                defaultValue=""
                inputId="user-phone"
                preferredCountries={['us']}
                required={true}
                disabled={false}
                onChange={
                  (value: string, data: CountryData) => {
                    setPhone(value);
                    setCountryData(data);
                  }
                }
                value={phone || ''}
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSendOtpCode}
              disabled={phoneSubmitButtonDisabled()}
              sx={{
                marginTop: '12px'
              }}
              fullWidth
            >
              {
                isLoadingSendOtpPhone ? (
                  <BeatLoader
                    color={themeColors.secondary}
                    size={16}
                    margin="2px"
                  />
                )
                :
                'Send Code'
              }
            </Button>
          </Form>
          {
            renderBackButton()
          }
        </Grid>
      </Fade>
    );
  };

  const renderEmailInput = (): JSX.Element => {
    return (
      <Fade
        in={true}
        timeout={FADE_TIMEOUT_DUR}
      >
        <Grid
          item
        >
          <Form
            name="form-enter-email"
            onSubmit={handleSendOtpCode}
          >
            <FormControl
              disabled={isLoadingSendOtpEmail || !regexEmail.test(email)}
              margin="normal"
              variant="standard"
              style={{ minWidth: 300 }}
            >
              <InputLabel
                htmlFor="email"
              >
                Email
              </InputLabel>
              <Input
                id="email"
                name="email"
                onChange={handleChangeEmail}
                type="email"
                autoCorrect="off"
                autoComplete="off"
                value={email || ''}
                fullWidth
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSendOtpCode}
              disabled={isLoadingSendOtpEmail || !regexEmail.test(email)}
              sx={{
                marginTop: '12px'
              }}
              fullWidth
            >
              {
                isLoadingSendOtpEmail ? (
                  <BeatLoader
                    color={themeColors.secondary}
                    size={16}
                    margin="2px"
                  />
                )
                :
                'Send Code'
              }
            </Button>
          </Form>
          {
            renderBackButton()
          }
        </Grid>
      </Fade>
    );
  };

  const renderSelectFromLoggedIn = (): JSX.Element => {
    return (
      <Fade
        in={true}
        timeout={FADE_TIMEOUT_DUR}
      >
        <Grid
          container
        >
          <Typography
            variant="h6"
            style={
              {
                margin: '0px auto 24px'
              }
            }
          >
            Choose where to send a one-time code.
          </Typography>
          {
            userPhones.length
            && (
              <>
                {
                  userPhones.map((userPhone) => {
                    if (
                      userPhone.default
                      && userPhone.isVerified
                    ) {
                      return (
                        <Grid
                          item
                          width={'100%'}
                        >
                          <Button
                            variant="contained"
                            onClick={
                              (event: React.FormEvent) => {
                                setSelectedMethod('PHONE');
                                setPhone(userPhone.phoneFormatted);
                                setCountryData({
                                  name: '',
                                  dialCode: '',
                                  countryCode: userPhone.countryCode,
                                  format: ''
                                });
                                void handleSendOtpCode(event);
                              }
                            }
                            fullWidth
                            startIcon={<PhoneIcon />}
                          >
                            { userPhone.uiFormatted }
                          </Button>
                        </Grid>
                      );
                    }
                  })
                }
              </>
            )
          }
          {
            userEmails.length
            && (
              <>
                {
                  userEmails.map((userEmail) => {
                    if (
                      userEmail.default
                      && userEmail.isVerified
                    ) {
                      return (
                        <Grid
                          item
                          width={'100%'}
                        >
                          <Button
                            variant="contained"
                            onClick={
                              (event: React.FormEvent) => {
                                setSelectedMethod('EMAIL');
                                setEmail(userEmail.email);
                                void handleSendOtpCode(event);
                              }
                            }
                            fullWidth
                            startIcon={<EmailIcon />}
                          >
                            { userEmail.email }
                          </Button>
                        </Grid>
                      );
                    }
                  })
                }
              </>
            )
          }
        </Grid>
      </Fade>
    );
  };

  const renderSelectFromLoggedout = (): JSX.Element => {
    return (
      <>
        <Grid
          item
          width={'100%'}
        >
          <Button
            variant="contained"
            onClick={
              () => setSelectedMethod('PHONE')
            }
            fullWidth
            endIcon={<PhoneIcon />}
          >
            Get code via phone
          </Button>
        </Grid>

        <Grid
          item
          width={'100%'}
        >
          <Button
            variant="contained"
            onClick={
              () => setSelectedMethod('EMAIL')
            }
            fullWidth
            endIcon={<EmailIcon />}
          >
            Get code via email
          </Button>
        </Grid>
      </>
    );
  };

  const renderOtpEntry = (): JSX.Element => {
    return (
      <>
        <AuthWebOtpEntry
          method={selectedMethod}
          onCompleteCallback={setOtp}
        />
        {
          hasSentLogin
          && props.hasLoginError
          && renderBackButton(true)
        }
      </>
    );
  };

  return (
    <Fade
      in={true}
      timeout={FADE_TIMEOUT_DUR}
    >
      <Box
        ref={ref}
        width={'100%'}
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="flex-start"
          spacing={4}
        >
          {
            isProfileValid
            && !selectedMethod
            && !errorMessage
            && renderSelectFromLoggedIn()
          }
          {
            !isProfileValid
            && !selectedMethod
            && !errorMessage
            && renderSelectFromLoggedout()
          }
          {
            !isProfileValid
            && selectedMethod === 'PHONE'
            && !hasSentOtp
            && !errorMessage
            && renderPhoneInput()
          }
          {
            !isProfileValid
            && selectedMethod === 'EMAIL'
            && !hasSentOtp
            && !errorMessage
            && renderEmailInput()
          }
          {
            hasSentOtp
            && !errorMessage
            && renderOtpEntry()
          }
          {
            !!errorMessage && (
              <DialogError message={errorMessage} />
            )
          }
        </Grid>
      </Box>
    </Fade>
  );
});
