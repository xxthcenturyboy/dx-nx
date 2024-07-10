import { createSlice } from '@reduxjs/toolkit';
import jwt from 'jsonwebtoken';

import { AUTH_ENTITY_NAME } from './auth-web.consts';
import { authInitialState } from './auth-web.state';
import { JwtPayloadType } from '@dx/auth-api';

const authSlice = createSlice({
  name: AUTH_ENTITY_NAME,
  initialState: authInitialState,
  reducers: {
    tokenAdded(state, action) {
      const tokenDecoded = jwt.decode(action.payload) as JwtPayloadType;
      state.token = action.payload;
      state.userId = tokenDecoded?._id || null;
    },
    tokenRemoved(state, action) {
      state.token = null;
      state.userId = null;
    },
  },
});

export const authActions = authSlice.actions;

export const authReducer = authSlice.reducer;
