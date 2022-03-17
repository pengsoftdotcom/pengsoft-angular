import { TestBed } from '@angular/core/testing';

import { InternalMessageService } from './internal-message.service';

describe('InternalMessageService', () => {
    let service: InternalMessageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(InternalMessageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
