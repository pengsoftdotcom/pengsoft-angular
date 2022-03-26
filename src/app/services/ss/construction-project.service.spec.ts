import { TestBed } from '@angular/core/testing';

import { ConstructionProjectService } from './construction-project.service';

describe('ConstructionProjectService', () => {
    let service: ConstructionProjectService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ConstructionProjectService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
