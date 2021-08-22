import { Sector } from '../enums/sector.enum';
import { AnalysedPeriod } from './period.model';

export interface Stock {
  name: string;
  sector: Sector;
  periods: AnalysedPeriod;
}
