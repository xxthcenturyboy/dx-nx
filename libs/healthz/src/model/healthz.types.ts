import { Express } from "express";

export type HttpHealthzResponseType = {
  message: string;
};

export type HealthzRoutesParams = {
  app: Express;
}
