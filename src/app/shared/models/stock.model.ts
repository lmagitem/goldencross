import { Sector } from '../enums/sector.enum';
import { AnalysedPeriod } from './analysed-period.model';

/** Data on the company whose ticker we follow. */
export interface Stock {
  name: string;
  ticker: string;
  sector: Sector;
  analyzedPeriods: Array<AnalysedPeriod>;
}
