import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  CrossingType,
  initialCrossingTypes,
} from '../shared/models/crossing-type.model';
import { Export } from '../shared/models/export.model';
import { Ruleset } from '../shared/models/ruleset.model';
import { Stock } from '../shared/models/stock.model';
import { LogType } from '../shared/enums/log-type.enum';
import { LoggingService } from './logging.service';
import { StorageService } from './storage.service';

/** Manages the app data. */
@Injectable({
  providedIn: 'root',
})
export class DataService {
  /** The crossing types to manage for this session. */
  private crossingTypeList = new BehaviorSubject<CrossingType[]>([
    ...initialCrossingTypes,
  ]);
  /** The crossing types to manage for this session. */
  public crossingTypeList$ = this.crossingTypeList.asObservable();
  /** The stocks that serve as rows. */
  private rows = new BehaviorSubject<Stock[]>([]);
  /** The stocks that serve as rows. */
  public rows$ = this.rows.asObservable();
  /** The rulesets with which the results are calculated. */
  private rulesets = new BehaviorSubject<Ruleset[]>([]);
  /** The rulesets with which the results are calculated. */
  public rulesets$ = this.rulesets.asObservable();
  /** Emits true each time the user clicks on the button "Show columns". */
  private showColumnsAction = new Subject<boolean>();
  /** Emits true each time the user clicks on the button "Show columns". */
  public showColumnsAction$ = this.showColumnsAction.asObservable();

  constructor(
    private storageService: StorageService,
    private loggingService: LoggingService
  ) {}

  /** Updates the data entry table and the rulesets for result display using the json passed in parameter. */
  public updateData(json: string): void {
    if (!!json) {
      const data: Export = JSON.parse(json);

      this.loggingService.log(
        LogType.JSON_PARSING,
        'dataService > updateData() - Just received the following:',
        data
      );

      this.updateCrossingTypeList(data);
      this.rows.next(data.stocks);
      this.rulesets.next(data.rulesets);

      this.saveState();
    }
  }

  /** Updates the list of crossing types using the data passed in parameter. */
  private updateCrossingTypeList(data: Export, reset = false) {
    const newCrossingTypeList = reset
      ? []
      : [...this.crossingTypeList.getValue()];
    data.stocks.forEach((stock) => {
      stock.periods.forEach((period) => {
        period.crossings.forEach((crossing) => {
          if (
            newCrossingTypeList.findIndex(
              (t) =>
                crossing.type.firstMA === t.firstMA &&
                crossing.type.intoMA === t.intoMA
            ) === -1
          ) {
            newCrossingTypeList.push(crossing.type);
          }
        });
      });
    });
    newCrossingTypeList.sort((a, b) =>
      a.firstMA === b.firstMA ? a.intoMA - b.intoMA : a.firstMA - b.firstMA
    );
    this.crossingTypeList.next(newCrossingTypeList);
  }

  /** Stores the current state of the app in the user's browser. */
  public saveState() {
    this.storageService.setSavedState(
      this.crossingTypeList.getValue(),
      'goldencross_crossingTypeList'
    );
    this.storageService.setSavedState(this.rows.getValue(), 'goldencross_rows');
    this.storageService.setSavedState(
      this.rulesets.getValue(),
      'goldencross_rulesets'
    );
  }

  /** Restores the state of the app from a previous session. */
  public restoreState() {
    const newCrossingTypeList = this.storageService.getSavedState(
      'goldencross_crossingTypeList'
    );
    const newRows = this.storageService.getSavedState('goldencross_rows');
    const newRulesets = this.storageService.getSavedState(
      'goldencross_rulesets'
    );

    if (newCrossingTypeList !== undefined) {
      this.crossingTypeList.next(newCrossingTypeList);
    }
    if (newRows !== undefined) {
      this.rows.next(newRows);
    }
    if (newRulesets !== undefined) {
      this.rulesets.next(newRulesets);
    }
  }

  /** Emits true to show hidden columns on the data entry table. */
  public showColumns() {
    this.showColumnsAction.next(true);
  }
}
