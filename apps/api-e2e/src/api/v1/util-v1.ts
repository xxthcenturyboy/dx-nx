import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';

import { LoginPaylodType } from 'libs/auth/src/model/auth.types';
import { UserProfileStateType } from '@dx/user';
import {
  TEST_EXISTING_EMAIL,
  TEST_EXISTING_PASSWORD
} from '@dx/config';

export class AuthUtil {
  cookies: Record<string, string>;
  cookeisRaw: string[];

  private setCookies(cookies: string[]) {
    this.cookeisRaw = cookies;
    if (Array.isArray(cookies)) {
      for (const cookie of cookies) {
        let property = cookie.slice(0, cookie.indexOf('='));
        let value = cookie.slice(cookie.indexOf('=') + 1);
        this.cookies = {
          ...this.cookies,
          [property]: value
        }
      }
    }
  }

  public async login() {
    const paylod: LoginPaylodType = {
      value: TEST_EXISTING_EMAIL,
      password: TEST_EXISTING_PASSWORD
    };

    const request: AxiosRequestConfig = {
      url: '/api/v1/auth/login',
      method: 'POST',
      data: paylod
    };

    try {
      const response = await axios.request<UserProfileStateType>(request);
      this.setCookies(response.headers['set-cookie']);
      return response.data;
    } catch (err) {
      const typedError = err as AxiosError;
      console.error(
        typedError.response.status,
        // @ts-expect-error - type is bad
        typedError.response.data.message
      );
    }

    return false;
  }
}

export type AuthUtilType = typeof AuthUtil.prototype;
