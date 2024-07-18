import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  Route,
  RouterProvider
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';

import { App } from './app/app';
import {
  persistor,
  store
} from '@dx/store-web';
import { ErrorBoundary } from '@dx/utils-web-error-boundary';

(window as any).store = store;

const root = createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  }
]);

root.render(
  <StrictMode>
    <Provider
      store={store}
    >
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <ErrorBoundary fallback={<h1>Something Went Wrong.</h1>}>
          <RouterProvider
            router={router}
          />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  </StrictMode>
);
