import { Injectable } from '@angular/core';
import { EntityService } from '../support/entity.service';
import { HttpOptions } from '../support/http-options';
import { HttpService } from '../support/http.service';

@Injectable({
    providedIn: 'root'
})
export class SafetyTrainingService extends EntityService {

    constructor(protected override http: HttpService) { super(http); }

    get modulePath(): string {
        return 'ss';
    }

    get entityPath(): string {
        return 'safety-training';
    }

    saveAndSubmit(form: any, options: HttpOptions): void {
        const url = this.getApiPath('save-and-submit');
        options.body = JSON.parse(JSON.stringify(form));
        this.http.request('POST', url, options);
    }

    submit(id: string, options: HttpOptions): void {
        const url = this.getApiPath('submit');
        options.params = { id }
        this.http.request('PUT', url, options);
    }

    start(id: string, options: HttpOptions): void {
        const url = this.getApiPath('start');
        options.params = { id }
        this.http.request('PUT', url, options);
    }

    end(id: string, options: HttpOptions): void {
        const url = this.getApiPath('end');
        options.params = { id }
        this.http.request('PUT', url, options);
    }

}
