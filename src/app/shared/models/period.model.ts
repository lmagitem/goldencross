import { GoldenCross } from './golden-cross.model';

/** Key data points for the analysed period. */
export interface AnalysedPeriod {
  name: string;
  previousHigh: number;
  crossings: Array<GoldenCross>;
  lowest: number;
  priceSixMonths: number;
  priceTwoYears: number;
}
