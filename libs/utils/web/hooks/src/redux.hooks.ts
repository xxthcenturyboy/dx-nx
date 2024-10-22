/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useDispatch, useSelector, useStore } from 'react-redux';

// eslint-disable-next-line @nx/enforce-module-boundaries
import type {
  AppDispatch,
  AppStore,
  RootState,
} from '@dx/store-web';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
