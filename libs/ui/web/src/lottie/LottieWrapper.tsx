import React,
{
  ReactElement
} from 'react';
import Lottie,
{
  LottieRef
} from 'lottie-react';

import { LottieWrapperPropTypes } from './lottie.types';

export const LottieWrapper: React.FC<LottieWrapperPropTypes> = (props): ReactElement | null => {
  const {
    animationData,
    autoPlay,
    complete,
    loop,
    speed,
    style
  } = props;
  const lottieRef = React.useRef() as LottieRef;

  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = (): void => {
    if (lottieRef) {
      lottieRef.current?.setSpeed(speed || 1);
    }
  };
  if (!animationData) {
    return null;
  }

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      autoPlay={autoPlay !== undefined ? autoPlay : true}
      loop={loop !== undefined ? loop : true}
      onComplete={complete}
      style={style || {}}
    />
  );
};
