import { TestBed } from '@angular/core/testing';
import { testEndOfDayPricesDuringEarlyTwoThousands } from 'src/app/shared/others/test-data';

import { MovingAverageService } from './moving-average.service';

describe('MovingAverageService', () => {
  let service: MovingAverageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovingAverageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(`.getMAPrice should return the proper moving average for the given inputs`, () => {
    expect(
      service.getMAPrice(
        new Date('2003-02-13T00:00:00.000Z'),
        10,
        testEndOfDayPricesDuringEarlyTwoThousands
      )
    ).toEqual(22.836);
  });
});
