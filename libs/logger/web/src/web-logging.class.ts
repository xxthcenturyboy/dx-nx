import {
  LogFnType,
  LogLevelType
} from './web-logging.types';

const NO_OP: LogFnType = (message?: any, ...optionalParams: any[]) => {};

export class WebLoggingClass {
  readonly log: LogFnType;
  readonly warn: LogFnType;
  readonly error: LogFnType;

  constructor(options?: { level?: LogLevelType }) {
    const { level } = options || {};

    this.error = console.error.bind(console);

    if (level === 'error') {
      this.warn = NO_OP;
      this.log = NO_OP;

      return;
    }

    this.warn = console.warn.bind(console);

    if (level === 'warn') {
      this.log = NO_OP;

      return;
    }

    this.log = console.log.bind(console);
  }
}

// TODO: determine log level @ run / build via env
export const logger = new WebLoggingClass({ level: 'log' });
export type WebLoggingClassType = typeof WebLoggingClass.prototype;
