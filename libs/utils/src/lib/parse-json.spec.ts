import { parseJson } from './parse-json';

describe('parseJson', () => {
  // arrange
  type ParsedDataType = { test: string; };
  const data: ParsedDataType = { test: 'test' };
  // act
  const transformed = parseJson<ParsedDataType>(JSON.stringify(data));
  // assert
  it('should transform a string to JSON when called', () => {
    expect(transformed).toBeDefined();
    expect(transformed).toEqual(data);
  });
});
