import React, { ReactElement } from 'react';
import { LottiePropTypes } from './lottie.types';
import { LottieWrapper } from './LottieWrapper';
// @ts-ignore
import * as animationData from './files/beta-badge.json';

export const BetaBadgeLottie: React.FC<LottiePropTypes> = ({
  complete,
}): ReactElement => {
  return (
    <LottieWrapper
      animationData={animationData}
      complete={complete}
      loop={false}
      speed={1}
      style={{
        width: '300px',
        alignSelf: 'center',
      }}
    />
  );
};
