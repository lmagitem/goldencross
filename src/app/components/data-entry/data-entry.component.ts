import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { SubSink } from 'subsink';
import { SortableHeaderDirective } from '../../shared/directives/sortable-header.directive';
import { Stock } from '../../shared/models/stock.model';
import * as _ from 'lodash';
import {
  SortColumn,
  SortDirection,
} from '../../shared/enums/sort-direction.enum';
import { DataEntryColumn } from '../../shared/models/data-entry-column.model';
import { PriceAtCrossing } from '../../shared/models/golden-cross.model';
import { AnalysedPeriod } from '../../shared/models/analysed-period.model';
import { ObjectUtils } from '../../shared/utils/object.utils';
import { Ruleset } from '../../shared/models/ruleset.model';
import { RulesetColumn } from '../../shared/models/ruleset-column.model';
import { LogType } from '../../shared/enums/log-type.enum';
import { CrossingType } from '../../shared/models/crossing-type.model';
import { delay, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { AnalysisService } from 'src/app/services/analysis/analysis.service';
import { StateService } from 'src/app/services/state/state.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { PriceDisplayService } from 'src/app/services/price-display/price-display.service';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { Sector, sectors } from 'src/app/shared/enums/sector.enum';
import { industries, Industry } from 'src/app/shared/enums/industry.enum';
import { periodsToAnalyze } from 'src/app/shared/others/periods-to-analyze';
import { Period } from 'src/app/shared/models/period.model';
import { StringableKeyValuePair } from 'src/app/shared/models/stringable-key-value-pair.model';
import { DataProcessingService } from 'src/app/services/data-processing/data-processing.service';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { ModalUtils } from 'src/app/shared/utils/modal.utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MathUtils } from 'src/app/shared/utils/math.utils';

/** Empty stock used to add new ones. */
const EMPTY_STOCK = {
  name: '',
  ticker: '',
  sector: Sector.COMMUNICATION_SERVICES,
  industry: Industry.DIVERSIFIED_TELECOMMUNICATION_SERVICES,
  tags: [],
  analyzedPeriods: [],
};

/** Displays a table used to enter and look at data. */
@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss'],
})
export class DataEntryComponent implements OnInit, OnDestroy {
  /** Subscription management. */
  private subs: SubSink = new SubSink();
  /** The list of managed crossing types. */
  crossingTypeList: CrossingType[] = [];
  /** The list of dynamically generated columns. */
  dataEntryColumns: Array<DataEntryColumn> = [];
  /** The list of dynamically generated columns. */
  rulesetColumns: Array<RulesetColumn> = [];
  /** The entries in the table. */
  stocks: Array<Stock> = [];
  /** The sorted entries in the table. */
  sortedStocks: Array<Stock> = [];
  /** Should we hide the Moving Averages columns? */
  hideMAColumns = true;
  /** The selected period for each stock */
  selectedPeriods: Map<Stock, Period | 'all' | undefined> = new Map();
  /** New stock to add to the list. */
  newStock: Stock = _.cloneDeep(EMPTY_STOCK);
  /** New tag to add to a stock's tags. */
  currentTag: string = '';
  /** The list of sortable headers. */
  @ViewChildren(SortableHeaderDirective) headers:
    | QueryList<SortableHeaderDirective>
    | undefined;

  constructor(
    private modalService: NgbModal,
    private stateService: StateService,
    private analysisService: AnalysisService,
    private dataProcessingService: DataProcessingService,
    private priceDisplayService: PriceDisplayService,
    private loggingService: LoggingService
  ) {}

