import { TestBed } from '@angular/core/testing';

import { SafetyTrainingParticipantService } from './safety-training-participant.service';

describe('SafetyTrainingParticipantService', () => {
    let service: SafetyTrainingParticipantService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SafetyTrainingParticipantService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
