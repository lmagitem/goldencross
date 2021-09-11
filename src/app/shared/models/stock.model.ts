import { Industry } from '../enums/industry.enum';
import { Sector } from '../enums/sector.enum';
import { AnalysedPeriod } from './analysed-period.model';
import { TickerInfos } from './ticker-infos.model';

/** Data on the company whose ticker we follow. */
export interface Stock {
  name: string;
  ticker: string;
  sector: Sector;
  industry: Industry;
  tags: string[];
  infos?: TickerInfos;
  analyzedPeriods: Array<AnalysedPeriod>;
}
