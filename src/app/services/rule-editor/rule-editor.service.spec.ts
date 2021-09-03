import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';

import { RuleEditorService } from './rule-editor.service';

describe('RuleEditorService', () => {
  let service: RuleEditorService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [AppModule],
      });
      service = TestBed.inject(RuleEditorService);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
