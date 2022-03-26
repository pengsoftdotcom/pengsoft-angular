import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyTrainingComponent } from './safety-training.component';

describe('SafetyTrainingComponent', () => {
    let component: SafetyTrainingComponent;
    let fixture: ComponentFixture<SafetyTrainingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SafetyTrainingComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SafetyTrainingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
