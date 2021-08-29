import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import { LogType } from 'src/app/shared/enums/log-type.enum';
import {
  CrossingType,
  initialCrossingTypes,
} from 'src/app/shared/models/crossing-type.model';
import { Export } from 'src/app/shared/models/export.model';
import { Ruleset } from 'src/app/shared/models/ruleset.model';
import { Stock } from 'src/app/shared/models/stock.model';
import { LoggingService } from '../logging/logging.service';
import { StorageService } from '../storage/storage.service';

/** Manages the app data. */
@Injectable({
  providedIn: 'root',
})
export class DataService {
  /** The crossing types to manage for this session. */
  private crossingTypeList = new BehaviorSubject<CrossingType[]>([
    ...initialCrossingTypes,
  ]);
  /** The stocks that serve as rows. */
  private rows = new BehaviorSubject<Stock[]>([]);
  /** The rulesets with which the results are calculated. */
  private rulesets = new BehaviorSubject<Ruleset[]>([]);
  /** Emits true each time the user clicks on the button "Show columns". */
  private showColumnsAction = new Subject<boolean>();
  /** The crossing types to manage for this session. */
  public crossingTypeList$ = this.crossingTypeList.asObservable();
  /** The stocks that serve as rows. */
  public rows$ = this.rows.asObservable();
  /** The rulesets with which the results are calculated. */
  public rulesets$ = this.rulesets.asObservable();
  /** Emits true each time the user clicks on the button "Show columns". */
  public showColumnsAction$ = this.showColumnsAction.asObservable();

  constructor(
    private storageService: StorageService,
    private loggingService: LoggingService
  ) {}

  /** Updates the data entry table and the rulesets for result display using the json passed in parameter. */
  public updateDataFromJson(json: string): void {
    if (!!json) {
      if (
        json !==
        JSON.stringify({
          stocks: this.rows.value,
          rulesets: this.rulesets.value,
        })
      ) {
        const data: Export = JSON.parse(json);

        this.loggingService.log(
          LogType.JSON_PARSING,
          'dataService > updateData() - Just received the following:',
          data
        );

        this.updateData(data);
      }
    }
  }

  /** Updates the stocks using the ones given in parameter. */
  public updateStocks(stocks: Stock[]) {
    this.updateData({ stocks, rulesets: this.rulesets.value });
  }

  /** Updates the rulesets using the ones given in parameter. */
  public updateRulesets(rulesets: Ruleset[]) {
    this.updateData({ stocks: this.rows.value, rulesets });
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

  /** Erases the app's data from the user local storage. */
  public clearLocalStorage() {
    this.storageService.removeSavedState('goldencross_crossingTypeList');
    this.storageService.removeSavedState('goldencross_rows');
    this.storageService.removeSavedState('goldencross_rulesets');
  }

  /** Emits true to show hidden columns on the data entry table. */
  public showColumns() {
    this.showColumnsAction.next(true);
  }

  /** Updates the data, regenerates the crossing types with it, and saves everything in local storage. */
  private updateData(data: Export) {
    this.updateCrossingTypeList(data);
    this.rows.next(data.stocks);
    this.rulesets.next(data.rulesets);

    this.saveState();
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
                crossing.type.fromMA === t.fromMA &&
                crossing.type.intoMA === t.intoMA
            ) === -1
          ) {
            newCrossingTypeList.push(crossing.type);
          }
        });
      });
    });
    newCrossingTypeList.sort((a, b) =>
      a.fromMA === b.fromMA ? a.intoMA - b.intoMA : a.fromMA - b.fromMA
    );
    this.crossingTypeList.next(newCrossingTypeList);
  }
}
