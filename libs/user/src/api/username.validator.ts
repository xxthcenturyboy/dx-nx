import { regexNoWhiteSpaceString } from "@dx/utils";

export function usernameValidator(username: string): boolean {
  return typeof username === 'string' && regexNoWhiteSpaceString.test(username);
};
