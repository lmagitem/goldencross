import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { StateService } from '../state/state.service';

import { TiingoRequestService } from './tiingo-request.service';

describe('TiingoRequestService', () => {
  let service: TiingoRequestService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [StateService],
      });
      service = TestBed.inject(TiingoRequestService);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
