import { TestBed } from '@angular/core/testing';
import { PayrollRecordService } from './payroll-record.service';

describe('PayrollRecordService', () => {
    let service: PayrollRecordService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PayrollRecordService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
