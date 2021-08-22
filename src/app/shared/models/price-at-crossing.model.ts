import { CrossingType } from '../enums/crossing-type.enum';
import { Timescale } from '../enums/timescale.enum';

/** When and at which price a golden cross happened. */
export interface PriceAtCrossing {
  timestamp: Date;
  price: number;
  crossing: CrossingType;
  timescale: Timescale;
}
