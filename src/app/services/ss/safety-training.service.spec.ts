import { TestBed } from '@angular/core/testing';

import { SafetyTrainingService } from './safety-training.service';

describe('SafetyTrainingService', () => {
    let service: SafetyTrainingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SafetyTrainingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
