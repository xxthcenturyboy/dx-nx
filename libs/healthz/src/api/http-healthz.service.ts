import { HttpHealthzResponseType } from "../model/healthz.types";

export class HttpHealthzService {
  public getMessage(): HttpHealthzResponseType {
    return { message: 'Welcome to the api.' };
  }
}

export type HttpHealthzServiceType = typeof HttpHealthzService.prototype;
