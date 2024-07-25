import React, { useRef } from 'react';

export const useFocus = (): [React.MutableRefObject<any>, () => void] => {
  const htmlElRef = useRef<any>(null);
  const setFocus = () => { htmlElRef?.current?.focus(); };

  return [htmlElRef, setFocus];
};
