// import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { renderWithProviders } from '@dx/utils-testing-web';
import { Root } from './root.component';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(
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
