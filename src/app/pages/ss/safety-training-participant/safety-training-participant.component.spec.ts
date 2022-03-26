import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyTrainingParticipantComponent } from './safety-training-participant.component';

describe('SafetyTrainingParticipantComponent', () => {
    let component: SafetyTrainingParticipantComponent;
    let fixture: ComponentFixture<SafetyTrainingParticipantComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SafetyTrainingParticipantComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SafetyTrainingParticipantComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
