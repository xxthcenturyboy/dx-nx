import { render } from '@testing-library/react';

import { Dashboard } from './dashboard.component';

describe('Dashboard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Dashboard />);
    expect(baseElement).toBeTruthy();
  });
});
