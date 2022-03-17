import { TestBed } from '@angular/core/testing';

import { AccessRecordService } from './access-record.service';

describe('AccessRecordService', () => {
    let service: AccessRecordService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AccessRecordService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
