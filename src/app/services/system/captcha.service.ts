import { Injectable } from '@angular/core';
import { EntityService } from '../support/entity.service';
import { HttpOptions } from '../support/http-options';
import { HttpService } from '../support/http.service';

@Injectable({
    providedIn: 'root'
})
export class CaptchaService extends EntityService {

    constructor(protected override http: HttpService) { super(http); }

    get modulePath(): string {
        return 'system';
    }

    get entityPath(): string {
        return 'captcha';
    }

    generate(username: string, options: HttpOptions): void {
        const url = this.getApiPath('generate');
        options.params = { username };
        this.http.request('POST', url, options);
    }

}
