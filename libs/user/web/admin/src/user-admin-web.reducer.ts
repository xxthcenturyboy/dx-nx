import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1';
import { PersistConfig } from 'reduxjs-toolkit-persist/lib/types';

import {
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  DEFAULT_SORT
} from '@dx/config-shared';
import { UserType } from '@dx/user-shared';
import {
  UserAdminStateType
} from './user-admin-web.types';
import { USER_ADMIN_ENTITY_NAME } from './user-admin-web.consts';

export const userAdminInitialState: UserAdminStateType = {
  filterValue: undefined,
  lastRoute: '',
  limit: DEFAULT_LIMIT,
  offset: DEFAULT_OFFSET,
  orderBy: undefined,
  sortDir: DEFAULT_SORT,
  user: undefined,
  users: [],
  usersCount: undefined
};

export const userAdminPersistConfig: PersistConfig<UserAdminStateType> = {
  key: USER_ADMIN_ENTITY_NAME,
  // blacklist: ['password'],
  storage,
  stateReconciler: autoMergeLevel1,
};

const userAdminSlice = createSlice({
  name: USER_ADMIN_ENTITY_NAME,
  initialState: userAdminInitialState,
  reducers: {
    filterValueSet(state, action: PayloadAction<string | undefined>) {
      state.filterValue = action.payload;
    },
    lastRouteSet(state, action: PayloadAction<string>) {
      state.lastRoute = action.payload;
    },
    limitSet(state, action: PayloadAction<number>) {
      state.limit = action.payload;
    },
    listSet(state, action: PayloadAction<UseerType[]>) {
      state.users = action.payload;
    },
    offsetSet(state, action: PayloadAction<number>) {
      state.offset = action.payload;
    },
    orderBySet(state, action: PayloadAction<string | undefined>) {
      state.orderBy = action.payload;
    },
    sortDirSet(state, action: PayloadAction<'ASC' | 'DESC'>) {
      state.sortDir = action.payload;
    },
    userSet(state, action: PayloadAction<UserType | undefined>) {
      state.user = action.payload;
    }
  },
});

export const userAdminActions = userAdminSlice.actions;

export const userAdminReducer = userAdminSlice.reducer;
