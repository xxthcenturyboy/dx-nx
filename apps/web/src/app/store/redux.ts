import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk,
{
  ThunkDispatch
} from 'redux-thunk';
import {
  useSelector as reduxUseSelector,
  TypedUseSelectorHook,
  useDispatch as reduxUseDispatch
} from 'react-redux';
import { persistStore } from 'redux-persist';

import { authInitialState } from '@dx/auth';
import { WebRootStateType } from '@dx/config';
import { history } from './history';
import { allActions } from './actions';
import { rootReducer } from './root.reducer';

// Support redux devtools extension
const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true })
  || compose;

const initialState = {
  auth: authInitialState,
};

const middlewares = applyMiddleware(
  routerMiddleware(history),
  thunk.withExtraArgument(allActions),
);

const enhancer = composeEnhancer(middlewares);
const store = createStore(rootReducer, initialState, enhancer);
const persistor = persistStore(store);

const useSelector: TypedUseSelectorHook<WebRootStateType> = reduxUseSelector;
type RootAction = import('./actions').RootAction;
type ReduxDispatch = ThunkDispatch<WebRootStateType, any, RootAction>;
const useDispatch = () => reduxUseDispatch<ReduxDispatch>();

export {
  persistor,
  ReduxDispatch,
  store,
  useDispatch,
  useSelector,
};
