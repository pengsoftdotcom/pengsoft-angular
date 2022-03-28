import { TestBed } from '@angular/core/testing';

import { SafetyCheckService } from './safety-check.service';

describe('SafetyCheckService', () => {
    let service: SafetyCheckService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SafetyCheckService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
