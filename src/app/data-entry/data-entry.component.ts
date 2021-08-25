import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { SubSink } from 'subsink';
import { CalculatorService } from '../calculator/calculator.service';
import { SortableHeader } from '../shared/directives/sortable-header.directive';
import { Stock } from '../shared/models/stock.model';
import * as _ from 'lodash';
import { SortColumn, SortDirection } from '../shared/enums/sort-direction.enum';
import { DataEntryColumn } from '../shared/models/data-entry-column.model';
import {
  CrossingType,
  crossingTypeList,
} from '../shared/enums/crossing-type.enum';
import { GoldenCross } from '../shared/models/golden-cross.model';
import { AnalysedPeriod } from '../shared/models/period.model';
import { ObjectUtils } from '../shared/utils/object.utils';
import { PriceUtils } from '../shared/utils/price.utils';
import { Ruleset } from '../shared/models/ruleset.model';
import { RulesetColumn } from '../shared/models/ruleset-column.model';
import { CalculatorUtils } from '../shared/utils/calculator.utils';
import {
  initialLoggingStatus,
  LoggingService,
} from '../shared/services/logging.service';
import { LogType } from '../shared/services/log-type.enum';
import { AnalysisResults } from '../shared/models/analysis-results.model';

/** Displays a table used to enter and look at data. */
@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss'],
})
export class DataEntryComponent implements OnInit, OnDestroy {
  /** Subscription management. */
  private subs: SubSink = new SubSink();
  /** The list of dynamically generated columns. */
  dataEntryColumns: Array<DataEntryColumn> = [];
  /** The list of dynamically generated columns. */
  rulesetColumns: Array<RulesetColumn> = [];
  /** The entries in the table. */
  stocks: Array<Stock> = [];
  /** The sorted entries in the table. */
  sortedStocks: Array<Stock> = [];
  /** Is logging enabled for the analysis process? */
  analysisLog =
    initialLoggingStatus.find((o) => o.type === LogType.ANALYSIS_PROCESS)
      ?.enabled || false;
  /** The list of sortable headers. */
  @ViewChildren(SortableHeader) headers: QueryList<SortableHeader> | undefined;

  constructor(
    private calculatorService: CalculatorService,
    private loggingService: LoggingService
  ) {}

  /** Listens for the list of rows and rules coming from the json export service. */
  ngOnInit(): void {
    this.subs.sink = this.calculatorService.rows$.subscribe((rows) => {
      this.generateDataEntryColumns(rows);
      this.stocks = rows;
      this.sortedStocks = rows;
    });
    this.subs.sink = this.calculatorService.rulesets$.subscribe((sets) => {
      this.generateRulesetColumns(sets);
    });
  }

  /** Unsubscribe to avoid memory loss. */
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /** Sorts rows using the interacted column header that called that function. */
  onSort(event: any) {
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
  generateDataEntryColumns(rows: Stock[]) {
    this.dataEntryColumns = [];
    crossingTypeList.forEach((type: CrossingType) => {
      // For each type, add a first column
      const columnsForThisType: DataEntryColumn[] = [];
      columnsForThisType.push({
        index: 0,
        name: PriceUtils.getCrossingWithClass(type) + ' n°1',
        type,
        visible: true,
      });

      // Then check in each period of each stock...
      rows.forEach((stock) =>
        stock.periods?.forEach((period) => {
          for (
            let i = 0;
            i < period.crossings.filter((c) => c.type === type).length;
            i++
          ) {
            // ... if they have more than X entries (X being the current count) for that type
            if (i >= columnsForThisType.length) {
              // And add columns accordingly
              columnsForThisType.push({
                index: columnsForThisType.length,
                name: PriceUtils.getCrossingWithClass(type) + ' n°' + (i + 1),
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
  generateRulesetColumns(sets: Ruleset[]) {
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
      .filter((c) => c.type === type)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

    // Then if there are indeed some to display, get the one corresponding to the required column
    if (crossings.length > index) {
      return GoldenCross.getInstance(crossings[index]).toHTML((n: number) =>
        PriceUtils.getPriceAppreciation(
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
    const results = CalculatorUtils.processDataWithRuleset(
      stock,
      period,
      ruleset
    );
    this.loggingService.log(LogType.ANALYSIS_PROCESS, results.log);
    return PriceUtils.getAnalysisResultsWithClass(results);
  }

  /** Format number to two digits for display in the table. */
  public formatToTwoDigits(n: number): string {
    return (Math.round(n * 100) / 100).toFixed(2);
  }

  /** Sets the visibility of all columns to true. */
  public showColumns() {
    this.dataEntryColumns.forEach((c) => (c.visible = true));
  }

  /** When the button to enable logging is clicked, enable/disable logging for that part of the app. */
  public switchLogging() {
    this.analysisLog = !this.analysisLog;
    this.loggingService.enableLog(LogType.ANALYSIS_PROCESS, this.analysisLog);
  }
}
