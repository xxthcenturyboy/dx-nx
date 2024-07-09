import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

import { AuthSuccessResponseType, LoginPaylodType } from '@dx/auth';
import { TEST_EXISTING_EMAIL, TEST_EXISTING_PASSWORD } from '@dx/config-shared';

export class AuthUtil {
  accessToken: string;
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
          [property]: value,
        };
      }
    }
  }

  public async login(
    email?: string,
    password?: string
  ): Promise<AuthSuccessResponseType> {
    const payload: LoginPaylodType = {
      value: email || TEST_EXISTING_EMAIL,
      // password: password || 'akjd0023kakdj_**_('
      password: password || TEST_EXISTING_PASSWORD,
    };

    const request: AxiosRequestConfig = {
      url: '/api/v1/auth/login',
      method: 'POST',
      data: payload,
    };

    try {
      const response = await axios.request<AuthSuccessResponseType>(request);
      this.setCookies(response.headers['set-cookie']);
      this.accessToken = response.data.accessToken;
      return response.data;
    } catch (err) {
      const typedError = err as AxiosError;
      console.error(
        typedError.response.status,
        // @ts-expect-error - type is bad
        typedError.response.data.message
      );
    }

    return {
      accessToken: undefined,
      profile: undefined,
    };
  }

  public async loginEmalPasswordless(
    email: string,
    code: string
  ): Promise<AuthSuccessResponseType> {
    const request: AxiosRequestConfig = {
      url: '/api/v1/auth/login',
      method: 'POST',
      data: {
        code: code,
        value: email,
      },
    };

    try {
      const response = await axios.request<AuthSuccessResponseType>(request);
      this.setCookies(response.headers['set-cookie']);
      this.accessToken = response.data.accessToken;
      return response.data;
    } catch (err) {
      const typedError = err as AxiosError;
      console.error(
        typedError.response.status,
        // @ts-expect-error - type is bad
        typedError.response.data.message
      );
    }

    return {
      accessToken: undefined,
      profile: undefined,
    };
  }

  public getHeaders() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      cookie: this.cookeisRaw,
    };
  }
}

export type AuthUtilType = typeof AuthUtil.prototype;
