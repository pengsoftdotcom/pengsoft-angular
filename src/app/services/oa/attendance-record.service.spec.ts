import { TestBed } from '@angular/core/testing';

import { AttendanceRecordService } from './attendance-record.service';

describe('AttendanceRecordService', () => {
    let service: AttendanceRecordService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AttendanceRecordService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
