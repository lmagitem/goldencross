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
import {
  SortColumn,
  SortDirection,
} from '../shared/directives/sort-direction.enum';
import { DataEntryColumn } from './data-entry-column.model';

/** Simple function to compare two values. */
const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

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
  /** The entries in the table. */
  stocks: Array<Stock> = [];
  /** The sorted entries in the table. */
  sortedStocks: Array<Stock> = [];
  /** The list of sortable headers. */
  @ViewChildren(SortableHeader) headers: QueryList<SortableHeader> | undefined;

  constructor(private calculatorService: CalculatorService) {}

  /** Listens for the list of rows to display coming from the json export service. */
  ngOnInit(): void {
    this.subs.sink = this.calculatorService.rows$.subscribe((rows) => {
      this.stocks = rows;
      this.sortedStocks = rows;
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
          const res = compare(a[column], b[column]);
          return direction === 'asc' ? res : -res;
        });
      }
    }
  }
}
