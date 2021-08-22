import { PriceAtCrossing } from './price-at-crossing.model';

export interface AnalysedPeriod {
  previousHigh: number;
  crossings: Array<PriceAtCrossing>;
  lowest: number;
  priceSixMonths: number;
  priceTwoYears: number;
}
