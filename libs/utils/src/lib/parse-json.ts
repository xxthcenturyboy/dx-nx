import { ApiLoggingClass } from "@dx/logger";

export function parseJson<TData>(stringToParseToJson: string): TData | null {
  if (
    stringToParseToJson
    && typeof stringToParseToJson === 'string'
  ) {
    try {
      return JSON.parse(stringToParseToJson) as TData;
    } catch (err) {
      ApiLoggingClass.instance.logError(err.message);
    }
  }

  return stringToParseToJson as TData;
};