  /** Listens for the list of rows and rules coming from the json export service. */
  public ngOnInit(): void {
    this.subs.sink = combineLatest([
      this.stateService.stocks$,
      this.stateService.crossingTypeList$,
    ])
      .pipe(map((results) => ({ rows: results[0], list: results[1] })))
      .pipe(delay(150))
      .subscribe((results: { rows: any; list: any }) => {
        this.crossingTypeList = results.list;
        this.stocks = results.rows;
        this.sortedStocks = results.rows;
        this.generateDataEntryColumns(results.rows);
      });
    this.subs.sink = this.stateService.rulesets$
      .pipe(delay(150))
      .subscribe((sets) => {
        this.generateRulesetColumns(sets);
      });
    this.subs.sink = this.stateService.showColumnsAction$.subscribe(() => {
      this.showColumns();
    });
    this.subs.sink = this.stateService.showAllColumnsAction$.subscribe(() => {
      this.showAllColumns();
    });
  }

  /** Unsubscribe to avoid memory loss. */
  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /** Returns the list of sectors to display for the new stock. */
  public getSectors(): Sector[] {
    return sectors;
  }

  /** Returns the list of industries to display for the new stock. */
  public getIndustries(): Industry[] {
    return industries.get(this.newStock.sector) || [];
  }

  /** Returns the list of periods to display for the new stock. */
  public getPeriods(stock: Stock): Period[] {
    return periodsToAnalyze.filter(
      (p) =>
        stock.analyzedPeriods === undefined ||
        stock.analyzedPeriods === null ||
        stock.analyzedPeriods === [] ||
        (stock.analyzedPeriods !== undefined &&
          stock.analyzedPeriods.findIndex(
            (anlzdPrd) => anlzdPrd.period.name === p.name
          ) === -1)
    );
  }

