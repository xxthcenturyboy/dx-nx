import { store } from '@dx/store-web';
import { uiActions } from '@dx/ui-web-system';
import { STRINGS } from './en.strings';

export function appBootstrap() {
  if (STRINGS) {
    // TODO: Get JSON from Server
    store.dispatch(uiActions.setStrings(STRINGS));
  }
}
