import {
  List,
  ListItem
} from '@mui/material';
import Menu from '@mui/material/Menu';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const MIN_WIDTH = '358px';

export const StyledNotificationMenu = styled(Menu)<{
  mobilebreak: string,
  component?: React.ElementType
}>((props) => ({
  top: '30px',
  left: props.mobilebreak === 'true' ? '0px' : '-30px',
  '& .MuiPaper-root': {
    maxHeight: '100%',
    width: props.mobilebreak === 'true' ? '100%' : undefined
  },
  '& .MuiList-root': {
    padding: 0
  }
}));

export const StyledNotificationsList = styled(List)<{
  component?: React.ElementType
}>(() => ({
  overflowX: 'hidden',
  maxHeight: '80vh',
  '& .MuiList-root': {
    padding: 0
  }
}));

export const StyledNotification = styled(ListItem)<{
  component?: React.ElementType
}>(() => ({
  border: `1px solid ${grey[300]}`,
  height: '100px',
  minWidth: MIN_WIDTH
}));

export const StyledNotificationActionArea = styled('div')<{
  component?: React.ElementType
}>(() => ({
  backgroundColor: grey[200],
  border: `1px solid ${grey[300]}`,
  minHeight: '30px',
  minWidth: MIN_WIDTH
}));