  /** Sorts rows using the interacted column header that called that function. */
  public onSort(event: any) {
    const column: SortColumn = _.has(event, 'column') ? event.column : '';
    const direction: SortDirection = _.has(event, 'direction')
      ? event.direction
      : '';

    if (!!this.headers) {
      // Resetting other headers
      this.headers.forEach((header) => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });

      // Sorting rows
      if (direction === '' || column === '') {
        this.sortedStocks = this.stocks;
      } else {
        this.sortedStocks = [...this.stocks].sort((a, b) => {
          const res = ObjectUtils.compare(a[column], b[column]);
          return direction === 'asc' ? res : -res;
        });
      }
    }
  }

  /** Generates columns for each type of crossing that appear in the rows. */
  public generateDataEntryColumns(rows: Stock[]) {
    this.dataEntryColumns = [];
    this.crossingTypeList.forEach((type: CrossingType) => {
      // For each type, add a first column
      const columnsForThisType: DataEntryColumn[] = [];
      columnsForThisType.push({
        index: 0,
        name: this.priceDisplayService.getMACrossingWithClass(type) + ' n°1',
        type,
        visible: true,
      });

      // Then check in each period of each stock...
      rows.forEach((stock) =>
        stock.analyzedPeriods?.forEach((period) => {
          for (
            let i = 0;
            i <
            period.crossings.filter(
              (c) =>
                c.type.fromMA === type.fromMA && c.type.intoMA === type.intoMA
            ).length;
            i++
          ) {
            // ... if they have more than X entries (X being the current count) for that type
            if (i >= columnsForThisType.length) {
              // And add columns accordingly
              columnsForThisType.push({
                index: columnsForThisType.length,
                name:
                  this.priceDisplayService.getMACrossingWithClass(type) +
                  ' n°' +
                  (i + 1),
                type,
                visible: true,
              });
            }
          }
        })
      );

      this.dataEntryColumns.push(...columnsForThisType);
    });
  }

  /** Generates columns for each ruleset used to process the data. */
  public generateRulesetColumns(sets: Ruleset[]) {
    this.rulesetColumns = [];
    sets.forEach((ruleset) => this.rulesetColumns.push({ ruleset }));
  }

  /** Returns a readable version of the {@link PriceAtCrossing} object corresponding to the given coordinates. */
  public getCrossing(
    index: number,
    type: CrossingType,
    period: AnalysedPeriod
  ): string {
    // Find the crossings corresponding to the given type and sort them
    const crossings = period.crossings
      .filter(
        (c) => c.type.fromMA === type.fromMA && c.type.intoMA === type.intoMA
      )
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

    // Then if there are indeed some to display, get the one corresponding to the required column
    if (crossings.length > index) {
      return this.priceDisplayService.getCrossingWithClass(
        PriceAtCrossing.getInstance(crossings[index]),
        (n: number) =>
          this.priceDisplayService.getPriceAppreciation(
            n,
            (period.priceSixMonths + period.priceTwoYears) / 2,
            period.priceBefore,
            period.lowest
          )
      );
    }

    return '-';
  }

  /** Returns a displayable version of the analysis results corresponding to the given data. */
  public getAnalysisResults(
    stock: Stock,
    period: AnalysedPeriod | 'all',
    ruleset: Ruleset
  ): string {
    if (period === 'all') {
      const result =
        stock.analyzedPeriods
          .map((p) => {
            const results = this.analysisService.processDataWithRuleset(
              stock,
              p,
              ruleset
            );
            this.loggingService.log(LogType.ANALYSIS_PROCESS, results.log);
            return results.gainsAfterTwoYears;
          })
          .reduce((a, b) => a + b, 0) / stock.analyzedPeriods.length;

      return MathUtils.isNumeric(result)
        ? this.priceDisplayService.getGrowthPercentageWithClass(result)
        : '';
    } else {
      const results = this.analysisService.processDataWithRuleset(
        stock,
        period,
        ruleset
      );
      this.loggingService.log(LogType.ANALYSIS_PROCESS, results.log);
      return this.priceDisplayService.getAnalysisResultsWithClass(results);
    }
  }

  /** Returns a simple formatted date. */
  public formatDate(date: Date): string {
    return this.priceDisplayService.getPriceTimestamp(date);
  }

  /** Updates the new stock's name. */
  public updateCurrentName(event: any) {
    this.newStock.name = (event.target as HTMLInputElement).value;
  }

  /** Updates the new stock's ticker. */
  public updateCurrentTicker(event: any) {
    this.newStock.ticker = (event.target as HTMLInputElement).value;
  }

  /** Updates the new stock's sector. */
  public selectCurrentSector(event: any) {
    const value = (event.target as HTMLInputElement)
      .value as keyof typeof Sector;
    this.newStock.sector = Sector[value];
  }

  /** Updates the new stock's industry. */
  public selectCurrentIndustry(event: any) {
    const value = (event.target as HTMLInputElement)
      .value as keyof typeof Industry;
    this.newStock.industry = Industry[value];
  }

  /** Updates the new stock's industry. */
  public updateCurrentTag(event: any) {
    this.currentTag = (event.target as HTMLInputElement).value;
  }

  /** Transforms the current list of tags into a {@link StringableKeyValuePair} array that can be fed to the {@link ClosableTagComponent}s. */
  public toTags(): StringableKeyValuePair<string>[] {
    const result: StringableKeyValuePair<string>[] = [];
    for (let i = 0; i < this.newStock.tags.length; i++) {
      result.push(new StringableKeyValuePair(i, this.newStock.tags[i]));
    }
    return result;
  }

  /** Uses the given array retreived from a {@link ClosableTagComponent} to update the new stock's tags list. */
  public updateTags(tags: Array<StringableKeyValuePair<string>>) {
    this.newStock.tags = this.newStock.tags.filter(
      (t) => tags.findIndex((s) => s.data === t) !== -1
    );
  }

  /** Adds a new tag to the new stock. */
  public addTag() {
    if (
      this.currentTag !== '' &&
      this.newStock.tags.findIndex((t) => t === this.currentTag) === -1
    ) {
      this.newStock.tags.push(this.currentTag);
      this.currentTag = '';
    }
  }

  /** Add a new stock to the list from the data given by the user. */
  public addStock() {
    this.dataProcessingService
      .processStock(this.newStock)
      .then((stock) => {
        this.stateService.addStock(stock);
        this.newStock = _.cloneDeep(EMPTY_STOCK);
      })
      .catch((e) => {
        console.error(e);
        alert(
          'An error has been encountered. It is probable that the stock ' +
            this.newStock.name +
            " doesn't exist in Tiingo's (our data provider) database, or that you made a typo on its ticker symbol."
        );
      });
  }

  /** Removes the selected stock from the table. */
  removeStock(stock: Stock) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    ModalUtils.fillInstance(
      modalRef,
      'Warning',
      'You are about to delete the stock named ' +
        stock.name +
        ' and all data that goes with it, are you sure?',
      'Cancel',
      'I am sure, delete it'
    );
    modalRef.result.then(
      (res) => {
        if (res === true) {
          this.stateService.removeStock(stock);
        }
      },
      (dismiss) => {}
    );
  }

  /** Adds the selected period to analyze for the selected stock. */
  addPeriod(stock: Stock) {
    const content = this.selectedPeriods.get(stock);
    if (content === 'all') {
      this.dataProcessingService
        .processStock(stock, [...this.getPeriods(stock)])
        .then((s) => this.stateService.updateStock(s));
    } else if (
      content !== undefined &&
      _.has(content, 'name') &&
      _.has(content, 'yearlyInflation') &&
      _.has(content, 'startDate') &&
      _.has(content, 'endDate')
    ) {
      this.dataProcessingService
        .processStock(stock, [content])
        .then((s) => this.stateService.updateStock(s));
    }
  }

  /** Updates data for the selected period. */
  updatePeriod(anlzdPrd: AnalysedPeriod, stock: Stock) {
    this.dataProcessingService
      .processStock(stock, [anlzdPrd.period])
      .then((s) => this.stateService.updateStock(s));
  }

  /** Removes the selected period. */
  removePeriod(anlzdPrd: AnalysedPeriod, stock: Stock) {
    stock.analyzedPeriods = stock.analyzedPeriods.filter(
      (p) => p.period.name !== anlzdPrd.period.name
    );
    this.stateService.updateStock(stock);
  }

  /** Changes the selected period to add to a given stock. */
  selectCurrentPeriod(stock: Stock, event: any) {
    const value = (event.target as HTMLInputElement).value;
    if (value === undefined) {
      this.selectedPeriods.set(stock, value);
    } else if (value === 'all') {
      this.selectedPeriods.set(stock, value);
    } else if (
      this.getPeriods(stock).findIndex((p) => p.name === value) !== 1
    ) {
      this.selectedPeriods.set(
        stock,
        this.getPeriods(stock).find((p) => p.name === value)
      );
    } else {
      this.selectedPeriods.set(stock, undefined);
    }
  }

  /** Format number to two digits for display in the table. */
  public formatToTwoDigits(n: number): string {
    return (Math.round(n * 100) / 100).toFixed(2);
  }

  /** Format growth percentage for display in the table. */
  public getGrowthWithClass(o: number | Stock): string {
    if (typeof o === 'number') {
      return this.priceDisplayService.getGrowthPercentageWithClass(o);
    } else {
      const n =
        o.analyzedPeriods
          ?.map((p) => p.periodGrowth)
          .reduce((a, b) => a + b, 0) / o.analyzedPeriods.length;
      return MathUtils.isNumeric(n)
        ? this.priceDisplayService.getGrowthPercentageWithClass(n)
        : '';
    }
  }

  /** Format number and growth percentage for display in the table. */
  public getPriceAndGrowthWithClass(previous: number, current: number): string {
    return this.priceDisplayService.getPriceAndGrowthPercentageWithClass(
      previous,
      current
    );
  }

  /** Returns a somewhat readable string from an enum value. */
  public enumToString(o: any): string {
    const s = (
      StringUtils.replaceAll(o + '', '_', ' ') as string
    ).toLowerCase();
    return s.charAt(0).toUpperCase() + s.substring(1);
  }

  /** Sets the visibility of all columns to true. */
  public showColumns() {
    this.dataEntryColumns.forEach((c) => (c.visible = true));
  }

  /** Switch the visibility of moving average columns. */
  public showAllColumns() {
    this.hideMAColumns = !this.hideMAColumns;
  }
}
