import React from 'react';
import {
    useMediaQuery,
    useTheme,
} from '@mui/material';
import PhoneInput, { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import 'react-phone-input-2/lib/plain.css';

import { PhoneInputProps } from './phone-web-input.types';
import { getDefaultStyles } from './phone-web-input.config';

export const PhoneInputComponent: React.FC<PhoneInputProps> = (props): JSX.Element => {
  const {
      defaultCountry,
      defaultValue,
      disabled,
      inputId,
      preferredCountries,
      required,
      value,
      onChange,
      onFocus,
      onBlur,
      onClick,
      onKeyDown,
  } = props;
  const [focused, setFocused] = React.useState<boolean>(false);
  const theme = useTheme();

  const {
    buttonStyleDefaults,
    containerStyleDefaults,
    dropdownStyleDefaults,
    inputStyleDefaults,
    searchStyleDefaults,
  } = getDefaultStyles(theme);

  const getBorderColor = ():string => {
    if (focused) {
      return theme.palette.primary.main;
    }

    return theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.grey[400];
  };

  const getBorderWidth = (): string => {
    return focused ? '2px' : '1px';
  };

  const buttonStyle = {
    ...buttonStyleDefaults,
    borderColor: getBorderColor(),
    borderWidth: getBorderWidth(),
    ...props.buttonStyle
  };

  const containerStyle = {
    ...containerStyleDefaults,
    ...props.containerStyle
  };

  const inputStyle = {
    ...inputStyleDefaults,
    borderColor: getBorderColor(),
    borderWidth: getBorderWidth(),
    ...props.inputStyle
  };

  const searchStyle = {
    ...searchStyleDefaults,
    ...props.searchStyle
  };

  return (
    <PhoneInput
      country={defaultCountry}
      preferredCountries={preferredCountries}
      value={value || defaultValue}
      enableSearch={true}
      disableSearchIcon={true}
      buttonStyle={buttonStyle}
      containerStyle={containerStyle}
      dropdownStyle={dropdownStyleDefaults}
      inputProps={{
        required,
        id: inputId,
        name: inputId,
        type: 'tel'
      }}
      disabled={disabled}
      inputStyle={inputStyle}
      searchStyle={searchStyle}
      specialLabel={''}
      onChange={onChange}
      onFocus={(event: React.FocusEvent<HTMLInputElement>, data: {} | CountryData) => {
        setFocused(true);
        if (typeof onFocus === 'function') {
          onFocus(event, data);
        }
      }}
      onBlur={(event: React.FocusEvent<HTMLInputElement>, data: {} | CountryData) => {
        setFocused(false);
        if (typeof onBlur === 'function') {
          onBlur(event, data);
        }
      }}
      onClick={onClick}
      onKeyDown={onKeyDown}
    />
  );
};
