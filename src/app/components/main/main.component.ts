import { Component, OnInit } from '@angular/core';
import { LogType } from '../../shared/enums/log-type.enum';
import { DataService } from '../../services/data.service';
import {
  initialLoggingStatus,
  LoggingService,
} from 'src/app/services/logging.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
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
    private dataService: DataService,
    private loggingService: LoggingService
  ) {}

  ngOnInit(): void {}

  /** Sets the visibility of all columns to true. */
  public showColumns() {
    this.dataService.showColumns();
  }

  /** Erases the app's data from the user local storage. */
  public clearLocalStorage() {
    this.dataService.clearLocalStorage();
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
