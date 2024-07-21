export type LogLevelType = 'log' | 'warn' | 'error';

export type LogFnType = {
  (message?: any, ...optionalParams: any[]): void
};
