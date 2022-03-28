import { Injectable } from '@angular/core';
import { Page } from 'src/app/components/support/list/page';
import { EntityService } from '../support/entity.service';
import { HttpOptions } from '../support/http-options';
import { HttpService } from '../support/http.service';

@Injectable({
    providedIn: 'root'
})
export class SafetyTrainingParticipantService extends EntityService {

    constructor(protected override http: HttpService) { super(http); }

    get modulePath(): string {
        return 'ss';
    }

    get entityPath(): string {
        return 'safety-training-participant';
    }

    confirm(form: any, options: HttpOptions): void {
        const url = this.getApiPath('confirm');
        options.params = {
            id: form.id,
        };
        if (form.reason) {
            options.params['reason'] = form.reason;
        }
        if (form.status) {
            options.params['status.id'] = form.status.id;
        }
        this.http.request('PUT', url, options);
    }

    confirmMine(form: any, options: HttpOptions): void {
        const url = this.getApiPath('confirm-mine');
        options.params = {
            id: form.id,
        };
        if (form.reason) {
            options.params['reason'] = form.reason;
        }
        if (form.status) {
            options.params['status.id'] = form.status.id;
        }
        this.http.request('PUT', url, options);
    }

    findOneOfMine(id: string, options: HttpOptions): void {
        const url = this.getApiPath('find-one-of-mine');
        if (id) {
            options.params = { id };
        }
        this.http.request('GET', url, options);
    }

    findPageOfMine(params: any, pageData: Page, options: HttpOptions): void {
        const url = this.getApiPath('find-page-of-mine');
        const result = this.handleParams(params);
        result.page = pageData.page - 1;
        result.size = pageData.size;
        result.sort = pageData.sort?.map(s => s.code + ',' + s.direction);
        options.params = result;
        this.http.request('GET', url, options);
    }

}
