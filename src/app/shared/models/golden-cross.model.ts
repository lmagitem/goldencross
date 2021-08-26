import * as _ from 'lodash';
import { Timescale } from '../enums/timescale.enum';
import { PriceUtils } from '../utils/price.utils';
import { CrossingType } from './crossing-type.model';

/** When and at which price a golden cross happened. */
export class GoldenCross {
  /** When this golden cross happened. */
  timestamp: Date;
  /** At which price this golden cross happened. */
  price: number;
  /** The type of crossing of this golden cross. */
  type: CrossingType;
  /** The timescale on which this golden cross happened. */
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

  /** Returns an instance of {@link GoldenCross} using an object that contains enough infos. */
  public static getInstance(obj: {
    timestamp: Date;
    price: number;
    type: CrossingType;
    timescale: Timescale;
  }): GoldenCross {
    if (
      _.has(obj, 'timestamp') &&
      _.has(obj, 'price') &&
      _.has(obj, 'type') &&
      _.has(obj, 'timescale')
    ) {
      return new GoldenCross(obj.timestamp, obj.price, obj.type, obj.timescale);
    } else {
      throw new Error(
        'I cannot make a PriceAtCrossing instance with what I was given. It was: ' +
          JSON.stringify(obj)
      );
    }
  }

  /** Returns a displayable version of the contained data. */
  public toHTML(getPriceAppreciationScore = (n: number) => 0): string {
    return (
      '<span class="' +
      PriceUtils.getPriceClass(getPriceAppreciationScore(this.price)) +
      '">' +
      (Math.round(this.price * 100) / 100).toFixed(2) +
      '</span><br>' +
      PriceUtils.getPriceTimestamp(this.timestamp, this.timescale)
    );
  }
}
