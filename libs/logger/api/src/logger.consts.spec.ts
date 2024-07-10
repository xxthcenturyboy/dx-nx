import { LOGGER_ENTITY_NAME, LOG_LEVEL } from './logger.consts';

describe('LOGGER_ENTITY_NAME ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(LOGGER_ENTITY_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    expect(LOGGER_ENTITY_NAME).toEqual('logger');
  });
});

describe('LOG_LEVEL ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(LOG_LEVEL).toBeDefined();
  });

  it('should have correct values', () => {
    expect(LOG_LEVEL.DEBUG).toEqual('debug');
    expect(LOG_LEVEL.ERROR).toEqual('error');
    expect(LOG_LEVEL.INFO).toEqual('info');
    expect(LOG_LEVEL.WARN).toEqual('warn');
  });
});
