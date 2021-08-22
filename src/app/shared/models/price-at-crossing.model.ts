import { CrossingType } from '../enums/crossing-type.enum';
import { Timescale } from '../enums/timescale.enum';

export interface PriceAtCrossing {
  timestamp: Date;
  price: number;
  crossing: CrossingType;
  timescale: Timescale;
}
