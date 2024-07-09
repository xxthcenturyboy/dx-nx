import { createSlice } from '@reduxjs/toolkit';

import { AUTH_ENTITY_NAME } from '../model/auth.consts';
import { authInitialState } from './auth.state';
// import { TokenService } from '../shared/token.service';

const authSlice = createSlice({
  name: AUTH_ENTITY_NAME,
  initialState: authInitialState,
  reducers: {
    tokenAdded(state, action) {
      state.token = action.payload;
      state.userId = action.payload
      // state.userId = TokenService.getUserIdFromToken(action.payload)
    },
    tokenRemoved(state, action) {
      state.token = null;
      state.userId = null;
    }
  }
});

export const authActions = authSlice.actions;

export const authReducer = authSlice.reducer;
