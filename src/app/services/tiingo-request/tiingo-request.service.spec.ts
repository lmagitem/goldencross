import { TestBed } from '@angular/core/testing';

import { TiingoRequestService } from './tiingo-request.service';

describe('TiingoRequestService', () => {
  let service: TiingoRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiingoRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
