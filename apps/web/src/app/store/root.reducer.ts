import { combineReducers } from 'redux';
import {
  connectRouter,
  RouterState
} from 'connected-react-router';
import {
  PersistConfig,
  persistReducer
} from 'redux-persist';
import storageSession from "redux-persist/lib/storage/session";
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import {
  authReducer,
  authPersistConfig
} from '@dx/auth';
import { history } from './history';

const routerPersistConfig: PersistConfig<RouterState> = {
  key: 'router',
  stateReconciler: autoMergeLevel2,
  storage: storageSession,
};

const reducers = {
  auth: persistReducer(authPersistConfig, authReducer),
  router: persistReducer(routerPersistConfig, connectRouter(history))
};

const rootReducer = combineReducers<typeof reducers>(reducers);

export  {
  reducers,
  rootReducer
};
