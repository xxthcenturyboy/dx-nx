import { dataAccessSocketIo } from './data-access-socket-io';

describe('dataAccessSocketIo', () => {
  it('should work', () => {
    expect(dataAccessSocketIo()).toEqual('data-access-socket-io');
  });
});
