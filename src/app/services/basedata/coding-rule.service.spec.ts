import { TestBed } from '@angular/core/testing';

import { CodingRuleService } from './coding-rule.service';

describe('CodingRuleService', () => {
    let service: CodingRuleService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CodingRuleService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
