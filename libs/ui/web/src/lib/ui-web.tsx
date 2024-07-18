import styled from 'styled-components';

/* eslint-disable-next-line */
export interface UiWebProps {}

const StyledUiWeb = styled.div`
  color: pink;
`;

export function UiWeb(props: UiWebProps) {
  return (
    <StyledUiWeb>
      <h1>Welcome to UiWeb!</h1>
    </StyledUiWeb>
  );
}

export default UiWeb;
