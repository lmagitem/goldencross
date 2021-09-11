import { Component } from '@angular/core';
import { StateService } from 'src/app/services/state/state.service';
import {
  initialLoggingStatus,
  LoggingService,
} from 'src/app/services/logging/logging.service';
import { LogType } from '../../shared/enums/log-type.enum';
import { DataProcessingService } from 'src/app/services/data-processing/data-processing.service';
import { first } from 'rxjs/operators';
import { Stock } from 'src/app/shared/models/stock.model';

/** The main page of the app where one can find all the features neatly stored into a beautiful accordion. */
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  /** Is logging enabled for Json Parsing? */
  jsonLog =
    initialLoggingStatus.find((o) => o.type === LogType.JSON_PARSING)
      ?.enabled || false;
  /** Is logging enabled for the analysis process? */
  analysisLog =
    initialLoggingStatus.find((o) => o.type === LogType.ANALYSIS_PROCESS)
      ?.enabled || false;
  /** Can the user see the advanced buttons? */
  advancedButtonsEnabled = false;

  constructor(
    private stateService: StateService,
    private loggingService: LoggingService,
    private dataProcessingService: DataProcessingService
  ) {}

  /** Sets the visibility of all columns to true. */
  public showColumns() {
    this.stateService.showColumns();
  }

  /** Sets the visibility of all columns to true. */
  public showAllColumns() {
    this.stateService.showAllColumns();
  }

  /** Erases the app's data from the user local storage. */
  public clearLocalStorage() {
    this.stateService.clearLocalStorage();
  }

  /** When the button to enable logging is clicked, enable/disable logging. */
  public switchLogging(type: 'proc' | 'json') {
    switch (type) {
      case 'proc':
        this.analysisLog = !this.analysisLog;
        this.loggingService.enableLog(
          LogType.ANALYSIS_PROCESS,
          this.analysisLog
        );
        break;
      case 'json':
        this.jsonLog = !this.jsonLog;
        this.loggingService.enableLog(LogType.JSON_PARSING, this.jsonLog);
        break;
      default:
        break;
    }
  }
}
