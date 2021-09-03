import { MovingAveragePrice } from './moving-average-price.model';

/** Data model from Tiingo that gives price infos about a stock on a given date. */
export interface EndOfDayPrice {
  date: Date;
  close: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  adjClose: number;
  adjHigh: number;
  adjLow: number;
  adjOpen: number;
  adjVolume: number;
  divCash: number;
  splitFactor: number;
  movingAveragePrices?: MovingAveragePrice[];
}
