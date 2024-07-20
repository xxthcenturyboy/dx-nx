import React, { ReactElement } from 'react';

import { LottiePropTypes } from './lottieTypes';
import { LottieWrapper } from './LottieWrapper';
// @ts-ignore
import * as animationData from './files/access-denied.json';

export const LottieAccessDenied: React.FC<LottiePropTypes> = ({ complete }): ReactElement => {
  return (
    <LottieWrapper
      animationData={animationData}
      complete={complete}
      loop={true}
      speed={0.5}
      style={{
        width: '200px',
        alignSelf: 'center'
      }}
    />
  );
};
