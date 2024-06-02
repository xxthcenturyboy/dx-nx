import axios from 'axios';

describe('Root Routes', () => {
  describe('GET /', () => {
    it('should return a message when queried', async () => {
      // arrange
      // act
      const res = await axios.get(`/`);
      // assert
      expect(res.status).toBe(200);
      expect(res.data).toEqual({ message: 'Welcome to the api.' });
    });
  });
});
