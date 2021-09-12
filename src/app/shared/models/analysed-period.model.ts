import { EndOfDayPrice } from './end-of-day-price.model';
import { PriceAtCrossing } from './golden-cross.model';
import { Period } from './period.model';

/** Key data points for the analysed period. */
export interface AnalysedPeriod {
  period: Period;
  stock: string;
  priceHistory: Array<EndOfDayPrice>;
  crossings: Array<PriceAtCrossing>;
  previousHigh: number;
  lowest: number;
  periodGrowth: number;
  priceSixMonths: number;
  priceTwoYears: number;
}
