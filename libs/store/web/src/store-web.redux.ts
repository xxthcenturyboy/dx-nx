import {
  configureStore,
  combineReducers
} from '@reduxjs/toolkit';
import {
  useDispatch,
  useSelector,
  useStore
} from 'react-redux';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'reduxjs-toolkit-persist';

import {
  AuthStateType,
  authReducer,
  authPersistConfig
} from '@dx/auth-web';
import { homeReducer } from '@dx/home';
import { uiReducer } from '@dx/ui-web';
import { dashboardReducer } from '@dx/dashboard-web';
import { shortlinkReducer } from '@dx/shortlink-web';

const combinedPersistReducers = combineReducers({
  auth: persistReducer<AuthStateType, any>(authPersistConfig, authReducer) as typeof authReducer,
  dashboard: dashboardReducer,
  home: homeReducer,
  shortlink: shortlinkReducer,
  ui: uiReducer
});

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     home: homeReducer
//   }
// });
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

type AppStore = typeof store;
type RootState = ReturnType<AppStore['getState']>;
type AppDispatch = AppStore['dispatch'];

const useAppDispatch = useDispatch.withTypes<AppDispatch>();
const useAppSelector = useSelector.withTypes<RootState>();
const useAppStore = useStore.withTypes<AppStore>();

export {
  AppDispatch,
  RootState,
  persistor,
  store,
  useAppDispatch,
  useAppSelector,
  useAppStore
};
