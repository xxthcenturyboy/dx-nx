import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';

describe('v1 Email Routes', () => {
  describe('POST /api/v1/email/validate-email', () => {
    test('should return an error when token is not sent', async () => {
      const paylod = {
        token: ''
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/email/validate-email',
        method: 'POST',
        data: paylod
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('No Token for validate email.');
      }
    });

    test('should return an error when token does not exist', async () => {
      const paylod = {
        token: 'invalid-token'
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/email/validate-email',
        method: 'POST',
        data: paylod
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual(`Email could not be found with the token: ${paylod.token}`);
      }
    });
  });
});
