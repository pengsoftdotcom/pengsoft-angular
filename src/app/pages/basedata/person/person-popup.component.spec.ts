import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonPopupComponent } from './person-popup.component';

describe('PersonPopupComponent', () => {
    let component: PersonPopupComponent;
    let fixture: ComponentFixture<PersonPopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PersonPopupComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PersonPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
