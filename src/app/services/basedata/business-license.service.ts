import { Injectable } from '@angular/core';
import { EntityService } from '../support/entity.service';
import { HttpOptions } from '../support/http-options';
import { HttpService } from '../support/http.service';

@Injectable({
    providedIn: 'root'
})
export class BusinessLicenseService extends EntityService {

    constructor(protected override http: HttpService) { super(http); }

    get modulePath(): string {
        return 'basedata';
    }

    get entityPath(): string {
        return 'business-license';
    }

    recgonize(id: string, options: HttpOptions): void {
        const url = this.getApiPath('recognize');
        options.params = { id };
        this.http.request('GET', url, options);
    }

}
