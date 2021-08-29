import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClosableTagComponent } from './closable-tag.component';

describe('ClosableTagComponent', () => {
  let component: ClosableTagComponent;
  let fixture: ComponentFixture<ClosableTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClosableTagComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosableTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
