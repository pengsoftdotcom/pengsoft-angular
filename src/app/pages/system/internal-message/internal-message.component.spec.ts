import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalMessageComponent } from './internal-message.component';

describe('InternalMessageComponent', () => {
    let component: InternalMessageComponent;
    let fixture: ComponentFixture<InternalMessageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InternalMessageComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InternalMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
