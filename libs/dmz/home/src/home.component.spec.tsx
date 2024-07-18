import { render } from '@testing-library/react';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HomeComponent />);
    expect(baseElement).toBeTruthy();
  });
});
