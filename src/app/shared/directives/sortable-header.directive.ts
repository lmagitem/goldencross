import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { SortDirection, SortColumn } from '../enums/sort-direction.enum';
import { SortEvent } from '../models/sort-event.model';

/** A simple object to return in which direction the sorting must go. */
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

/** Directive that allows to launch a sorting action when clicking on a column header. */
@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class SortableHeader {
  /** The column that is sortable, used to know the field with which to sort. */
  @Input() sortable: SortColumn = '';
  /** The direction of the sorting (ascendent or descendent). */
  @Input() direction: SortDirection = '';
  /** The sort event emitted by that header. */
  @Output() sort = new EventEmitter<SortEvent>();

  /** Changes the direction of the sort when the header is clicked. */
  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}
