import { PriceAtCrossing } from './price-at-crossing.model';

/** Key data points for the analysed period. */
export interface AnalysedPeriod {
  previousHigh: number;
  crossings: Array<PriceAtCrossing>;
  lowest: number;
  priceSixMonths: number;
  priceTwoYears: number;
}
