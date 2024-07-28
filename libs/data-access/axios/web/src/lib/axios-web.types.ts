import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import {
  AxiosHeaders,
  HeadersDefaults,
  HttpStatusCode,
  Method,
  RawAxiosRequestHeaders
} from 'axios';

export type AxiosInstanceHeadersParamType = {
  headers: AxiosHeaders | Partial<HeadersDefaults> | RawAxiosRequestHeaders;
};

export type AxiosBaseQueryParamsType = {
  url?: string;
  method?: Method | string;
  data: unknown;
  params: unknown;
  headers: (RawAxiosRequestHeaders & AxiosHeaders) | AxiosHeaders
};

type BaseQueryResponseType<T> = {
  data?: T | T[] | string;
  status?: HttpStatusCode;
};

export type RequestResponseType<T> = {
  error?: BaseQueryResponseType<T>
} & BaseQueryResponseType<T> & QueryReturnValue;

export type JSONObject = {
  [key: string]: string | number | boolean | JSONObject;
};
