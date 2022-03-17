import { Injectable } from '@angular/core';
import { EntityService } from '../support/entity.service';
import { HttpOptions } from '../support/http-options';
import { HttpService } from '../support/http.service';

@Injectable({
    providedIn: 'root'
})
export class PayrollDetailService extends EntityService {

    constructor(protected override http: HttpService) { super(http); }

    get modulePath(): string {
        return 'oa';
    }

    get entityPath(): string {
        return 'payroll-detail';
    }

    confirm(id: string, options: HttpOptions): void {
        const url = this.getApiPath('confirm');
        options.params = { id };
        this.http.request('PUT', url, options);
    }

}
