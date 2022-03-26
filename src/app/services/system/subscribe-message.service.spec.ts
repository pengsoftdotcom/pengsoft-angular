import { TestBed } from '@angular/core/testing';

import { SubscribeMessageService } from './subscribe-message.service';

describe('SubscribeMessageService', () => {
    let service: SubscribeMessageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SubscribeMessageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
