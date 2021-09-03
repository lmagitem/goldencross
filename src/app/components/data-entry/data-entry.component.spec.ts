import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalysisService } from 'src/app/services/analysis/analysis.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { PriceDisplayService } from 'src/app/services/price-display/price-display.service';
import { StateService } from 'src/app/services/state/state.service';

import { DataEntryComponent } from './data-entry.component';

describe('DataEntryComponent', () => {
  let component: DataEntryComponent;
  let fixture: ComponentFixture<DataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataEntryComponent],
      providers: [
        StateService,
        AnalysisService,
        PriceDisplayService,
        LoggingService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
