import axios from 'axios';

describe('Root Routes', () => {
  describe('GET /api/healthz', () => {
    it('should return a message when queried', async () => {
      // arrange
      // act
      const res = await axios.get(`/api/healthz`);
      // assert
      expect(res.status).toBe(200);
    });
  });
});
