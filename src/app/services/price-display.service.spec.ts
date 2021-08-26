import { TestBed } from '@angular/core/testing';

import { PriceDisplayService } from './price-display.service';

describe('PriceDisplayService', () => {
  let service: PriceDisplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceDisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
