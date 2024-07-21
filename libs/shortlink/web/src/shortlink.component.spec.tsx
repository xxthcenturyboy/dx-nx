import { render } from '@testing-library/react';

import { ShortlinkComponent } from './shortlink.component';

describe('ShortlinkComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ShortlinkComponent />);
    expect(baseElement).toBeTruthy();
  });
});
