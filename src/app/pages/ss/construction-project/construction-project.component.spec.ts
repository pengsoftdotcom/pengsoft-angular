import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionProjectComponent } from './construction-project.component';

describe('ConstructionProjectComponent', () => {
    let component: ConstructionProjectComponent;
    let fixture: ComponentFixture<ConstructionProjectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConstructionProjectComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConstructionProjectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
