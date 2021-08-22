import { Injectable } from '@angular/core';
import { LogType } from './log-type.enum';

/** Simple interface to remember what to log. */
interface EnabledByType {
  type: LogType;
  enabled: boolean;
}

/** Initial values for logging. */
export const initialLoggingStatus = [
  {
    type: LogType.JSON_PARSING,
    enabled: false,
  },
];

/** A service that manages logging. Nothing more. */
@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  /** Remembers what should be logged or not. */
  private loggingStatus: Array<EnabledByType> = initialLoggingStatus;

  /** Logs the given arguments if logging is enabled for the given type. */
  public log(type: LogType, firstElement: any, secondElement: any = '📝') {
    const enabledByType = this.loggingStatus.find((o) => o.type === type);
    if (enabledByType !== undefined && enabledByType.enabled) {
      console.log(firstElement, secondElement);
    }
  }

  /** Changes the logging status for the given type. */
  public enableLog(type: LogType, value: boolean) {
    const enabledByType = this.loggingStatus.find((o) => o.type === type);
    if (enabledByType === undefined) {
      this.loggingStatus.push({ type, enabled: value });
    } else {
      enabledByType.enabled = value;
    }
  }
}
