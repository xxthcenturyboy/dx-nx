import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';

import { App } from './app/app.component';
import { ErrorBoundary } from '@dx/utils-web-error-boundary';
import {
  persistor,
  store
} from '@dx/store-web';
import {
  NotFoundComponent,
  UiLoadingComponent
} from '@dx/ui-web';

// @ts-expect-error - store won't exist until we create it here.
window.store = store;

const root = createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <ErrorBoundary fallback={<NotFoundComponent />}>
      <Provider
        store={store}
      >
        <PersistGate
          loading={<UiLoadingComponent pastDelay={true} />}
          persistor={persistor}
        >
          <App />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
