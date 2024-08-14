import {
  BaseQueryFn,
} from '@reduxjs/toolkit/query/react';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import {
  AxiosHeaders,
  AxiosRequestConfig,
  HeadersDefaults,
  HttpStatusCode,
  Method,
  RawAxiosRequestHeaders
} from 'axios';

export type AxiosInstanceHeadersParamType = {
  headers: AxiosHeaders | Partial<HeadersDefaults> | RawAxiosRequestHeaders;
};

export type AxiosBaseQueryParamsType = {
  url: string;
  method?: Method;
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: (RawAxiosRequestHeaders & AxiosHeaders) | AxiosHeaders
};

export type BaseQueryFnType = BaseQueryFn<any, unknown, CustomResponseErrorType, {}>;

export type CustomResponseErrorType = {
  status: number,
  code?: string;
  data?: string;
  error: string;
};

type BaseQueryResponseType<T> = {
  data?: T | T[] | string;
  status?: HttpStatusCode;
};

export type RequestResponseType<T> = {
  error?: CustomResponseErrorType
} & BaseQueryResponseType<T> & QueryReturnValue<T, CustomResponseErrorType, any>;

export type JSONObject = {
  [key: string]: string | number | boolean | JSONObject;
};
