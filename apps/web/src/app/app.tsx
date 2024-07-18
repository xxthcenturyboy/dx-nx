import styled from 'styled-components';

import NxWelcome from './nx-welcome';
import { reduxResizeListener } from '@dx/ui-web';
import React from 'react';


const StyledApp = styled.div`
  // Your style here
`;

export const App: React.FC = () => {
  React.useEffect(() => {
    reduxResizeListener();
  }, []);


  return (
    <StyledApp>
      <NxWelcome title="DX Web" />
    </StyledApp>
  );
};
