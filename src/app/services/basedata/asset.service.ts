import { Injectable } from '@angular/core';
import { EntityService } from '../support/entity.service';
import { HttpOptions } from '../support/http-options';
import { HttpService } from '../support/http.service';

@Injectable({
    providedIn: 'root'
})
export class AssetService extends EntityService {

    constructor(protected override http: HttpService) { super(http); }

    get modulePath(): string {
        return 'system';
    }

    get entityPath(): string {
        return 'asset';
    }

    download(id: string, width: number | null, height: number | null, options: HttpOptions): void {
        const url = this.getApiPath('download');
        options.params = { id };
        if (width) {
            options.params['width'] = width;
        }
        if (height) {
            options.params['height'] = height;
        }
        this.http.request('GET', url, options);
    }

}
