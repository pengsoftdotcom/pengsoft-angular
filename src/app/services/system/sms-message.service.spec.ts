import { TestBed } from '@angular/core/testing';

import { SmsMessageService } from './sms-message.service';

describe('SmsMessageService', () => {
    let service: SmsMessageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SmsMessageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
