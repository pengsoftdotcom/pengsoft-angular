import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonFaceDataComponent } from './person-face-data.component';

describe('PersonFaceDataComponent', () => {
    let component: PersonFaceDataComponent;
    let fixture: ComponentFixture<PersonFaceDataComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PersonFaceDataComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PersonFaceDataComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
