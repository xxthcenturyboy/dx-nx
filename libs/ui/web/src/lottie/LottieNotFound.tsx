import React, { ReactElement } from 'react';
import { LottiePropTypes } from './lottieTypes';
import { LottieWrapper } from './LottieWrapper';
// @ts-ignore
import * as animationData from './files/not-found.json';

export const LottieNotFound: React.FC<LottiePropTypes> = ({ complete }): ReactElement => {
  return (
    <LottieWrapper
      animationData={animationData}
      complete={complete}
      loop={true}
      speed={0.5}
      style={{
        width: '300px',
        alignSelf: 'center'
      }}
    />
  );
};
