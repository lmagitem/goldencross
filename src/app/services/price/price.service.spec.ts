import { TestBed } from '@angular/core/testing';
import { EndOfDayPrice } from 'src/app/shared/models/end-of-day-price.model';
import {
  testAMDPeriod,
  testAMDPriceHistory,
  testEndOfDayPricesDuringEarlyTwoThousands,
  testPeriod,
} from 'src/app/shared/others/test-data';

import { PriceService } from './price.service';

describe('PriceService', () => {
  let service: PriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(`.returnPricesBetweenDates should return a list of EoDPrices between the given dates`, () => {
    expect(
      service.returnPricesBetweenDates(
        testPeriod.startDate,
        testPeriod.endDate,
        testEndOfDayPricesDuringEarlyTwoThousands
      ).length
    ).toEqual(167);
  });

  it(`.returnPricesFromNumberOfTradingDaysBeforeDate should return a list of EoDPrices from x days before a date`, () => {
    expect(
      service.returnPricesFromNumberOfTradingDaysBeforeDate(
        testPeriod.startDate,
        20,
        testEndOfDayPricesDuringEarlyTwoThousands
      ).length
    ).toEqual(20);
  });

  it(`.getLowestClosingPrice should return the proper moving average for the given inputs`, () => {
    expect(
      service.getLowestClosingPrice(
        testPeriod.startDate,
        testPeriod.endDate,
        testEndOfDayPricesDuringEarlyTwoThousands
      )
    ).toEqual(28.5);
    expect(
      service.getLowestClosingPrice(
        testAMDPeriod.startDate,
        testAMDPeriod.endDate,
        testAMDPriceHistory as unknown as EndOfDayPrice[]
      )
    ).toEqual(1.62);
  });
});
