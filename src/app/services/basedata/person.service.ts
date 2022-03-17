import { Injectable } from '@angular/core';
import { EntityService } from '../support/entity.service';
import { HttpOptions } from '../support/http-options';
import { HttpService } from '../support/http.service';

@Injectable({
    providedIn: 'root'
})
export class PersonService extends EntityService {

    constructor(protected override http: HttpService) { super(http); }

    get modulePath(): string {
        return 'basedata';
    }

    get entityPath(): string {
        return 'person';
    }

    deleteLogoByAsset(person: any, asset: any, options: HttpOptions) {
        const url = this.getApiPath('delete-avatar-by-asset');
        options.params = { 'asset.id': asset.id };
        if (person && person.id) {
            options.params['id'] = person.id;
        }
        this.http.request('DELETE', url, options);
    }

}
