import { TestBed } from '@angular/core/testing';

import { PersonFaceDataService } from './person-face-data.service';

describe('PersonFaceDataService', () => {
    let service: PersonFaceDataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PersonFaceDataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
