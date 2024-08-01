import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';

import { Root } from './root.component';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });

  // it('should have a greeting as the title', () => {
  //   const { getByText } = render(
  //     <BrowserRouter>
  //       <App />
  //     </BrowserRouter>
  //   );
  //   expect(getByText(/Welcome DX Web/i)).toBeTruthy();
  // });
});
