import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import axios,
{
  AxiosError,
  AxiosResponse
} from 'axios';
import { toast } from 'react-toastify';

import { store } from '@dx/store-web';
import {
  authActions,
  // useLogoutMutation
} from '@dx/auth-web';
import { uiActions } from '@dx/ui-web';
import { WebConfigService } from '@dx/config-web';
import { logger } from '@dx/logger-web';
import {
  AxiosInstanceHeadersParamType,
  AxiosBaseQueryParamsType,
  RequestResponseType
} from './axios-web.types';

export const AxiosInstance = ({ headers }: AxiosInstanceHeadersParamType) => {
  const URLS = WebConfigService.getWebUrls();
  const ROUTES = WebConfigService.getWebRoutes();
  const API_URI = `${URLS.API_URL}/api/`;
  const LOGIN_URI = `${URLS.WEB_APP_URL}${ROUTES.AUTH.LOGIN}`;
  // const [
  //   requestLogout,
  //   {
  //     data,
  //     error,
  //     isLoading
  //   }
  // ] = useLogoutMutation();

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
        config.withCredentials = true;
      }

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
        error.response.data.message === 'Forbidden: JWT token expired!'
      ) {
        const accessToken = store.getState().auth.token;
        if (accessToken) {
          try {
            const response = await axios.get(`${API_URI}/users/refresh`, {
              withCredentials: true,
            });

            const newAccessToken = response.data;
            // Update the access token in local storage
            store.dispatch(authActions.tokenAdded(newAccessToken));

            // Retry the original request with the new access token
            error.config.headers.authorization = `Bearer ${newAccessToken}`;

            return axios.request(error.config);
          } catch (refreshError) {
            // If refresh token is expired or invalid, redirect to the login page
            typeof window !== 'undefined' && window.location.replace(LOGIN_URI);
            logger.error('Refresh token could not refresh.', refreshError);
            handleNotification(`🤷‍♂️ You are not logged in or authorized to make this request`);
            return Promise.reject(refreshError);
          }
        } else {
          // If no refresh token is found, redirect to the login page
          typeof window !== 'undefined' && window.location.replace(LOGIN_URI);
          logger.error('accessToken not found.');
          handleNotification(`🤷‍♂️ You are not logged in or authorized to make this request`);
        }
      } else {
        logger.error('Error in AxiosInstance', error);
        const message = error.response.status !== 500
          ? error.response.data.message
          : error.message;
        handleNotification(message);
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
        : `Something went wrong. It's likely our fault. Please try again later.`;
      store.dispatch(uiActions.setIsShowingUnauthorizedAlert(true));
      toast.warn(msg, {
        onClose: () =>
          store.dispatch(uiActions.setIsShowingUnauthorizedAlert(false)),
      });
    }
  // }
}

export const axiosBaseQuery = ({ baseUrl } = { baseUrl: '' }): BaseQueryFn =>
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
      const err = axiosError as AxiosError;
      const data = err.message;
      // const data = err.response?.data as TReturnData || err.message;
      logger.error('Error in axiosBaseQuery', data);
      return {
        error: {
          status: err.response?.status,
          data: data,
        },
      }
    }
};
