import { SortColumn, SortDirection } from '../enums/sort-direction.enum';

/** Represents a sort event, contains which field is concerned and in which direction the sort must go. */
export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}
