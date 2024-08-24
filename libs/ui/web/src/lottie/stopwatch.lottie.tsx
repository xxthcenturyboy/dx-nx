import React, { ReactElement } from 'react';
import { LottiePropTypes } from './lottie.types';
import { LottieWrapper } from './LottieWrapper';
// @ts-ignore
import * as animationData from './files/stopwatch.json';

export const StopwatchLottie: React.FC<LottiePropTypes> = ({ complete }): ReactElement => {
  return (
    <LottieWrapper
      animationData={animationData}
      complete={complete}
      loop={true}
      speed={1}
      style={{
        width: '200px',
        alignSelf: 'center'
      }}
    />
  );
};
