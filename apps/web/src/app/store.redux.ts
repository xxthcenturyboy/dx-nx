import { configureStore } from '@reduxjs/toolkit';
import { RouterState, connectRouter } from 'connected-react-router';
import {
  persistCombineReducers,
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'reduxjs-toolkit-persist';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import { createBrowserHistory } from 'history';

import {
  AuthStateType,
  authReducer,
  authPersistConfig
} from '@dx/auth-web';

const rootPersistConfig = {
  key: 'root',
  storage: storage,
};

const routerPersistConfig = {
  key: 'router',
  storage: storage,
};
const history = createBrowserHistory();

const combinedPersistReducers = persistCombineReducers(rootPersistConfig, {
  auth: persistReducer<AuthStateType, any>(authPersistConfig, authReducer),
  router: persistReducer<RouterState, any>(
    routerPersistConfig,
    connectRouter(history)
  ),
});

const store = configureStore({
  reducer: combinedPersistReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { history, persistor, store };
