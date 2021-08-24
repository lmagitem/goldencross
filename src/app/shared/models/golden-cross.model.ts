import * as _ from 'lodash';
import { CrossingType } from '../enums/crossing-type.enum';
import { Timescale } from '../enums/timescale.enum';

/** When and at which price a golden cross happened. */
export class GoldenCross {
  /** When this golden cross happened. */
  timestamp: Date;
  /** At which price this golden cross happened. */
  price: number;
  /** The type of crossing of this golden cross. */
  crossing: CrossingType;
  /** The timescale on which this golden cross happened. */
  timescale: Timescale;

  constructor(
    timestamp: Date | string,
    price: number,
    crossing: CrossingType,
    timescale: Timescale
  ) {
    this.timestamp = new Date(timestamp);
    this.price = price;
    this.crossing = crossing;
    this.timescale = timescale;
  }

  /** Returns an instance of {@link GoldenCross} using an object that contains enough infos. */
  public static getInstance(obj: {
    timestamp: Date;
    price: number;
    crossing: CrossingType;
    timescale: Timescale;
  }): GoldenCross {
    if (
      _.has(obj, 'timestamp') &&
      _.has(obj, 'price') &&
      _.has(obj, 'crossing') &&
      _.has(obj, 'timescale')
    ) {
      return new GoldenCross(
        obj.timestamp,
        obj.price,
        obj.crossing,
        obj.timescale
      );
    } else {
      throw new Error(
        'I cannot make a PriceAtCrossing instance with what I was given. It was: ' +
          JSON.stringify(obj)
      );
    }
  }

  /** Returns a readable version of the contained data. */
  public toString(): string {
    return (
      this.price +
      '\n' +
      this.timestamp.toLocaleDateString('en-UK', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })
    );
  }
}
