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
export class StateService {
  /** The token to use in order to retreive data from Tiingo. */
  private apiToken = new BehaviorSubject<string>('');
  /** The crossing types to manage for this session. */
  private crossingTypeList = new BehaviorSubject<CrossingType[]>([
    ...initialCrossingTypes,
  ]);
  /** The stocks filled with data that serve as rows. */
  private stocks = new BehaviorSubject<Stock[]>([]);
  /** The rulesets with which the results are calculated. */
  private rulesets = new BehaviorSubject<Ruleset[]>([]);
  /** Emits true each time the user clicks on the button "Show columns". */
  private showColumnsAction = new Subject<boolean>();
  /** Emits true each time the user clicks on the button "Show all columns". */
  private showAllColumnsAction = new Subject<boolean>();
  /** The token to use in order to retreive data from Tiingo. */
  public apiToken$ = this.apiToken.asObservable();
  /** The crossing types to manage for this session. */
  public crossingTypeList$ = this.crossingTypeList.asObservable();
  /** The stocks filled with data that serve as rows. */
  public stocks$ = this.stocks.asObservable();
  /** The rulesets with which the results are calculated. */
  public rulesets$ = this.rulesets.asObservable();
  /** Emits true each time the user clicks on the button "Show columns". */
  public showColumnsAction$ = this.showColumnsAction.asObservable();
  /** Emits true each time the user clicks on the button "Show all columns". */
  public showAllColumnsAction$ = this.showAllColumnsAction.asObservable();

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
          apiToken: this.apiToken.value,
          stocks: this.stocks.value,
          rulesets: this.rulesets.value,
        })
      ) {
        const data: Export = JSON.parse(json);

        this.loggingService.log(
          LogType.JSON_PARSING,
          'stateService > updateData() - Just received the following:',
          data
        );

        this.updateData(data);
      }
    }
  }

  /** Updates the rows using the ones given in parameter. */
  public updateStocks(stocks: Stock[]) {
    this.updateData({
      apiToken: this.apiToken.value,
      stocks: stocks,
      rulesets: this.rulesets.value,
    });
  }

  /** Add a new row to the existing ones. */
  public addStock(row: Stock) {
    this.updateStocks([...this.stocks.value, row]);
  }

  /** Updates an existing stock with the given data. */
  public updateStock(row: Stock) {
    const stocks = [...this.stocks.value];
    const stock = stocks.find((s) => row.name === s.name);
    if (stock !== undefined) {
      stock.infos = row.infos;
      stock.analyzedPeriods = row.analyzedPeriods;
    } else {
      stocks.push(row);
    }
    this.updateStocks(stocks);
  }

  /** Add a new row to the existing ones. */
  public removeStock(row: Stock) {
    this.updateStocks(this.stocks.value.filter((s) => s.name !== row.name));
  }

  /** Updates the rulesets using the ones given in parameter. */
  public updateRulesets(rulesets: Ruleset[]) {
    this.updateData({
      apiToken: this.apiToken.value,
      stocks: this.stocks.value,
      rulesets,
    });
  }

  /** Stores the current state of the app in the user's browser. */
  public saveState() {
    this.storageService.setSavedState(
      this.apiToken.getValue(),
      'goldencross_apiToken'
    );
    this.storageService.setSavedState(
      this.crossingTypeList.getValue(),
      'goldencross_crossingTypeList'
    );
    this.storageService.setSavedState(
      this.stocks.getValue(),
      'goldencross_stocks'
    );
    this.storageService.setSavedState(
      this.rulesets.getValue(),
      'goldencross_rulesets'
    );
  }

  /** Restores the state of the app from a previous session. */
  public restoreState() {
    const newApiToken = this.storageService.getSavedState(
      'goldencross_apiToken'
    );
    const newCrossingTypeList = this.storageService.getSavedState(
      'goldencross_crossingTypeList'
    );
    const newStocks = this.storageService.getSavedState('goldencross_stocks');
    const newRulesets = this.storageService.getSavedState(
      'goldencross_rulesets'
    );

    if (newApiToken !== undefined) {
      this.apiToken.next(newApiToken);
    }
    if (newCrossingTypeList !== undefined) {
      this.crossingTypeList.next(newCrossingTypeList);
    }
    if (newStocks !== undefined) {
      this.stocks.next(newStocks);
    }
    if (newRulesets !== undefined) {
      this.rulesets.next(newRulesets);
    }
  }

  /** Erases the app's data from the user local storage. */
  public clearLocalStorage() {
    this.storageService.removeSavedState('goldencross_apiToken');
    this.storageService.removeSavedState('goldencross_crossingTypeList');
    this.storageService.removeSavedState('goldencross_stocks');
    this.storageService.removeSavedState('goldencross_rulesets');
  }

  /** Emits true to show hidden columns on the data entry table. */
  public showColumns() {
    this.showColumnsAction.next(true);
  }

  /** Emits true to show all hidden columns on the data entry table. */
  public showAllColumns() {
    this.showAllColumnsAction.next(true);
  }

  /** Updates the data, regenerates the crossing types with it, and saves everything in local storage. */
  private updateData(data: Export, reset = true) {
    this.updateCrossingTypeList(data, reset);
    this.apiToken.next(data.apiToken);
    this.stocks.next(data.stocks);
    this.rulesets.next(data.rulesets);

    this.saveState();
  }

  /** Updates the list of crossing types using the data passed in parameter. */
  private updateCrossingTypeList(data: Export, reset = false) {
    const newCrossingTypeList = reset
      ? []
      : [...this.crossingTypeList.getValue()];
    data.stocks.forEach((row) => {
      row.analyzedPeriods?.forEach((period) => {
        period.crossings?.forEach((crossing) => {
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
