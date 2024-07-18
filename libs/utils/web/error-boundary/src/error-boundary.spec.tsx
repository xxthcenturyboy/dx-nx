import { render } from '@testing-library/react';

import { ErrorBoundary } from './error-boundary';

describe('ErrorBoundary', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ErrorBoundary fallback={<p>Something went wrong.</p>} />);
    expect(baseElement).toBeTruthy();
  });
});
