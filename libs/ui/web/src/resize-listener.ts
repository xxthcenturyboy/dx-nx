import { useAppDispatch } from "@dx/store-web";
import { uiActions } from "./store/ui-web.reducer";

export function reduxResizeListener() {
  const dispatch = useAppDispatch()
  dispatch(uiActions.windowSizeSet());
  window.addEventListener('resize', () => {
    dispatch(uiActions.windowSizeSet());
  });
}
