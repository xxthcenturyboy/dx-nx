import { store } from "@dx/store-web";
import { uiActions } from "@dx/ui-web";
import { STRINGS } from "./en.strings";

export function appBootstrap() {
  if (STRINGS) {
    // TODO: Get JSON from Server
    store.dispatch(uiActions.setStrings(STRINGS));
  }
}
