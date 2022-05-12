import { Injectable } from '@angular/core';
import { HttpOptions } from '../support/http-options';
import { HttpService } from '../support/http.service';
import { TreeEntityService } from '../support/tree-entity.service';

@Injectable({
    providedIn: 'root'
})
export class ConstructionProjectService extends TreeEntityService {

    constructor(protected override http: HttpService) { super(http); }

    get modulePath(): string {
        return 'ss';
    }

    get entityPath(): string {
        return 'construction-project';
    }

    importData(file: File, options: HttpOptions): void {
        const url = this.getApiPath('import-data');
        const formData = new FormData();
        formData.append('file', file);
        options.body = formData;
        options.headers = {
            'Content-Type': 'multipart/form-data'
        };
        this.http.request('POST', url, options);
    }

}
