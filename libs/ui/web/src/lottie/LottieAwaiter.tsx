import React, { ReactElement } from 'react';
import { LottiePropTypes } from './lottieTypes';
import { LottieWrapper } from './LottieWrapper';
// @ts-ignore
import * as animationData from './files/loading-orange-diffuse.json';

export const LottieAwaiter: React.FC<LottiePropTypes> = ({ complete }): ReactElement => {
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
