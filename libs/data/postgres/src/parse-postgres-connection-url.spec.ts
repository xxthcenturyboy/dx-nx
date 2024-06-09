import { parsePostgresConnectionUrl } from './parse-postgres-connection-url';

describe('parsePostgresConnectionUrl', () => {
  // arrange
  const urlToParse = 'postgres://pguser:password@postgres:5432/app';
  // act
  const response = parsePostgresConnectionUrl(urlToParse);
  // assert
  it('should exist when imported', () => {
    expect(parsePostgresConnectionUrl).toBeDefined();
  });
  it('should parse the connection string when invoked.', () => {
    expect(response).toBeDefined();
    expect(response.host).toBeDefined();
    expect(response.host).toEqual('postgres:5432');
    expect(response.hostname).toBeDefined();
    expect(response.hostname).toEqual('postgres');
    expect(response.params).toBeDefined();
    expect(response.password).toBeDefined();
    expect(response.password).toEqual('password');
    expect(response.port).toBeDefined();
    expect(response.port).toEqual(5432);
    expect(response.protocol).toBeDefined();
    expect(response.protocol).toEqual('postgres');
    expect(response.segments).toBeDefined();
    expect(response.segments).toEqual(['app']);
    expect(response.user).toBeDefined();
    expect(response.user).toEqual('pguser');
  });
});
