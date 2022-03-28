import { Injectable } from '@angular/core';
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

}
