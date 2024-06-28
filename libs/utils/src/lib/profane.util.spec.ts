import { ApiLoggingClass } from "@dx/logger";
import {
  ProfanityFilter,
  ProfanityFilterType
} from './profane.util';

describe('profane.util', () => {
  let profaneUtil: ProfanityFilterType;

  beforeAll(() => {
    profaneUtil = new ProfanityFilter();
    new ApiLoggingClass({ appName: 'test' });
  });

  test('should return true when passed a profane word in a string', () => {
    // arrange
   const isProfane = profaneUtil.isProfane('That person is an asshole.');
    // act
    // assert
    expect(isProfane).toBe(true);
  });

  test('should return true when passed a custom profane word in a string', () => {
    // arrange
   const isProfane = profaneUtil.isProfane('That person is a custom-test.');
    // act
    // assert
    expect(isProfane).toBe(true);
  });

  test('should remove profanity from a string when passed a profane word in a string', () => {
    // arrange
   const cleaned = profaneUtil.cleanProfanity('That person is an asshole.');
    // act
    // assert
    expect(cleaned).toEqual('That person is an *******.');
  });

  test('should return false when passed a bgngin string', () => {
    // arrange
   const isProfane = profaneUtil.isProfane('I love that person so much.');
    // act
    // assert
    expect(isProfane).toBe(false);
  });
});
