import axios, {
  AxiosResponse
} from 'axios';

import {
  HealthzStatusType,
  STATUS_OK
} from '@dx/healthz';

describe('Root Routes', () => {
  describe('GET /api/healthz', () => {
    it('should return healthz info when queried', async () => {
      // arrange
      let res: AxiosResponse<HealthzStatusType>;
      // act
      res = await axios.get(`/api/healthz`);
      // assert
      expect(res.status).toBe(200);
      expect(res.data).toBeDefined();
      expect(res.data.status).toBe(STATUS_OK);
      expect(res.data.http.status).toBe(STATUS_OK);
      expect(res.data.memory.status).toBe(STATUS_OK);
      expect(res.data.postgres.status).toBe(STATUS_OK);
      expect(res.data.redis.status).toBe(STATUS_OK);
    });
  });
});
