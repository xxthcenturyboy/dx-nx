import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { authReducer } from '@dx/auth-model-web';
import { dashboardReducer } from '@dx/dashboard-web';
import { homeReducer } from '@dx/home';
import { mediaReducer } from '@dx/media-web';
import { notificationReducer } from '@dx/notifications-web';
import { privilegeSetReducer } from '@dx/user-privilege-web';
import { statsReducer } from '@dx/stats-web';
import { userAdminReducer } from '@dx/user-admin-web';
import { userProfileReducer } from '@dx/user-profile-web';
import { uiReducer } from '@dx/ui-web-system';
// import { apiWebMain } from '@dx/rtk-query-web';

const rootReducer = combineReducers({
  // [apiWebMain.reducerPath]: apiWebMain.reducer,
  auth: authReducer,
  dashboard: dashboardReducer,
  home: homeReducer,
  media: mediaReducer,
  notification: notificationReducer,
  privileges:  privilegeSetReducer,
  stats: statsReducer,
  ui: uiReducer,
  userAdmin: userAdminReducer,
  userProfile: userProfileReducer,
});

export const setupStore = (preloadedState: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
  });
}

export type AppStore = ReturnType<typeof setupStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore['dispatch'];
