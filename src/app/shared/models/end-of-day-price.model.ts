import { MovingAveragePrice } from './moving-average-price.model';

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
  movingAveragePrices: MovingAveragePrice[];
}
