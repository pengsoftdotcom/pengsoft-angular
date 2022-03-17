import { Injectable } from '@angular/core';
import { EntityService } from '../support/entity.service';
import { HttpOptions } from '../support/http-options';
import { HttpService } from '../support/http.service';

@Injectable({
    providedIn: 'root'
})
export class IdentityCardService extends EntityService {

    constructor(protected override http: HttpService) { super(http); }

    get modulePath(): string {
        return 'basedata';
    }

    get entityPath(): string {
        return 'identity-card';
    }

    recgonize(id: string, side: string, options: HttpOptions): void {
        const url = this.getApiPath('recognize');
        options.params = { id, side };
        this.http.request('POST', url, options);
    }

}
