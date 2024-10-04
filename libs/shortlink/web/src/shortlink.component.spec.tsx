// import { render } from '@testing-library/react';
import { renderWithProviders } from '@dx/utils-testing-web';
import { ShortlinkComponent } from './shortlink.component';


const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

describe('ShortlinkComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<ShortlinkComponent />);
    expect(baseElement).toBeTruthy();
  });
});
