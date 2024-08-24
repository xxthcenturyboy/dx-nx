import {
  List,
  ListItem
} from '@mui/material';
import Menu from '@mui/material/Menu';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

export const StyledAccountnMenu = styled(Menu)<{
  mobilebreak: string,
  component?: React.ElementType
}>((props) => ({
  top: '30px',
  left: props.mobilebreak === 'true' ? '0px' : '-30px',
  '& .MuiPaper-root': {
    maxHeight: '100%',
    width: props.mobilebreak === 'true' ? '100%' : '200px'
  },
  '& .MuiList-root': {
    padding: 0
  }
}));

export const StyledAccountList = styled(List)<{
  component?: React.ElementType
}>(() => ({
  overflowX: 'hidden',
  maxHeight: '80vh',
  '& .MuiList-root': {
    padding: 0
  }
}));

export const StyledAccountMenuListItem = styled(ListItem)<{
  component?: React.ElementType
}>(() => ({
  border: `1px solid ${grey[300]}`,
  height: '48px'
}));

export const StyledAccountActionArea = styled('div')<{
  component?: React.ElementType
}>(() => ({
  backgroundColor: grey[300],
  border: `1px solid ${grey[300]}`,
  minHeight: '20px'
}));
