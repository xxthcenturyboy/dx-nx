import React, { ReactElement } from 'react';
import { LottiePropTypes } from './lottie.types';
import { LottieWrapper } from './LottieWrapper';
// @ts-ignore
import * as animationData from './files/check-mark-succes.json';

export const SuccessLottie: React.FC<LottiePropTypes> = ({
  complete,
}): ReactElement => {
  return (
    <LottieWrapper
      animationData={animationData}
      complete={complete}
      loop={false}
      speed={2}
      style={{
        width: '200px',
        alignSelf: 'center',
      }}
    />
  );
};
