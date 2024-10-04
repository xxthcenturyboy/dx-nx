import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';

import { Root } from './root.component';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn().mockImplementation(() => {
    return {
      ...jest.requireActual('react-redux').useDispatch,
      withTypes: jest.fn()
    };
  }),
  useSelector: jest.fn()
}));
// jest.mock('@dx/store-web');
// jest.mock('@dx/rtk-query-web');

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
