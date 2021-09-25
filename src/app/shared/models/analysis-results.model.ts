import { EntryPoint } from './entry-point.model';

/** Interface to hold the results of an analysis. */
export interface AnalysisResults {
  costAverage: number;
  gainsAfterTwoYears: number;
  usedCapital: number;
  entries: EntryPoint[];
  log: string;
}
