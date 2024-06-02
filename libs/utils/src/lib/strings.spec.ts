import {
  stringToTitleCase,
  uppercase
} from './strings.util';

describe('stringToTitleCase', () => {
  // arrange
  const stringToTransform = 'lowercase';
  // act
  const transformed = stringToTitleCase(stringToTransform);
  // assert
  it('should transform a string to Title case when called', () => {
    expect(transformed).toEqual('Lowercase');
  });
});

describe('uppercase', () => {
  // arrange
  const stringToTransform = 'lowercase';
  // act
  const transformed = uppercase(stringToTransform);
  // assert
  it('should transform a string to UPPER case when called', () => {
    expect(transformed).toEqual('LOWERCASE');
  });
});
