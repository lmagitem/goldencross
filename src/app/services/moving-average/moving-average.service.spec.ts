import { TestBed } from '@angular/core/testing';

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
});
