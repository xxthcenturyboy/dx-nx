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
import { dashboardReducer } from '@dx/dashboard-web';
import { homeReducer } from '@dx/home';
import { notificationReducer } from '@dx/notifications-web';
import {
  privilegeSetReducer,
  privilegeSetPersistConfig,
  PrivilegeSetStateType
} from '@dx/user-privilege-web';
import {
  statsPersistConfig,
  statsReducer,
  StatsStateType
} from '@dx/stats-web';
import {
  userAdminReducer,
  userAdminPersistConfig,
  UserAdminStateType
} from '@dx/user-admin-web';
import {
  userProfileReducer,
  userProfilePersistConfig
} from '@dx/user-profile-web';
import { UserProfileStateType } from '@dx/user-shared';
import {
  uiPersistConfig,
  uiReducer,
  UiStateType
} from '@dx/ui-web';
import { apiWebMain } from '@dx/rtk-query-web';

const combinedPersistReducers = combineReducers({
  [apiWebMain.reducerPath]: apiWebMain.reducer,
  auth: persistReducer<AuthStateType, any>(authPersistConfig, authReducer) as typeof authReducer,
  dashboard: dashboardReducer,
  home: homeReducer,
  notification: notificationReducer,
  privileges: persistReducer<PrivilegeSetStateType, any>(privilegeSetPersistConfig, privilegeSetReducer) as typeof privilegeSetReducer,
  stats: persistReducer<StatsStateType, any>(statsPersistConfig, statsReducer) as typeof statsReducer,
  ui: persistReducer<UiStateType, any>(uiPersistConfig, uiReducer) as typeof uiReducer,
  userAdmin: persistReducer<UserAdminStateType, any>(userAdminPersistConfig, userAdminReducer) as typeof userAdminReducer,
  userProfile: persistReducer<UserProfileStateType, any>(userProfilePersistConfig, userProfileReducer) as typeof userProfileReducer
});

const store = configureStore({
  reducer: combinedPersistReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'ui/appDialogSet'
        ],
        ignoredPaths: [
          'ui.dialogComponent'
        ]
      },
    }).concat(apiWebMain.middleware),
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
