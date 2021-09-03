import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';
import { PriceDisplayService } from 'src/app/services/price-display/price-display.service';
import { RuleEditorService } from 'src/app/services/rule-editor/rule-editor.service';
import { StateService } from 'src/app/services/state/state.service';
import { SortableHeaderDirective } from 'src/app/shared/directives/sortable-header.directive';

import { RuleEditorComponent } from './rule-editor.component';

describe('RuleEditorComponent', () => {
  let component: RuleEditorComponent;
  let fixture: ComponentFixture<RuleEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RuleEditorComponent],
      imports: [AppModule],
      providers: [
        NgbModal,
        StateService,
        PriceDisplayService,
        RuleEditorService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
