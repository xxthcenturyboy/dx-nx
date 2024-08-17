import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import axios,
{
  AxiosError,
  AxiosResponse
} from 'axios';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';

import { store } from '@dx/store-web';
import { authActions } from '@dx/auth-web';
import {
  uiActions
} from '@dx/ui-web';
import { WebConfigService } from '@dx/config-web';
import { logger } from '@dx/logger-web';
import {
  AxiosInstanceHeadersParamType,
  AxiosBaseQueryParamsType,
  RequestResponseType,
  CustomResponseErrorType
} from './axios-web.types';
import { regexMatchNumberGroups } from '@dx/util-regex';

export const AxiosInstance = ({ headers }: AxiosInstanceHeadersParamType) => {
  const URLS = WebConfigService.getWebUrls();
  // const ROUTES = WebConfigService.getWebRoutes();
  const API_URI = `${URLS.API_URL}/api/`;
  // const LOGIN_URI = `${URLS.WEB_APP_URL}${ROUTES.AUTH.LOGIN}`;

  const instance = axios.create({
    baseURL: API_URI,
    headers: {
      ...headers
    }
  });

  instance.interceptors.request.use(
    (config) => {
      const accessToken = store.getState().auth.token;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      config.withCredentials = true;
      return config;
    },
    (error: AxiosError) => {
      logger.error('error caught in interceptor', error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError<{ description: string, message: string, status: number, url: string }>) => {
      if (
        error.response.status === 403 &&
        error.response.data.message === 'Token invalid or expired.'
      ) {
        const accessToken = store.getState().auth.token;
        if (accessToken) {
          try {
            const response: AxiosResponse<{ accessToken: string }> = await axios.get(`${API_URI}/v1/auth/refresh-token`, {
              withCredentials: true,
            });

            if (response.data.accessToken) {
              // Update the access token in the store
              store.dispatch(authActions.tokenAdded(response.data.accessToken));
              // Retry the original request with the new access token
              error.config.headers.authorization = `Bearer ${response.data.accessToken}`;
              return axios.request(error.config);
            }

            return Promise.reject({
              response: {
                data: {
                  message: 'Access token failed to refresh.'
                },
                status: 403
              }
            });
          } catch (refreshError) {
            // TODO: Find a better way - Lgout too?
            // window.location.assign(LOGIN_URI);
            logger.error('Refresh token could not refresh.');
            return Promise.reject(refreshError);
          }
        } else {
          // TODO: Find a better way - Lgout too?
          // window.location.assign(LOGIN_URI);;
          logger.error('accessToken not found.');
          return Promise.reject({
            response: {
              data: {
                message: 'No access token.'
              },
              status: 403
            }
          });
        }
      } else if (error.response.status === 429) {
        return Promise.reject(error);
      } else {
        // logger.error('Error in AxiosInstance', error);
        // const message = error.response.status !== 500
        //   ? error.response.data.message
        //   : error.message;
        // handleNotification(message);
        return Promise.reject(error);
      }
    }
  );

  return instance;
};

function handleNotification(message?: string): void {
  // const ROUTES = WebConfigService.getWebRoutes();
  // const location = useLocation();
  // const dispatch = useAppDispatch();
  // if (location.pathname !== ROUTES.MAIN) {
    if (!store.getState().ui.isShowingUnauthorizedAlert) {
      const msg = message
        ? message
        : `Something went wrong. It's probably our fault. Please try again later.`;
      store.dispatch(uiActions.setIsShowingUnauthorizedAlert(true));
      toast.warn(msg, {
        onClose: () =>
          store.dispatch(uiActions.setIsShowingUnauthorizedAlert(false)),
      });
    }
  // }
}

function parseErrorCodeFromResponse  (message: string): { errorCode: string, messageReduced: string } {
  const numberGroups = message.match(regexMatchNumberGroups);
  let errorCode: string | undefined;
  let messageReduced: string | undefined;
  if (
    numberGroups
    && numberGroups.length
    && numberGroups[0].charAt(0) === message.charAt(0)
  ) {
    errorCode = numberGroups[0];
    messageReduced = message.substring(errorCode.length + 1);
  }

  return {
    errorCode,
    messageReduced
  };
}

export const axiosBaseQuery = ({ baseUrl } = { baseUrl: '' }): BaseQueryFn<AxiosBaseQueryParamsType, unknown, CustomResponseErrorType> =>
  async <TReturnData>({
    url,
    method,
    data,
    params,
    headers
  }: AxiosBaseQueryParamsType): Promise<RequestResponseType<TReturnData>> => {
    try {
      const axiosInstance = AxiosInstance({
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });
      const result = await axiosInstance<TReturnData>({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return {
        data: result.data,
        status: result.status,
        meta: {
          url,
          method,
          data,
          params
        }
      };
    } catch (axiosError) {
      const err = axiosError as AxiosError<{ description: string, message: string, status: number, url: string }>;
      const message = err.response.data.message || 'Oops! Something went wrong. It\'s probably our fault. Please try again later.';
      logger.error('Error in axiosBaseQuery', err);
      if (err.status === 500) {
        store.dispatch(uiActions.apiDialogSet('Oops! Something went wrong. It\'s probably our fault. Please try again later.'));
      }

      const {
        errorCode,
        messageReduced
      } = parseErrorCodeFromResponse(message);

      return {
        error: {
          status: err.response.status,
          code: errorCode,
          data: err.stack,
          error: messageReduced || message
        },
      }
    }
};
