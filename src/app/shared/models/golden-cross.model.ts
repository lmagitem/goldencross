import * as _ from 'lodash';
import { Timescale } from '../enums/timescale.enum';
import { CrossingType } from './crossing-type.model';

/** When and at which price a crossing between two MA happened. */
export class PriceAtCrossing {
  /** When this crossing happened. */
  timestamp: Date;
  /** At which price this crossing happened. */
  price: number;
  /** The type of crossing. */
  type: CrossingType;
  /** The timescale on which this crossing happened. */
  timescale: Timescale;

  constructor(
    timestamp: Date | string,
    price: number,
    type: CrossingType,
    timescale: Timescale
  ) {
    this.timestamp = new Date(timestamp);
    this.price = price;
    this.type = type;
    this.timescale = timescale;
  }

  /** Returns an instance of {@link PriceAtCrossing} using an object that contains enough infos. */
  public static getInstance(obj: {
    timestamp: Date;
    price: number;
    type: CrossingType;
    timescale: Timescale;
  }): PriceAtCrossing {
    if (
      _.has(obj, 'timestamp') &&
      _.has(obj, 'price') &&
      _.has(obj, 'type') &&
      _.has(obj, 'timescale')
    ) {
      return new PriceAtCrossing(
        obj.timestamp,
        obj.price,
        obj.type,
        obj.timescale
      );
    } else {
      throw new Error(
        'I cannot make a PriceAtCrossing instance with what I was given. It was: ' +
          JSON.stringify(obj)
      );
    }
  }
}
