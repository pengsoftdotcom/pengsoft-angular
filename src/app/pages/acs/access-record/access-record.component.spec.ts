import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRecordComponent } from './access-record.component';

describe('AccessRecordComponent', () => {
    let component: AccessRecordComponent;
    let fixture: ComponentFixture<AccessRecordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AccessRecordComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AccessRecordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
