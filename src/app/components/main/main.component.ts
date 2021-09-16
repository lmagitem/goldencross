import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/services/state/state.service';
import {
  initialLoggingStatus,
  LoggingService,
} from 'src/app/services/logging/logging.service';
import { LogType } from '../../shared/enums/log-type.enum';
import { DataProcessingService } from 'src/app/services/data-processing/data-processing.service';
import { SubSink } from 'subsink';

/** The main page of the app where one can find all the features neatly stored into a beautiful accordion. */
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  /** Subscription management. */
  private subs: SubSink = new SubSink();
  /** Is logging enabled for Json Parsing? */
  jsonLog =
    initialLoggingStatus.find((o) => o.type === LogType.JSON_PARSING)
      ?.enabled || false;
  /** Is logging enabled for data processing? */
  processingLog =
    initialLoggingStatus.find((o) => o.type === LogType.DATA_PROCESSING)
      ?.enabled || false;
  /** Is logging enabled for the analysis process? */
  analysisLog =
    initialLoggingStatus.find((o) => o.type === LogType.ANALYSIS_PROCESS)
      ?.enabled || false;
  /** Can the user see the advanced buttons? */
  advancedButtonsEnabled = false;
  /** Should we hide the Moving Averages columns? */
  hideMAColumns = true;
  /** Should we show the period rows? */
  showPeriods = true;

  constructor(
    private stateService: StateService,
    private loggingService: LoggingService,
    private dataProcessingService: DataProcessingService
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.stateService.hideMACrossings$.subscribe((value) => {
      this.hideMAColumns = value;
    });
    this.subs.sink = this.stateService.showPeriodRows$.subscribe((value) => {
      this.showPeriods = value;
    });
  }

  /** Sets the visibility of all columns to true. */
  public showColumns() {
    this.stateService.showManuallyHiddenColumns();
  }

  /** Sets the visibility of all stocks to true. */
  public showStocks() {
    this.stateService.showHiddenStocks();
  }

  /** Switch the visibility of all columns. */
  public showAllColumns() {
    if (this.hideMAColumns && !this.showPeriods) {
      this.showAllPeriods();
    }
    this.stateService.showCrossingColumns();
  }

  /** Switch the visibility of period rows. */
  public showAllPeriods() {
    this.stateService.showPeriodRows();
  }

  /** Erases the app's data from the user local storage. */
  public clearLocalStorage() {
    this.stateService.clearLocalStorage();
  }

  /** When the button to enable logging is clicked, enable/disable logging. */
  public switchLogging(type: 'proc' | 'anal' | 'json') {
    switch (type) {
      case 'proc':
        this.processingLog = !this.processingLog;
        this.loggingService.enableLog(
          LogType.DATA_PROCESSING,
          this.processingLog
        );
        break;
      case 'anal':
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
