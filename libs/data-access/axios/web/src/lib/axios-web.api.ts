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
import {
  API_HOST_PORT,
  API_URL,
  WEB_URL
} from '@dx/config-shared';
import { WebConfigService } from '@dx/config-web';
import { logger } from '@dx/logger-web';
import {
  AxiosInstanceHeadersParamType,
  AxiosBaseQueryParamsType,
  RequestResponseType
} from './axios-web.types';

export const AxiosInstance = ({ headers }: AxiosInstanceHeadersParamType) => {
  const apiUri = `${API_URL}:${API_HOST_PORT}/api/`;
  // const [
  //   requestLogout,
  //   {
  //     data,
  //     error,
  //     isLoading
  //   }
  // ] = useLogoutMutation();

  const instance = axios.create({
    baseURL: apiUri,
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
      return response.data;
    },
    async (error: AxiosError<{ error: string }>) => {
      if (
        error.response.status === 403 &&
        error.response.data.error === 'Forbidden: JWT token expired!'
      ) {
        const accessToken = store.getState().auth.token;
        const ROUTES = WebConfigService.getWebRoutes();
        if (accessToken) {
          try {
            const response = await axios.get(`${apiUri}/users/refresh`, {
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
            const url = `${WEB_URL}${ROUTES.AUTH.LOGIN}`;
            typeof window !== 'undefined' && window.location.replace(url);
            logger.error('Refresh token could not refresh.', refreshError);
            handleNotification();
            return Promise.reject(refreshError);
          }
        } else {
          // If no refresh token is found, redirect to the login page
          const url = `${WEB_URL}${ROUTES.AUTH.LOGIN}`;
          typeof window !== 'undefined' && window.location.replace(url);
          logger.error('accessToken not found.');
          handleNotification();
        }
      } else {
        logger.error('Error in AxiosInstance', error);
        handleNotification();
        return Promise.reject(error);
      }
    }
  );

  return instance;
};

function handleNotification(): void {
  // const ROUTES = WebConfigService.getWebRoutes();
  // const location = useLocation();
  // const dispatch = useAppDispatch();
  // if (location.pathname !== ROUTES.MAIN) {
    if (!store.getState().ui.isShowingUnauthorizedAlert) {
      const message = `🤷‍♂️ You are not logged in or authorized to make this request`;
      store.dispatch(uiActions.setIsShowingUnauthorizedAlert(true));
      toast.warn(message, {
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
      console.log(axiosInstance.defaults);
      console.log('url', baseUrl + url);
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
