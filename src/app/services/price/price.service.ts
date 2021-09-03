import { Injectable } from '@angular/core';
import { EndOfDayPrice } from 'src/app/shared/models/end-of-day-price.model';
import { DateUtils } from 'src/app/shared/utils/date.utils';
import { MathUtils } from 'src/app/shared/utils/math.utils';

/** Methods for things related to price calculation and manipulation of {@link EndOfDayPrice} objects. */
@Injectable({
  providedIn: 'root',
})
export class PriceService {
  /** Returns an array of {@link EndOfDayPrice} objects which dates are contained between two dates. */
  public returnPricesBetweenDates(
    start: Date,
    end: Date,
    data: EndOfDayPrice[]
  ) {
    DateUtils.sortByDate(data);
    data = data.slice(DateUtils.findIndexAtDate(data, start));
    data = data.slice(0, DateUtils.findIndexAtDate(data, end));
    return data;
  }

  /** Returns an array of {@link EndOfDayPrice} objects which dates are contained between a given date and
   *  the number of days necessary to calculate a moving average. */
  public returnPricesFromNumberOfTradingDaysBeforeDate(
    onDate: Date,
    movingAverage: number,
    data: EndOfDayPrice[]
  ): EndOfDayPrice[] {
    DateUtils.sortByDate(data);
    data = data.slice(0, DateUtils.findIndexAtDate(data, onDate));
    data = data.slice(-movingAverage);
    return data;
  }

  /** Returns the lowest closing price between two given dates. */
  public getLowestClosingPrice(
    start: Date,
    end: Date,
    data: EndOfDayPrice[]
  ): number {
    data = this.returnPricesBetweenDates(start, end, data);
    return data.length > 0
      ? MathUtils.roundTwoDecimal(
          data.reduce((a, b) => (a.low <= b.low ? a : b)).low
        )
      : -1;
  }
}
