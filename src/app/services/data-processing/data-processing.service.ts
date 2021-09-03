import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { AnalysedPeriod } from 'src/app/shared/models/analysed-period.model';
import { CrossingType } from 'src/app/shared/models/crossing-type.model';
import { PriceAtCrossing } from 'src/app/shared/models/golden-cross.model';
import { Period } from 'src/app/shared/models/period.model';
import { Ruleset } from 'src/app/shared/models/ruleset.model';
import { Stock } from 'src/app/shared/models/stock.model';
import { TickerInfos } from 'src/app/shared/models/ticker-infos.model';
import { DateUtils } from 'src/app/shared/utils/date.utils';
import { MathUtils } from 'src/app/shared/utils/math.utils';
import { MovingAverageService } from '../moving-average/moving-average.service';
import { PriceService } from '../price/price.service';
import { StateService } from '../state/state.service';
import { TiingoRequestService } from '../tiingo-request/tiingo-request.service';

const periodsToAnalyze: Period[] = [
  /*{
    name: '73-74',
    yearlyInflation: 9.3,
    startDate: new Date(1973, 0, 11),
    endDate: new Date(1974, 11, 6),
  },
  {
    name: 'Black Monday',
    yearlyInflation: 4.4,
    startDate: new Date(1987, 9, 19),
    endDate: new Date(1987, 10, 19),
  },
  {
    name: 'Early 90s',
    yearlyInflation: 4.6,
    startDate: new Date(1990, 6, 1),
    endDate: new Date(1991, 2, 1),
  } ,
  {
    name: 'Early 2000s',
    yearlyInflation: 1.6,
    startDate: new Date(2001, 2, 1),
    endDate: new Date(2001, 10, 1),
  },*/
  {
    name: '08',
    yearlyInflation: 2.1,
    startDate: new Date(2007, 11, 1),
    endDate: new Date(2009, 5, 1),
  } /*,
  {
    name: 'COVID',
    yearlyInflation: 1.2,
    startDate: new Date(2020, 1, 1),
    endDate: new Date(2020, 3, 1),
  },*/,
];

/** Methods to process and calculate the data used by this app. */
@Injectable({
  providedIn: 'root',
})
export class DataProcessingService {
  constructor(
    private tiingoService: TiingoRequestService,
    private movingAverageService: MovingAverageService,
    private priceService: PriceService,
    private stateService: StateService
  ) {}

  /** For a given stock and a list of periods, get infos and historical data about the stock price during
   *  that period and calculate the moving averages required by the user's rulesets. */
  public processStock(stock: Stock, periods: Period[] = []): Promise<Stock> {
    return new Promise<Stock>((resolve, reject) => {
      periods =
        periods !== undefined && periods.length > 0
          ? periods
          : [...periodsToAnalyze];
      this.tiingoService
        .getInfos(stock)
        .pipe(first())
        .subscribe((response) => {
          const infos = response.body;
          if (infos !== undefined && infos !== null) {
            this.stateService.rulesets$.pipe(first()).subscribe((rulesets) => {
              let turnsDone = 0;
              // Process each period we'd like to analyze
              periods.forEach((p) =>
                this.processPeriod(stock, infos, p, rulesets)
                  .then((anlzdPeriod) => {
                    if (
                      stock.analyzedPeriods === undefined ||
                      stock.analyzedPeriods === null
                    ) {
                      stock.analyzedPeriods = [anlzdPeriod];
                    } else {
                      stock.analyzedPeriods.push(anlzdPeriod);
                    }
                    turnsDone++;
                    if (turnsDone >= periods.length) {
                      resolve(stock);
                    }
                  })
                  .catch((e) => {
                    console.error(e);
                  })
              );
            });
          }
        });
    });
  }

