import { Injectable } from '@angular/core';
import { EntityService } from '../support/entity.service';
import { HttpService } from '../support/http.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService extends EntityService {

    constructor(protected override http: HttpService) { super(http); }

    get modulePath(): string {
        return 'iot';
    }

    get entityPath(): string {
        return 'product';
    }

}
