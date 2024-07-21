import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  // Route,
  RouterProvider
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';

import { App } from './app/app';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: (<NotFoundComponent routingFn={() => history.back()} />)
  }
]);

root.render(
  <StrictMode>
    <ErrorBoundary fallback={<NotFoundComponent routingFn={() => null} />}>
      <Provider
        store={store}
      >
        <PersistGate
          loading={<UiLoadingComponent pastDelay={true} />}
          persistor={persistor}
        >
          <RouterProvider
            router={router}
          />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
