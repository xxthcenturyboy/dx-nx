export class ApiLoggingClass {
  appName: string;
  static #instance: ApiLoggingClass;

  constructor({ appName }) {
    this.appName = appName;
    ApiLoggingClass.#instance = this;
  }

  public static get instance() {
    return this.#instance;
  }

  public logInfo() {
    return true;
  }

  public logWarn() {
    return true;
  }

  public logError() {
    return true;
  }

  public logDebug() {
    return true;
  }
}
