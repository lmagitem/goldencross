import { EndOfDayPrice } from './end-of-day-price.model';
import { GoldenCross } from './golden-cross.model';
import { Period } from './period.model';
import { Stock } from './stock.model';

/** Key data points for the analysed period. */
export interface AnalysedPeriod {
  period: Period;
  stock: Stock;
  priceHistory: Array<EndOfDayPrice>;
  crossings: Array<GoldenCross>;
  previousHigh: number;
  lowest: number;
  priceSixMonths: number;
  priceTwoYears: number;
}
