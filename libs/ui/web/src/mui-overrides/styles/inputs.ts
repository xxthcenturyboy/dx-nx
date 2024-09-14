import { APP_COLOR_PALETTE } from './themeColors';
import { BORDER_RADIUS } from "./common";

export const filledInputSyleOverrides = {
  root: {
    borderRadius: BORDER_RADIUS,
    border: '1px solid transparent',
    '&.Mui-focused': {
      border: `1px solid ${APP_COLOR_PALETTE.SECONDARY[700]}`
    }
  },
};

export const outlinedInputSyleOverrides = {
  root: {
    borderRadius: BORDER_RADIUS,
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        border: `1px solid ${APP_COLOR_PALETTE.SECONDARY[700]}`,
      },
    }
  },
};

export const filledInputDefaults = {
  disableUnderline: true
}

export const outlinedInputInputDefaults = {
  // notched: true
}
