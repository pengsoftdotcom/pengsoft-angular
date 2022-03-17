import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositeMessageTemplateComponent } from './composite-message-template.component';

describe('CompositeMessageTemplateComponent', () => {
    let component: CompositeMessageTemplateComponent;
    let fixture: ComponentFixture<CompositeMessageTemplateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CompositeMessageTemplateComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CompositeMessageTemplateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
