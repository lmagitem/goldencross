import { Component, OnInit } from '@angular/core';
import { LogType } from '../shared/services/log-type.enum';
import {
  initialLoggingStatus,
  LoggingService,
} from '../shared/services/logging.service';
import { CalculatorService } from './calculator.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnInit {
  /** Is logging enabled for Json Parsing? */
  jsonLog =
    initialLoggingStatus.find((o) => o.type === LogType.JSON_PARSING)
      ?.enabled || false;
  /** Is logging enabled for the analysis process? */
  analysisLog =
    initialLoggingStatus.find((o) => o.type === LogType.ANALYSIS_PROCESS)
      ?.enabled || false;

  constructor(
    private calculatorService: CalculatorService,
    private loggingService: LoggingService
  ) {}

  ngOnInit(): void {}

  /** Sets the visibility of all columns to true. */
  public showColumns() {
    this.calculatorService.showColumns();
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
