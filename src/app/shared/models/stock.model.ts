import { Sector } from '../enums/sector.enum';
import { AnalysedPeriod } from './period.model';

/** Data on the company whose ticker we follow. */
export interface Stock {
  name: string;
  sector: Sector;
  periods: Array<AnalysedPeriod>;
}
