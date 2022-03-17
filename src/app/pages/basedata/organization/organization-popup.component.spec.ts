import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationPopupComponent } from './organization-popup.component';

describe('OrganizationPopupComponent', () => {
    let component: OrganizationPopupComponent;
    let fixture: ComponentFixture<OrganizationPopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OrganizationPopupComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OrganizationPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
