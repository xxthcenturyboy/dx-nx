import { render } from '@testing-library/react';

import { ShortlinkComponent } from './shortlink.component';


const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn().mockImplementation(() => ({
    withTypes: jest.fn()
  })),
  useSelector: jest.fn()
}));

// jest.mock('@dx/store-web');
// jest.mock('@dx/rtk-query-web');

describe('ShortlinkComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ShortlinkComponent />);
    expect(baseElement).toBeTruthy();
  });
});
