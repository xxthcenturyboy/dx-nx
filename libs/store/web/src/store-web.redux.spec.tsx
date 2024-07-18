import { render } from '@testing-library/react';

import { store } from './store-web.redux';

describe('store', () => {
  it('should exist', () => {
    expect(store).toBeDefined();
  });
});
