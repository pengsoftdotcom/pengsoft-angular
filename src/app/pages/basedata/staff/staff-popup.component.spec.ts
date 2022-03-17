import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffPopupComponent } from './staff-popup.component';

describe('StaffPopupComponent', () => {
    let component: StaffPopupComponent;
    let fixture: ComponentFixture<StaffPopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StaffPopupComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StaffPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
