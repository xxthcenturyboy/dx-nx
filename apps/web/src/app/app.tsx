import React from 'react';
import styled from 'styled-components';

import { reduxResizeListener } from '@dx/ui-web';
import { HomeComponent } from '@dx/home';

const StyledApp = styled.div`
  // Your style here
`;

export const App: React.FC = () => {
  React.useEffect(() => {
    reduxResizeListener();
  }, []);


  return (
    <StyledApp>
      <HomeComponent />
    </StyledApp>
  );
};
