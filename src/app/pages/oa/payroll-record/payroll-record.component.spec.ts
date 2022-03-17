import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollRecordComponent } from './payroll-record.component';

describe('PayrollRecordComponent', () => {
  let component: PayrollRecordComponent;
  let fixture: ComponentFixture<PayrollRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
