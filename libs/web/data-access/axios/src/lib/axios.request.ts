// import React from 'react';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';

import getCSRFToken from 'client/core/getCSRFToken';
import settings from 'settings';
import LoggerClass from 'client/core/logger';
import { JSONObject } from 'shared/types/misc';
import { RootState, store } from 'client/store';
import fetchLogout from 'client/Auth/actions/logout';
import { toast } from 'react-toastify';
import { allRoutes } from 'client/routes';
import { actions as appActions } from 'client/App';
import { ERROR_MSG_API } from 'client/core/constants';
import { getCookie } from 'client/core/browser/cookies';
import { DateUtil } from 'shared/utils';
import { selectIsAuthenticated } from 'client/UserProfile/selectors';

type StandardHeaderData = {
  'Content-Type': string;
  'CSRF-Token': string;
};

type RequestResponse = {
  code?: number;
  data?: JSONObject | JSONObject[] | string;
  success: boolean;
};

export class RequestClass {
  constructor() {
    this.baseUrl = settings.APP_HOST
      ? `${settings.APP_HOST}:${settings.APP_PORT}/api`
      : '/api';
    this.includeAlerts = true;
    this.timeout = 10000;
    this.toastRef = null;
    this.debug = settings.DEBUG || false;
  }

  baseUrl: string;
  debug: boolean;
  includeAlerts: boolean;
  timeout: number;
  toastRef: any;

  private _standardHeaderData(): StandardHeaderData {
    return {
      'Content-Type': 'application/json',
      'CSRF-Token': getCSRFToken(),
    };
  }

  private _commonConfig(): AxiosRequestConfig {
    return {
      baseURL: this.baseUrl,
      headers: this._standardHeaderData(),
      timeout: this.timeout,
      withCredentials: true,
      responseType: 'json',
      validateStatus: (status) => status >= 200 && status < 500,
    };
  }

  public getAxiosConfig(method: Method): AxiosRequestConfig {
    const common = this._commonConfig();
    return {
      ...common,
      method,
    };
  }

  private _parseError(response: AxiosResponse): string {
    const msg = (response.data.message as string) || '';
    return msg;
  }

  private _handleError(message: string): void {
    LoggerClass.logError(message);
  }

  private _handleNotification(): void {
    const state: RootState = store.getState();
    if (state.router.location.pathname !== allRoutes.main) {
      const msg = `🤷‍♂️ You are not logged in or authorized to make this request`;
      if (!state.app.isShowingUnauthorizedAlert) {
        store.dispatch(appActions.setIsShowingLogoutAlert(true));
        toast.warn(msg, {
          onClose: () =>
            store.dispatch(appActions.setIsShowingLogoutAlert(false)),
        });
      }
    }
  }

  private _logout() {
    store.dispatch(fetchLogout());
    this._handleNotification();
    const url = `${settings.APP_URL}${allRoutes.login}`;
    typeof window !== 'undefined' && window.location.replace(url);
  }

  private async refreshToken(): Promise<boolean> {
    const config = this.getAxiosConfig('POST');
    config.url = '/v1/auth/refresh-token';

    try {
      const response = await axios.request(config);
      if (
        axios.isAxiosError(response) ||
        (response as AxiosResponse).status !== 200
      ) {
        const message = this._parseError(response);
        this._handleError(message);
        this._logout();
        return false;
      }

      const data = response.data as unknown as string;
      return data === 'Tokens Reissued';
    } catch (err) {
      const message: string = err.message || err;
      this._handleError(message);
      return false;
    }
  }

  private checkTokenExpiration(): 'no cookie' | 'expired' | 'ok' {
    const cookieValue = getCookie('exp');

    if (!cookieValue) {
      return 'no cookie';
    }

    const tokenExpTime = Number(cookieValue);
    const expLimit = DateUtil.getTimestamp();

    if (tokenExpTime < expLimit) {
      return 'expired';
    }

    return 'ok';
  }

  private isAuthenticated(): boolean {
    const state = store.getState();
    if (!state) {
      return false;
    }

    return selectIsAuthenticated(state);
  }

  public async fireRequest(
    config: AxiosRequestConfig,
    fromLogoutDispatch?: boolean
  ): Promise<RequestResponse> {
    if (!config) {
      throw new Error('No config sent to Request');
    }

    // const shouldCheckToken = this.isAuthenticated();

    if (this.isAuthenticated()) {
      const tokenStatus = this.checkTokenExpiration();
      if (tokenStatus === 'no cookie') {
        !fromLogoutDispatch && this._logout();
        throw new Error('Could not parse cookie');
      }
      if (tokenStatus === 'expired') {
        const refreshed = await this.refreshToken();
        if (!refreshed) {
          !fromLogoutDispatch && this._logout();
          throw new Error('failed to refresh the token');
        }
      }
    }

    const result: RequestResponse = {
      success: false,
    };

    try {
      const response = await axios.request(config);

      if (
        axios.isAxiosError(response) ||
        (response as AxiosResponse).status !== 200
      ) {
        const message = this._parseError(response);
        this._handleError(message);

        if ((response as AxiosResponse).status === 401) {
          this._logout();
        }
        if ((response as AxiosResponse).status === 400 && this.includeAlerts) {
          store.dispatch(appActions.setAppDialog(null));
          store.dispatch(
            appActions.setApiDialog(this.debug ? message : ERROR_MSG_API)
          );
        }

        result.data = { message };
        result.code = (response as AxiosResponse).status;
        return result;
      }

      result.success = true;
      result.data = response.data;
      return result;
    } catch (err) {
      const message: string = err.message || err;
      this._handleError(message);
      result.data = { message };
      return result;
    }
  }
}
