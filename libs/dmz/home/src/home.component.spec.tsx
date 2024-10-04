import { render } from '@testing-library/react';

import { HomeComponent } from './home.component';

const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

describe('HomeComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HomeComponent />);
    expect(baseElement).toBeTruthy();
  });
});
