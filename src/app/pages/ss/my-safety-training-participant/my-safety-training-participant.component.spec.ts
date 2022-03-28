import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySafetyTrainingParticipantComponent } from './my-safety-training-participant.component';

describe('MySafetyTrainingParticipantComponent', () => {
  let component: MySafetyTrainingParticipantComponent;
  let fixture: ComponentFixture<MySafetyTrainingParticipantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MySafetyTrainingParticipantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MySafetyTrainingParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
