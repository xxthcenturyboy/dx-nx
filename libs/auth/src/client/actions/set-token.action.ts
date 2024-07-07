import { createAction } from 'typesafe-actions';

const type: 'AUTH:SET_TOKEN' = 'AUTH:SET_TOKEN';

export const setToken = createAction(type)<string>();
