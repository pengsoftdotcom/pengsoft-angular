import { TestBed } from '@angular/core/testing';
import { OAuthService } from './oauth.service';


describe('OAuthService', () => {
    let service: OAuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OAuthService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