  /** For the given stock and period, get infos and historical data about the stock price during
   *  that period and calculate the moving averages required by the given rulesets. */
  public processPeriod(
    stock: Stock,
    tickerInfos: TickerInfos,
    period: Period,
    rulesets: Ruleset[]
  ): Promise<AnalysedPeriod> {
    return new Promise<AnalysedPeriod>((resolve, reject) => {
      // Retreive which moving averages we need to keep track of
      const movingAveragesToCalculate: number[] = [];
      const possibleCrossings: CrossingType[] = [];
      rulesets.forEach((s) =>
        s.rules.forEach((r) =>
          r.allowedTypes.forEach((t) => {
            if (!movingAveragesToCalculate.includes(t.fromMA)) {
              movingAveragesToCalculate.push(t.fromMA);
            }
            if (!movingAveragesToCalculate.includes(t.intoMA)) {
              movingAveragesToCalculate.push(t.intoMA);
            }
            if (
              possibleCrossings.findIndex(
                (c) => t.fromMA === c.fromMA && t.intoMA === c.intoMA
              ) === -1
            ) {
              possibleCrossings.push(t);
            }
          })
        )
      );
      const highestMA =
        movingAveragesToCalculate.reduce((a, b) => (a >= b ? a : b), 0) || 200;

      // Calculate the start and end dates of the period to retreive
      const startToRequest = DateUtils.deltaDateWithTradingDays(
        period.startDate,
        0,
        0,
        -highestMA
      );
      const endToRequest =
        DateUtils.deltaDateWithTradingDays(
          period.endDate,
          2,
          0,
          0
        ).getMilliseconds() < new Date().getMilliseconds()
          ? DateUtils.deltaDateWithTradingDays(period.endDate, 2, 0, 0)
          : new Date();

      // Check if the dates are valid (not before ticker startDate, not after current date)
      if (
        // If available data only starts after the beginning of the period
        DateUtils.deltaDateWithTradingDays(
          new Date(tickerInfos.startDate),
          0,
          0,
          -highestMA
        ).getMilliseconds() > startToRequest.getMilliseconds() ||
        // Or if available data ends before the beginning of the period
        DateUtils.deltaDateWithTradingDays(
          new Date(tickerInfos.endDate),
          2,
          0,
          0
        ).getMilliseconds() > startToRequest.getMilliseconds()
      ) {
        reject();
      }

      // Retreive the prices
      this.tiingoService
        .getHistoricalPrices(stock, startToRequest, endToRequest)
        .pipe(first())
        .subscribe((response) => {
          const priceHistory =
            response.body !== undefined && response.body !== null
              ? [...response.body]
              : [];

          // Calculate period data (high, low...)
          let previousHigh = MathUtils.roundTwoDecimal(
            this.movingAverageService.getMAPrice(
              DateUtils.deltaDateWithTradingDays(startToRequest, -1, 0, 0),
              10,
              priceHistory
            ) || 0
          );

          let lowest = MathUtils.roundTwoDecimal(
            this.priceService.getLowestClosingPrice(
              period.startDate,
              period.endDate,
              priceHistory
            )
          );

          let priceSixMonths = MathUtils.roundTwoDecimal(
            this.movingAverageService.getMAPrice(
              DateUtils.deltaDateWithTradingDays(startToRequest, 0, 6, 0),
              10,
              priceHistory
            ) || 0
          );

          let priceTwoYears = MathUtils.roundTwoDecimal(
            this.movingAverageService.getMAPrice(
              DateUtils.deltaDateWithTradingDays(startToRequest, 2, 0, 0),
              10,
              priceHistory
            ) || 0
          );

          // Calculate moving averages
          movingAveragesToCalculate.forEach((maTC) =>
            priceHistory.forEach((p) => {
              if (
                p.movingAveragePrices === undefined ||
                p.movingAveragePrices === null
              ) {
                p.movingAveragePrices = [];
              }
              p.movingAveragePrices.push({
                movingAverage: maTC,
                price: this.movingAverageService.getMAPrice(
                  p.date,
                  maTC,
                  priceHistory
                ),
              });
            })
          );

          // Calculate crossings
          const crossings: PriceAtCrossing[] =
            this.movingAverageService.findCrossings(
              possibleCrossings,
              priceHistory,
              period.startDate
            );

          resolve({
            period,
            stock: stock.name,
            priceHistory,
            crossings,
            previousHigh,
            lowest,
            priceSixMonths,
            priceTwoYears,
          });
        });
    });
  }
}
