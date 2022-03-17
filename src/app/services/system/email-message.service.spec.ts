import { TestBed } from '@angular/core/testing';

import { EmailMessageService } from './email-message.service';

describe('EmailMessageService', () => {
    let service: EmailMessageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EmailMessageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
