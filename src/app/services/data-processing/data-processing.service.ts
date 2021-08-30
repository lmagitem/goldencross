import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { Period } from 'src/app/shared/models/period.model';
import { Stock } from 'src/app/shared/models/stock.model';
import { TickerInfos } from 'src/app/shared/models/ticker-infos.model';
import { StateService } from '../state/state.service';
import { TiingoRequestService } from '../tiingo-request/tiingo-request.service';

const periodsToAnalyze: Period[] = [
  {
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
  },
  {
    name: 'Early 2000s',
    yearlyInflation: 1.6,
    startDate: new Date(2001, 2, 1),
    endDate: new Date(2001, 10, 1),
  },
  {
    name: '08',
    yearlyInflation: 2.1,
    startDate: new Date(2007, 11, 1),
    endDate: new Date(2009, 5, 1),
  },
  {
    name: 'COVID',
    yearlyInflation: 1.2,
    startDate: new Date(2020, 1, 1),
    endDate: new Date(2020, 3, 1),
  },
];

@Injectable({
  providedIn: 'root',
})
export class DataProcessingService {
  constructor(
    private tiingoService: TiingoRequestService,
    private stateService: StateService
  ) {}

  public processStock(stock: Stock) {
    this.tiingoService
      .getInfos(stock)
      .pipe(first())
      .subscribe((response) => {
        const infos = response.body;
        if (response.body !== undefined && infos !== null) {
          // Process each period we'd like to analyze
          periodsToAnalyze.forEach((p) => this.processPeriod(stock, infos, p));
        }
      });
  }

  public processPeriod(
    stock: Stock,
    tickerInfos: TickerInfos,
    period: Period
  ) /*: Promise<AnalysedPeriod>*/ {
    //////////////////////////////////////////// 1 ////////////////////////////////////////////
    // Calculate the start and end dates of the period to retreive
    // startDate = DateUtils.calculateDate(startDate, -200d);
    // endDate = DateUtils.calculateDate(endDate, +2y);
    //////////////////////////////////////////// 2 ////////////////////////////////////////////
    // Check if the dates are valid (not before ticker startDate, not after current date)
    //////////////////////////////////////////// 3 ////////////////////////////////////////////
    // Retreive the prices
    // this.tiingoService.getHistoricalPrices(stock, startDate, endDate);
    //////////////////////////////////////////// 4 ////////////////////////////////////////////
    // Calculate period data (high, low...)
    // low = movingAverageService.getMAPrice(period.startDate-1, 10d, data)
    //////////////////////////////////////////// 5 ////////////////////////////////////////////
    // Calculate moving averages
    // movingAverageToCalculate.forEach(maTC => endOfDayPrices.forEach(p => movingAverageService.getMAPrice(p.date, maTC, data)))
    //////////////////////////////////////////// 6 ////////////////////////////////////////////
    // Calculate crossings
    // maService.findCrossings();
    // return new Promise<AnalysedPeriod>();
  }
}
