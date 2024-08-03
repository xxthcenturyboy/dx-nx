import { CSSProperties } from 'react';

export type LottiePropTypes = {
  complete?: () => void;
  loop?: boolean;
};

export type LottieWrapperPropTypes = {
  animationData: Object;
  autoPlay?: boolean;
  complete?: () => void;
  loop?: boolean;
  speed?: number;
  style?: CSSProperties
};
