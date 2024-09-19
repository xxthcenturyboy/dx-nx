import React, { ReactElement } from 'react';
import { LottiePropTypes } from './lottie.types';
import { LottieWrapper } from './LottieWrapper';
// @ts-ignore
import * as animationData from './files/error-exclamation-point.json';

export const AlertLottie: React.FC<LottiePropTypes> = ({
  complete,
}): ReactElement => {
  return (
    <LottieWrapper
      animationData={animationData}
      complete={complete}
      loop={true}
      speed={1.5}
      style={{
        width: '200px',
        alignSelf: 'center',
      }}
    />
  );
};
