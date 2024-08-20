import styled from 'styled-components';

/* eslint-disable-next-line */
export interface NotificationsWebProps {}

const StyledNotificationsWeb = styled.div`
  color: pink;
`;

export function NotificationsWeb(props: NotificationsWebProps) {
  return (
    <StyledNotificationsWeb>
      <h1>Welcome to NotificationsWeb!</h1>
    </StyledNotificationsWeb>
  );
}

export default NotificationsWeb;
