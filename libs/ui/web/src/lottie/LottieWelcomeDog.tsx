import React, { ReactElement } from 'react';
import { LottiePropTypes } from './lottieTypes';
import { LottieWrapper } from './LottieWrapper';
// @ts-ignore
import * as animationData from './files/hot-dog-man.json';

export const LottieWelcomeDog: React.FC<LottiePropTypes> = ({ complete }): ReactElement => {
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
