import { TestBed } from '@angular/core/testing';

import { CompositeMessageTemplateService } from './composite-message-template.service';

describe('CompositeMessageTemplateService', () => {
    let service: CompositeMessageTemplateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CompositeMessageTemplateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
