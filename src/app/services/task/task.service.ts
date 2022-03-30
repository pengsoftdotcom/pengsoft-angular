import { Injectable } from '@angular/core';
import { EntityService } from '../support/entity.service';
import { HttpOptions } from '../support/http-options';
import { HttpService } from '../support/http.service';

@Injectable({
    providedIn: 'root'
})
export class TaskService extends EntityService {

    constructor(protected override http: HttpService) { super(http); }

    get modulePath(): string {
        return 'task';
    }

    get entityPath(): string {
        return 'task';
    }

    finish(id: string, options: HttpOptions) {
        const url = this.getApiPath('finish');
        options.params = { id };
        this.http.request('PUT', url, options);
    }

}
