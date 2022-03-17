import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodingRuleComponent } from './coding-rule.component';

describe('CodingRuleComponent', () => {
    let component: CodingRuleComponent;
    let fixture: ComponentFixture<CodingRuleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CodingRuleComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CodingRuleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
