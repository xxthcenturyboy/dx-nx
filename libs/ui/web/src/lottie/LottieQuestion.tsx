import React, { ReactElement } from 'react';
import { LottiePropTypes } from './lottieTypes';
import { LottieWrapper } from './LottieWrapper';
// @ts-ignore
import * as animationData from './files/question-bubble.json';

export const LottieQuestionMark: React.FC<LottiePropTypes> = ({ complete }): ReactElement => {
  return (
    <LottieWrapper
      animationData={animationData}
      complete={complete}
      loop={false}
      speed={2}
      style={{
        width: '300px',
        alignSelf: 'center'
      }}
    />
  );
};
