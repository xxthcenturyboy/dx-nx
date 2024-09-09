import {
  Box
} from '@mui/material';
import {
  styled
} from '@mui/material/styles';

export const StyledContentFixedHeader = styled(Box)(({ theme }) => ({
  // boxShadow: '0px 2px 9px 5px rgb(0 0 0 / 10%), 0px 2px 2px 0px rgb(0 0 0 / 10%), 0px 1px 5px 0px rgb(0 0 0 / 10%)',
  position: 'fixed',
  background: theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.common.black,
  zIndex: 10,
  width: 'fill-available'
}));
