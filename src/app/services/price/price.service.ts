import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
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

    // Find the starting date (or the nearest day before that), and cut everything before
    let startDate = new Date(start);
    let startFound = false;
    let startIndex = -1;
    let turn = 0;
    do {
      startIndex = DateUtils.findIndexAtDate(data, startDate);
      startFound = startIndex !== -1 ? true : false;
      startDate =
        startIndex !== -1
          ? startDate
          : moment(startDate).subtract(1, 'day').toDate();
      turn++;
    } while (turn < 7 || !startFound);
    data = data.slice(startIndex);

    // Find the end date (or the nearest day after that), and cut everything after
    let endDate = new Date(end);
    let endFound = false;
    let endIndex = -1;
    turn = 0;
    do {
      endIndex = DateUtils.findIndexAtDate(data, endDate);
      endFound = endIndex !== -1 ? true : false;
      endDate =
        endIndex !== -1 ? endDate : moment(endDate).add(1, 'day').toDate();
      turn++;
    } while (turn < 7 || !endFound);
    data = data.slice(0, endIndex);

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
    data = data.slice(0, DateUtils.findIndexAtDate(data, new Date(onDate)));
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

  /** Calculates the growth between a first value and a later one. */
  public calculateGrowth(previous: number, current: number): number {
    if (previous <= 0 && current >= 0) {
      return (current - previous) / Math.abs(previous);
    } else if (previous <= 0 && previous <= current) {
      return (Math.abs(current) - Math.abs(previous)) / previous;
    } else if (previous >= 0 && current <= 0) {
      return (current - previous) / previous;
    } else if (previous >= 0 && current >= 0) {
      return (current - previous) / previous;
    } else if (previous <= 0 && previous >= current) {
      return (Math.abs(current) - Math.abs(previous)) / previous;
    } else if (previous <= current) {
      return (current - previous) / current;
    } else {
      return -((previous - current) / previous);
    }
  }

  /** Returns the lowest closing price between two given dates. */
  public getGrowth(start: Date, end: Date, data: EndOfDayPrice[]): number {
    data = this.returnPricesBetweenDates(start, end, data);
    return data.length > 0
      ? MathUtils.roundTwoDecimal(
          data.reduce((a, b) => (a.low <= b.low ? a : b)).low
        )
      : -1;
  }
}
