import { regexNoWhiteSpaceString } from '@dx/util-regex';

export function usernameValidator(username: string): boolean {
  return typeof username === 'string' && regexNoWhiteSpaceString.test(username);
}
