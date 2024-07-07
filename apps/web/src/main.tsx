import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { App } from './app/app';
import { history } from './app/store/history';
import {
  persistor,
  store
} from './app/store/redux';

(window as any).store = store;

const root = createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConnectedRouter history={history}>
          <Route Component={App} />
        </ConnectedRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
