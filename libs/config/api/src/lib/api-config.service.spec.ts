import {
  isDebug,
  isLocal,
  isProd,
  isStaging,
  isTest,
  getEnvironment,
  webDomain,
  webUrl
} from './api-config.service';

describe('getEnvironment', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(getEnvironment).toBeDefined();
  });
  it('should get values when invoked', () => {
    // arrange
    // act
    const env = getEnvironment();
    // assert
    expect(env).toBeDefined();
  });
});

describe('isDebug', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(isDebug).toBeDefined();
  });

  it('should return false when invoked', () => {
    // arrange
    // act
    const result = isDebug();
    // assert
    expect(result).toBe(false);
  });
});

describe('isLocal', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(isLocal).toBeDefined();
  });

  it('should return false when invoked.', () => {
    // arrange
    // act
    const result = isLocal();
    // assert
    expect(result).toBe(false);
  });
});

describe('isProd', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(isProd).toBeDefined();
  });

  it('should return false when invoked', () => {
    // arrange
    // act
    const result = isProd();
    // assert
    expect(result).toBe(false);
  });
});

describe('isStaging', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(isStaging).toBeDefined();
  });

  it('should return false when invoked', () => {
    // arrange
    // act
    const result = isStaging();
    // assert
    expect(result).toBe(false);
  });
});

describe('isTest', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(isTest).toBeDefined();
  });

  it('should return true when invoked', () => {
    // arrange
    // act
    const result = isTest();
    // assert
    expect(result).toBe(true);
  });
});

describe('webDomain', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(webDomain).toBeDefined();
  });

  it('should return correct value when invoked', () => {
    // arrange
    // act
    const result = webDomain();
    // assert
    expect(result).toEqual('http://localhost');
  });
});

describe('webUrl', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(webUrl).toBeDefined();
  });

  it('should return correct value when invoked', () => {
    // arrange
    // act
    const result = webUrl();
    // assert
    expect(result).toEqual('http://localhost:4200');
  });
});
