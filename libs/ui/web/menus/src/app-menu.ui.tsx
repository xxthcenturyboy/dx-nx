import { List, ListItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

import { DRAWER_WIDTH } from '@dx/ui-web-system';

export const ListNav = styled(List)<{ component?: React.ElementType }>({
  flexGrow: 1,
  margin: 0,
  paddingTop: 0,
  height: '100%',
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

export const CloseMenuItem = styled(ListItem)<{
  component?: React.ElementType;
}>((props) => ({
  backgroundColor: grey[100],
  borderBottom: `1px solid ${grey[300]}`,
  display: 'flex',
  justifyContent: 'flex-end',
  minHeight: '48px',
}));

export const LogoutContainer = styled(List)<{
  mobilebreak: string;
  component?: React.ElementType;
}>((props) => ({
  marginTop: 'auto',
  paddingBottom: '0',
  position: 'fixed',
  bottom: 0,
  width: props.mobilebreak === 'true' ? '100%' : DRAWER_WIDTH,
}));

export const LogoutItem = styled(ListItem)<{ component?: React.ElementType }>({
  backgroundColor: grey[100],
  display: 'flex',
  justifyContent: 'center',
});
