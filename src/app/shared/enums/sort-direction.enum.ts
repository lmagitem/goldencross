import { Stock } from '../models/stock.model';

/** Used to know on which field to sort. */
export type SortColumn =
  | keyof Omit<Stock, 'tags' | 'infos' | 'analyzedPeriods' | 'hide'>
  | '';
/** Used to know in which direction to sort. */
export type SortDirection = 'asc' | 'desc' | '';
