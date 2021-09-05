import { TestBed, waitForAsync } from '@angular/core/testing';
import { MovingAverageService } from '../moving-average/moving-average.service';
import { PriceService } from '../price/price.service';
import { TiingoRequestService } from '../tiingo-request/tiingo-request.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataProcessingService } from './data-processing.service';
import {
  testEndOfDayPricesDuringEarlyTwoThousands,
  testStock,
  testTickerInfos,
  testCrossingResults,
  testPeriod,
  testRulesets,
} from 'src/app/shared/others/test-data';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { EndOfDayPrice } from 'src/app/shared/models/end-of-day-price.model';
import { Stock } from 'src/app/shared/models/stock.model';
import { TickerInfos } from 'src/app/shared/models/ticker-infos.model';

class MockTiingoService extends TiingoRequestService {
  getInfos(stock: Stock): Observable<HttpResponse<TickerInfos>> {
    return of(new HttpResponse({ body: testTickerInfos }));
  }
  getHistoricalPrices(
    stock: Stock,
    startDate: Date,
    endDate?: Date
  ): Observable<HttpResponse<EndOfDayPrice[]>> {
    return of(
      new HttpResponse({
        body: testEndOfDayPricesDuringEarlyTwoThousands,
      })
    );
  }
}

describe('DataProcessingService', () => {
  let service: DataProcessingService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          PriceService,
          MovingAverageService,
          { provide: TiingoRequestService, useClass: MockTiingoService },
        ],
      });
      service = TestBed.inject(DataProcessingService);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('.processPeriod should return a properly ', () => {
    service
      .processPeriod(testStock, testTickerInfos, testPeriod, testRulesets)
      .then((anlzdPeriod) => {
        expect(JSON.stringify(anlzdPeriod.period)).toEqual(
          JSON.stringify(testPeriod)
        );
        expect(anlzdPeriod.stock).toEqual(testStock.name);
        expect(JSON.stringify(anlzdPeriod.priceHistory)).toEqual(
          JSON.stringify(testEndOfDayPricesDuringEarlyTwoThousands)
        );
        expect(JSON.stringify(anlzdPeriod.crossings)).toEqual(
          JSON.stringify(testCrossingResults)
        );
        expect(anlzdPeriod.previousHigh).toEqual(28.57);
        expect(anlzdPeriod.lowest).toEqual(28.5);
        expect(anlzdPeriod.priceSixMonths).toEqual(53.61);
        expect(anlzdPeriod.priceTwoYears).toEqual(31.33);
      });
  });
});
