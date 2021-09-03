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
  /** The list of sortable headers. */
  @ViewChildren(SortableHeaderDirective) headers:
    | QueryList<SortableHeaderDirective>
    | undefined;

  constructor(
    private stateService: StateService,
    private analysisService: AnalysisService,
    private priceDisplayService: PriceDisplayService,
    private loggingService: LoggingService
  ) {}

  /** Listens for the list of rows and rules coming from the json export service. */
  public ngOnInit(): void {
    this.subs.sink = combineLatest([
      this.stateService.rows$,
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
  }

  /** Unsubscribe to avoid memory loss. */
  public ngOnDestroy(): void {
    this.subs.unsubscribe();
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
        name: this.priceDisplayService.getCrossingWithClass(type) + ' n°1',
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
                  this.priceDisplayService.getCrossingWithClass(type) +
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
      return this.priceDisplayService.getGoldenCrossWithClass(
        PriceAtCrossing.getInstance(crossings[index]),
        (n: number) =>
          this.priceDisplayService.getPriceAppreciation(
            n,
            (period.priceSixMonths + period.priceTwoYears) / 2,
            period.previousHigh,
            period.lowest
          )
      );
    }

    return '-';
  }

  /** Returns a displayable version of the analysis results corresponding to the given data. */
  public getAnalysisResults(
    stock: Stock,
    period: AnalysedPeriod,
    ruleset: Ruleset
  ): string {
    const results = this.analysisService.processDataWithRuleset(
      stock,
      period,
      ruleset
    );
    this.loggingService.log(LogType.ANALYSIS_PROCESS, results.log);
    return this.priceDisplayService.getAnalysisResultsWithClass(results);
  }

  /** Format number to two digits for display in the table. */
  public formatToTwoDigits(n: number): string {
    return (Math.round(n * 100) / 100).toFixed(2);
  }

  /** Sets the visibility of all columns to true. */
  public showColumns() {
    this.dataEntryColumns.forEach((c) => (c.visible = true));
  }
}
