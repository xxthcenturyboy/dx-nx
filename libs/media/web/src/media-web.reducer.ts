import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1';
import { PersistConfig } from 'reduxjs-toolkit-persist/lib/types';

import { MediaDataType } from '@dx/media-shared';
import { MediaStateType } from './media-web.types';
import { MEDIA_ENTITY_NAME } from './media-web.constants';

export const mediaInitialState: MediaStateType = {
  media: []
};

export const mediaPersistConfig: PersistConfig<MediaStateType> = {
  key: MEDIA_ENTITY_NAME,
  // blacklist: ['password'],
  storage,
  stateReconciler: autoMergeLevel1,
};

const mediaSlice = createSlice({
  name: MEDIA_ENTITY_NAME,
  initialState: mediaInitialState,
  reducers: {
    setMediaAll(state, action: PayloadAction<MediaDataType[]>) {
      state.media = action.payload;
    },
    addMediaItem(state, action: PayloadAction<MediaDataType>) {
      const nextState = state.media;
      nextState.push(action.payload);
      state.media = nextState;
    },
    removeMediaItem(state, action: PayloadAction<string>) {
      const nextState = state.media.filter(mediaItem => mediaItem.id !== action.payload);
      state.media = nextState;
    }
  },
});

export const mediaActions = mediaSlice.actions;

export const mediaReducer = mediaSlice.reducer;
