import React from 'react';
import styled from 'styled-components';

import {
  uiActions
} from '@dx/ui-web';
import { useAppDispatch } from '@dx/store-web';
import { HomeComponent } from '@dx/home';

const StyledApp = styled.div`
  // Your style here
`;

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(uiActions.windowSizeSet());
    window.addEventListener('resize', () => {
      dispatch(uiActions.windowSizeSet());
    });
  }, []);


  return (
    <StyledApp>
      {/* <div>HOME</div> */}
      <HomeComponent />
    </StyledApp>
  );
};
