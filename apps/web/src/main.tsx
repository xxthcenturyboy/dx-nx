import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';
import { RouterProvider } from 'react-router-dom';

import { AppRouter } from './app/app.router';
import { ErrorBoundary } from '@dx/utils-web-error-boundary';
import { persistor, store } from '@dx/store-web';
import {
  NotFoundComponent,
  UiLoadingComponent
} from '@dx/ui-web-global-components';

// @ts-expect-error - store won't exist until we create it here.
window.store = store;

const root = createRoot(document.getElementById('root') as HTMLElement);

const router = AppRouter.getRouter();

root.render(
  <StrictMode>
    <ErrorBoundary fallback={<NotFoundComponent />}>
      <Provider store={store}>
        <PersistGate
          loading={<UiLoadingComponent pastDelay={true} />}
          persistor={persistor}
        >
          <RouterProvider
            router={router}
            fallbackElement={<UiLoadingComponent pastDelay={true} />}
          />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
