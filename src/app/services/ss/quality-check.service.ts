import { Injectable } from '@angular/core';
import { EntityService } from '../support/entity.service';
import { HttpOptions } from '../support/http-options';
import { HttpService } from '../support/http.service';

@Injectable({
    providedIn: 'root'
})
export class QualityCheckService extends EntityService {

    constructor(protected override http: HttpService) { super(http); }

    get modulePath(): string {
        return 'ss';
    }

    get entityPath(): string {
        return 'quality-check';
    }

    submit(form: any, options: HttpOptions): void {
        const url = this.getApiPath('submit');
        if (form.submitFiles) {
            options.params = { 'asset.id': form.submitFiles?.map((file: any) => file.id) };
        }
        options.body = JSON.parse(JSON.stringify(form));
        this.http.request('POST', url, options);
    }

    handle(form: any, options: HttpOptions): void {
        const url = this.getApiPath('handle');
        options.params = { id: form.id };
        if (form.result) {
            options.params['result'] = form.result
        }
        if (form.handleFiles) {
            options.params['asset.id'] = form.handleFiles?.map((file: any) => file.id)
        }
        this.http.request('PUT', url, options);
    }

    deleteFileByAsset(form: any, asset: any, options: HttpOptions): void {
        const url = this.getApiPath('delete-file-by-asset');
        options.params = {
            'asset.id': asset.id
        };
        if (form && form.id) {
            options.params['id'] = form.id;
        }
        this.http.request('DELETE', url, options);
    }

    override findOne(id: string, options: HttpOptions): void {
        const url = this.getApiPath('find-one-with-files');
        if (id) {
            options.params = { id };
        }
        this.http.request('GET', url, options);
    }

}
