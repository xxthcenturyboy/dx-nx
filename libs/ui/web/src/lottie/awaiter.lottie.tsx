import React, { ReactElement } from 'react';
import { LottiePropTypes } from './lottie.types';
import { LottieWrapper } from './LottieWrapper';
// @ts-ignore
import * as animationData from './files/loading-orange-diffuse.json';

export const AwaiterLottie: React.FC<LottiePropTypes> = ({ complete }): ReactElement => {
  return (
    <LottieWrapper
      animationData={animationData}
      complete={complete}
      loop={true}
      speed={2.5}
      style={{
        width: '300px',
        alignSelf: 'center'
      }}
    />
  );
};
