import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { LOG_LEVEL } from '../model/logger.consts';

export class ApiLoggingClass {
  appName: string;
  logger: typeof winston.Logger.prototype;

  constructor(params: { appName: string }) {
    this.logger = this.initializeWinston(params.appName);
  }

  public logInfo(msg: string, context?: object) {
    this.log(msg, LOG_LEVEL.INFO, context);
  }

  public logWarn(msg: string, context?: object) {
    this.log(msg, LOG_LEVEL.WARN, context);
  }

  public logError(msg: string, context?: object) {
    this.log(msg, LOG_LEVEL.ERROR, context);
  }

  public logDebug(msg: string, context?: object) {
    if (process.env.NODE_ENV !== 'production') {
      this.log(msg, LOG_LEVEL.DEBUG, context); // Don't log debug in production
    }
  }

  private log(msg: string, level: string, context?: object) {
    this.logger.log(level, msg, { context: context });
  }

  private initializeWinston(appName: string) {
    const logger = winston.createLogger({
      transports: ApiLoggingClass.getTransports(appName),
    });
    return logger;
  }

  private static getTransports(appName: string) {
    const transports: Array<any> = [
      new winston.transports.Console({
        format: this.getFormatForConsole(),
      }),
    ];

    if (process.env.NODE_ENV === 'production') {
      transports.push(this.getFileTransport(appName)); // Also log file in production
    }

    return transports;
  }

  private static getFormatForConsole() {
    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(
        info =>
          `[${info.timestamp}] [${info.level.toUpperCase()}]: ${
            info.message
          } ${
            info.context
              ? ' [CONTEXT] -> \n ' + JSON.stringify(info.context, null, 2)
              : ''
          }`
      ),
      winston.format.colorize({ all: true })
    );
  }

  private static getFileTransport(appName: string) {
    return new DailyRotateFile({
      filename: `${appName}-%DATE%.log`,
      zippedArchive: true, // Compress gzip
      maxSize: '10m', // Rotate after 10MB
      maxFiles: '14d', // Only keep last 14 days
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format(info => {
          console.log(info);
          info.app = appName;
          return info;
        })(),
        winston.format.json()
      ),
    });
  }
}

export type ApiLoggingClassType = typeof ApiLoggingClass.prototype;
