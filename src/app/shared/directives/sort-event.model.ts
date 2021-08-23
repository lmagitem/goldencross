import { SortColumn, SortDirection } from './sort-direction.enum';

/** Represents a sort event, contains which field is concerned and in which direction the sort must go. */
export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}
