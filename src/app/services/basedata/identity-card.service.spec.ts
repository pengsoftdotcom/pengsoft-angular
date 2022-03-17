import { TestBed } from '@angular/core/testing';

import { IdentityCardService } from './identity-card.service';

describe('IdentityCardService', () => {
    let service: IdentityCardService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(IdentityCardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
