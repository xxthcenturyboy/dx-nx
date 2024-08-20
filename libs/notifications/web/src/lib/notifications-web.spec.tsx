import { render } from '@testing-library/react';

import NotificationsWeb from './notifications-web';

describe('NotificationsWeb', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NotificationsWeb />);
    expect(baseElement).toBeTruthy();
  });
});
