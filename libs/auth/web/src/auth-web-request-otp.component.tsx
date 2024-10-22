import React from 'react';
import { BeatLoader } from 'react-spinners';
import {
  Box,
  Button,
  Fade,
  FormControl,
  Grid2,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { CountryData } from 'react-phone-input-2';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js';

import {
  FADE_TIMEOUT_DUR,
  themeColors
} from '@dx/ui-web-system';
import { DialogError } from '@dx/ui-web-dialogs';
import { useAppSelector } from '@dx/utils-web-hooks';
import { logger } from '@dx/logger-web';
import {
  selectIsUserProfileValid,
  selectUserEmails,
  selectUserPhones,
} from '@dx/user-profile-web';
import { PhoneNumberInput } from '@dx/phone-web';
import { OTP_LENGTH } from '@dx/auth-shared';
import { regexEmail } from '@dx/util-regex';
import { Form } from './auth-web-login.ui';
import { AuthWebOtpEntry } from './auth-web-otp.component';
import {
  useOtpRequestEmailMutation,
  useOtpRequestIdMutation,
  useOtpRequestPhoneMutation,
} from './auth-web.api';

type AuthWebRequestOtpPropsType = {
  hasCallbackError: boolean;
  onCompleteCallback: (value: string, code: string, region?: string) => void;
};

export const AuthWebRequestOtpEntry: React.FC<AuthWebRequestOtpPropsType> =
  React.forwardRef((props, ref) => {
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [countryData, setCountryData] = React.useState<CountryData | null>(null);
    const [hasSentOtp, setHasSentOtp] = React.useState(false);
    const [hasFiredCallback, setHasFiredCallback] = React.useState(false);
    const [otp, setOtp] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [selectedMethod, setSelectedMethod] = React.useState<'EMAIL' | 'PHONE' | ''>('');
    const isProfileValid = useAppSelector(state =>
      selectIsUserProfileValid(state)
    );
    const userEmails = useAppSelector(state =>
      selectUserEmails(state)
    );
    const userPhones = useAppSelector(state =>
      selectUserPhones(state)
    );
    const [
      requestOtpCodeEmail,
      {
        data: sendOtpEmailResponse,
        error: sendOtpEmailError,
        isLoading: isLoadingSendOtpEmail,
        isSuccess: sendOtpEmailSuccess,
        isUninitialized: sendOtpEmailUninitialized,
      },
    ] = useOtpRequestEmailMutation();
    const [
      requestOtpCodeId,
      {
        data: sendOtpIdResponse,
        error: sendOtpIdError,
        isLoading: isLoadingSendOtpId,
        isSuccess: sendOtpIdSuccess,
        isUninitialized: sendOtpIdUninitialized,
      },
    ] = useOtpRequestIdMutation();
    const [
      requestOtpCodePhone,
      {
        data: sendOtpPhoneResponse,
        error: sendOtpPhoneError,
        isLoading: isLoadingSendOtpPhone,
        isSuccess: sendOtpPhoneSuccess,
        isUninitialized: sendOtpPhoneUninitialized,
      },
    ] = useOtpRequestPhoneMutation();

    React.useEffect(() => {
      if (
        !isLoadingSendOtpEmail &&
        !isLoadingSendOtpPhone &&
        !isLoadingSendOtpId
      ) {
        if (!sendOtpEmailError && !sendOtpPhoneError && !sendOtpIdError) {
          setErrorMessage('');
          return;
        }

        if (sendOtpEmailError && 'error' in sendOtpEmailError) {
          setErrorMessage(sendOtpEmailError['error']);
        }

        if (sendOtpPhoneError && 'error' in sendOtpPhoneError) {
          setErrorMessage(sendOtpPhoneError['error']);
        }

        if (sendOtpIdError && 'error' in sendOtpIdError) {
          setErrorMessage(sendOtpIdError['error']);
        }
      }
    }, [isLoadingSendOtpEmail, isLoadingSendOtpPhone, isLoadingSendOtpId]);

    React.useEffect(() => {
      if (sendOtpEmailSuccess || sendOtpPhoneSuccess || sendOtpIdSuccess) {
        setHasSentOtp(true);
      }
    }, [sendOtpEmailSuccess, sendOtpPhoneSuccess, sendOtpIdSuccess]);

    React.useEffect(() => {
      if (otp.length === OTP_LENGTH && selectedMethod) {
        const value = selectedMethod === 'PHONE' ? phone : email;
        props.onCompleteCallback(value, otp, countryData?.countryCode);
        setHasFiredCallback(true);
      }
    }, [otp]);

    const phoneSubmitButtonDisabled = (): boolean => {
      const countryCode = countryData?.countryCode
        ? (countryData.countryCode.toUpperCase() as CountryCode)
        : 'US';

      if (
        !(phone && countryData) ||
        !isValidPhoneNumber(phone, countryCode) ||
        isLoadingSendOtpPhone
      ) {
        return true;
      }

      return false;
    };

    const handleSendOtpCode = async (event: React.FormEvent): Promise<void> => {
      event.preventDefault();
      event.stopPropagation();

      if (selectedMethod === 'EMAIL' && email) {
        await requestOtpCodeEmail({ email }).catch((err) =>
          logger.error((err as Error).message, err)
        );
      }

      if (selectedMethod === 'PHONE' && phone) {
        await requestOtpCodePhone({
          phone,
          regionCode: (countryData as CountryData).countryCode,
        }).catch((err) => logger.error((err as Error).message, err));
      }
    };

    const handleSendOtpCodeFromLoggedIn = async (
      method: 'EMAIL' | 'PHONE',
      id: string
    ): Promise<void> => {
      setSelectedMethod(method);
      await requestOtpCodeId({ id, type: method }).catch((err) =>
        logger.error((err as Error).message, err)
      );
    };

    const handleChangeEmail = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      setEmail(event.target.value);
    };

    const renderBackButton = (startOver?: boolean): JSX.Element | null => {
      if (startOver) {
        return (
          <Button
            variant="text"
            onClick={() => {
              setSelectedMethod('');
              setHasSentOtp(false);
              setHasFiredCallback(false);
            }}
            fullWidth
            startIcon={<ChevronLeftIcon />}
            style={{
              justifyContent: 'center',
              marginTop: '50px',
            }}
          >
            Start Over
          </Button>
        );
      }

      return (
        <Button
          variant="text"
          onClick={() => {
            setSelectedMethod('');
            setHasSentOtp(false);
          }}
          fullWidth
          startIcon={<ChevronLeftIcon />}
          style={{
            justifyContent: 'start',
          }}
        >
          Back
        </Button>
      );
    };

    const renderPhoneInput = (): JSX.Element => {
      return (
        <Fade in={true} timeout={FADE_TIMEOUT_DUR}>
          <Grid2>
            <Form name="form-enter-phone" onSubmit={handleSendOtpCode}>
              <FormControl
                disabled={phoneSubmitButtonDisabled()}
                margin="normal"
                variant="outlined"
                style={{ minWidth: 300 }}
              >
                <PhoneNumberInput
                  defaultCountry="us"
                  defaultValue=""
                  inputId="input-user-phone"
                  preferredCountries={['us']}
                  required={true}
                  disabled={false}
                  label="Phone"
                  onChange={(value: string, data: CountryData) => {
                    setPhone(value);
                    setCountryData(data);
                  }}
                  value={phone || ''}
                />
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                onClick={handleSendOtpCode}
                disabled={phoneSubmitButtonDisabled()}
                sx={{
                  marginTop: '12px',
                }}
                fullWidth
              >
                {isLoadingSendOtpPhone ? (
                  <BeatLoader
                    color={themeColors.secondary}
                    size={16}
                    margin="2px"
                  />
                ) : (
                  'Send Code'
                )}
              </Button>
            </Form>
            {renderBackButton()}
          </Grid2>
        </Fade>
      );
    };

    const renderEmailInput = (): JSX.Element => {
      return (
        <Fade in={true} timeout={FADE_TIMEOUT_DUR}>
          <Grid2>
            <Form name="form-enter-email" onSubmit={handleSendOtpCode}>
              <FormControl
                disabled={isLoadingSendOtpEmail}
                margin="normal"
                variant="outlined"
                style={{ minWidth: 300 }}
              >
                <InputLabel htmlFor="input-email">Email</InputLabel>
                <OutlinedInput
                  id="input-email"
                  name="input-email"
                  onChange={handleChangeEmail}
                  type="email"
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  value={email || ''}
                  placeholder={'Email'}
                  fullWidth
                  label={'Email'}
                />
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                onClick={handleSendOtpCode}
                disabled={isLoadingSendOtpEmail || !regexEmail.test(email)}
                sx={{
                  marginTop: '12px',
                }}
                fullWidth
              >
                {isLoadingSendOtpEmail ? (
                  <BeatLoader
                    color={themeColors.secondary}
                    size={16}
                    margin="2px"
                  />
                ) : (
                  'Send Code'
                )}
              </Button>
            </Form>
            {renderBackButton()}
          </Grid2>
        </Fade>
      );
    };

    const renderSelectFromLoggedIn = (): JSX.Element => {
      return (
        <>
          <Typography
            variant="h6"
            textAlign="center"
            style={{
              margin: '0px auto 24px',
            }}
          >
            Choose where to send a one-time code.
          </Typography>
          {userPhones.length &&
            userPhones.map((userPhone) => {
              if (userPhone.isVerified) {
                return (
                  <Grid2 key={userPhone.id} width={'100%'}>
                    <Button
                      variant="contained"
                      onClick={(event: React.FormEvent) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setPhone(userPhone.id);
                        setCountryData({
                          countryCode: userPhone.countryCode,
                          dialCode: '',
                          format: '',
                          name: '',
                        });
                        handleSendOtpCodeFromLoggedIn('PHONE', userPhone.id);
                      }}
                      style={{
                        justifyContent: 'left',
                        paddingLeft: '24px',
                      }}
                      fullWidth
                      startIcon={<PhoneIcon />}
                    >
                      {userPhone.uiFormatted || userPhone.phone}
                    </Button>
                  </Grid2>
                );
              }
            })}
          {userEmails.length &&
            userEmails.map((userEmail) => {
              if (userEmail.isVerified) {
                return (
                  <Grid2 key={userEmail.id} width={'100%'}>
                    <Button
                      variant="contained"
                      onClick={(event: React.FormEvent) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setEmail(userEmail.id);
                        setCountryData(null);
                        handleSendOtpCodeFromLoggedIn('EMAIL', userEmail.id);
                      }}
                      style={{
                        justifyContent: 'left',
                        paddingLeft: '24px',
                      }}
                      fullWidth
                      startIcon={<EmailIcon />}
                    >
                      {userEmail.email}
                    </Button>
                  </Grid2>
                );
              }
            })}
        </>
      );
    };

    const renderSelectFromLoggedout = (): JSX.Element => {
      return (
        <>
          <Grid2 width={'100%'}>
            <Button
              variant="contained"
              onClick={() => setSelectedMethod('PHONE')}
              fullWidth
              endIcon={<PhoneIcon />}
            >
              Get code via phone
            </Button>
          </Grid2>

          <Grid2 width={'100%'}>
            <Button
              variant="contained"
              onClick={() => setSelectedMethod('EMAIL')}
              fullWidth
              endIcon={<EmailIcon />}
            >
              Get code via email
            </Button>
          </Grid2>
        </>
      );
    };

    const renderOtpEntry = (): JSX.Element => {
      return (
        <>
          {!hasFiredCallback && (
            <AuthWebOtpEntry
              method={selectedMethod}
              onCompleteCallback={setOtp}
            />
          )}
          {hasFiredCallback && !props.hasCallbackError && (
            <BeatLoader color={themeColors.secondary} size={24} margin="2px" />
          )}
          {hasFiredCallback && props.hasCallbackError && renderBackButton(true)}
        </>
      );
    };

    return (
      <Fade in={true} timeout={FADE_TIMEOUT_DUR}>
        <Box ref={ref} width={'100%'}>
          <Grid2
            container
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
            spacing={2}
          >
            {isProfileValid &&
              !selectedMethod &&
              !errorMessage &&
              renderSelectFromLoggedIn()}
            {!isProfileValid &&
              !selectedMethod &&
              !errorMessage &&
              renderSelectFromLoggedout()}
            {!isProfileValid &&
              selectedMethod === 'PHONE' &&
              !hasSentOtp &&
              !errorMessage &&
              renderPhoneInput()}
            {!isProfileValid &&
              selectedMethod === 'EMAIL' &&
              !hasSentOtp &&
              !errorMessage &&
              renderEmailInput()}
            {hasSentOtp && !errorMessage && renderOtpEntry()}
            {isLoadingSendOtpId && (
              <BeatLoader
                color={themeColors.secondary}
                size={16}
                margin="2px"
              />
            )}
            {!!errorMessage && <DialogError message={errorMessage} />}
          </Grid2>
        </Box>
      </Fade>
    );
  });
