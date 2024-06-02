import axios from 'axios';

describe('v1 Routes', () => {
  describe('GET /v1/healthz/http', () => {
    it('should return a message when queried', async () => {
      // arrange
      // act
      const res = await axios.get(`/v1/healthz/http`);
      // assert
      expect(res.status).toBe(200);
      expect(res.data).toEqual({ message: 'Welcome to the api.' });
    });
  });

  describe('GET /v1/user', () => {
    it('should return a message when queried', async () => {
      // arrange
      // act
      const res = await axios.get(`/v1/user`);
      // assert
      expect(res.status).toBe(200);
      expect(res.data).toEqual({ message: 'user' });
    });
  });
});
