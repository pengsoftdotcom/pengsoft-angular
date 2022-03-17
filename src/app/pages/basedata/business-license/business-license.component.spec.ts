import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessLicenseComponent } from './business-license.component';

describe('BusinessLicenseComponent', () => {
  let component: BusinessLicenseComponent;
  let fixture: ComponentFixture<BusinessLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessLicenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
