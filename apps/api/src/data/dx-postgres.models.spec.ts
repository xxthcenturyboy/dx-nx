import {
  getPostgresModels,
  logLoadedPostgresModels
} from './dx-postgres.models';

describe('getPostgresModels', () => {
  it('should exist', () => {
    // arrange
    // act
    // assert
    expect(getPostgresModels).toBeDefined();
  });

  it('should return an array of models when invoked', () => {
    // arrange
    // act
    const models = getPostgresModels();
    // assert
    expect(models).toBeDefined();
    expect(models).toHaveLength(4);
  });
});

describe('logLoadedPostgresModels', () => {
  beforeEach(() => {
    jest.spyOn(console, 'table').mockImplementation(() => {});
  });

  it('should exist', () => {
    // arrange
    // act
    // assert
    expect(logLoadedPostgresModels).toBeDefined();
  });

  it('should print a table of models when invoked', () => {
    // arrange
    // act
    logLoadedPostgresModels();
    // assert
    expect(console.table).toHaveBeenCalled();
  });
});
