import { Injectable } from '@angular/core';
import { Timescale } from 'src/app/shared/enums/timescale.enum';
import { CrossingType } from 'src/app/shared/models/crossing-type.model';
import { EndOfDayPrice } from 'src/app/shared/models/end-of-day-price.model';
import { PriceAtCrossing } from 'src/app/shared/models/golden-cross.model';
import { DateUtils } from 'src/app/shared/utils/date.utils';
import { MathUtils } from 'src/app/shared/utils/math.utils';
import { PriceService } from '../price/price.service';

/** Methods used to calculate Moving Averages and Crosses between MA. */
@Injectable({
  providedIn: 'root',
})
export class MovingAverageService {
  constructor(private priceService: PriceService) {}

  /** Calculates the queried Moving Average price at the given date. */
  public getMAPrice(
    onDate: Date,
    movingAverage: number,
    data: EndOfDayPrice[]
  ): number | undefined {
    onDate = new Date(onDate);
    movingAverage = Math.abs(movingAverage);

    if (!MathUtils.isInteger(movingAverage)) {
      throw new Error('The given moving average must be an integer.');
    }

    // Reduce the array to only keep the prices that interest us
    data = this.priceService.returnPricesFromNumberOfTradingDaysBeforeDate(
      onDate,
      movingAverage,
      data
    );

    if (data.length < movingAverage) {
      return undefined;
    }

    // Add every EoD price from the array and divide
    return data.map((p) => p.close).reduce((a, b) => a + b, 0) / movingAverage;
  }

  /** Returns all MA crossings of queried types found in the given data. */
  public findCrossings(
    possibleCrossings: CrossingType[],
    data: EndOfDayPrice[],
    startDate: Date
  ): PriceAtCrossing[] {
    const crossings: PriceAtCrossing[] = [];
    const dayPreviousStartDate = DateUtils.deltaDateWithTradingDays(
      startDate,
      0,
      0,
      -1
    );

    // For each EoDPrice, check if a lower MA goes above a higher MA in comparison of the last EoDPrice
    let previousEoD: EndOfDayPrice;
    let previousHashMap: Map<number, number | undefined>;
    data.forEach((eodp) => {
      if (
        // If it's the first entry, initiate previousEoD and previousHashMap
        previousEoD === undefined &&
        eodp.movingAveragePrices !== undefined &&
        eodp.movingAveragePrices.length > 0 &&
        new Date(eodp.date).getFullYear() >=
          dayPreviousStartDate.getFullYear() &&
        new Date(eodp.date).getMonth() >= dayPreviousStartDate.getMonth() &&
        new Date(eodp.date).getDate() >= dayPreviousStartDate.getDate()
      ) {
        previousEoD = eodp;
        previousHashMap = new Map(
          eodp.movingAveragePrices.map((obj) => [obj.movingAverage, obj.price])
        );
      } else if (
        eodp.movingAveragePrices !== undefined &&
        eodp.movingAveragePrices.length > 0
      ) {
        // List all the prices in a easily usable map
        const hashMap = new Map(
          eodp.movingAveragePrices.map((obj) => [obj.movingAverage, obj.price])
        );

        // For the crossings we're watching, if we find a lower MA above a higher MA
        possibleCrossings.forEach((c) => {
          if (
            (hashMap.get(c.fromMA) || 0) >
              (hashMap.get(c.intoMA) || Number.MAX_SAFE_INTEGER) &&
            // And it wasn't the case the previous day
            (previousHashMap.get(c.fromMA) || 0) <=
              (previousHashMap.get(c.intoMA) || Number.MAX_SAFE_INTEGER)
          ) {
            // Then we can create a GoldenCross
            crossings.push(
              new PriceAtCrossing(eodp.date, eodp.close, c, Timescale.OD)
            );
          }
        });

        previousEoD = eodp;
        previousHashMap = hashMap;
      }
    });

    return crossings;
  }
}
