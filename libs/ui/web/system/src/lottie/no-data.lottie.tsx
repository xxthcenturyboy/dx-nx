import React, { ReactElement } from 'react';
import { LottiePropTypes } from './lottie.types';
import { LottieWrapper } from './LottieWrapper';
// @ts-ignore
import * as animationData from './files/not-found.json';

export const NoDataLottie: React.FC<LottiePropTypes> = ({
  complete,
}): ReactElement => {
  return (
    <LottieWrapper
      animationData={animationData}
      complete={complete}
      loop={true}
      speed={0.5}
      style={{
        width: '100px',
        alignSelf: 'center',
      }}
    />
  );
};
