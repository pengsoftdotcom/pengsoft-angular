import { Injectable } from '@angular/core';
import { EntityService } from '../support/entity.service';
import { HttpOptions } from '../support/http-options';
import { HttpService } from '../support/http.service';

@Injectable({
    providedIn: 'root'
})
export class PayrollRecordService extends EntityService {

    constructor(protected override http: HttpService) { super(http); }

    get modulePath(): string {
        return 'oa';
    }

    get entityPath(): string {
        return 'payroll-record';
    }

    override save(form: any, options: HttpOptions): void {
        const url = this.getApiPath('save-with-confirm-pictures');
        options.params = {};
        if (form.confirmPictures && form.confirmPictures.length > 0) {
            options.params['confirmPicture.id'] = form.confirmPictures.map((picture: any) => picture.id);
        }
        delete form.confirmPictures;
        options.body = JSON.parse(JSON.stringify(form));
        this.http.request('POST', url, options);
    }

    override findOne(id: string, options: HttpOptions): void {
        this.findOneWithConfirmPictures(id, options);
    }

    findOneWithConfirmPictures(id: string, options: HttpOptions): void {
        const url = this.getApiPath('find-one-with-confirm-pictures');
        if (id) {
            options.params = { id };
        }
        this.http.request('GET', url, options);
    }

    deleteSheetByAsset(form: any, asset: any, options: HttpOptions): void {
        const url = this.getApiPath('delete-sheet-by-asset');
        options.params = {
            'asset.id': asset.id
        };
        if (form && form.id) {
            options.params['id'] = form.id;
        }
        this.http.request('DELETE', url, options);
    }

    deleteConfirmPictureByAsset(form: any, asset: any, options: HttpOptions): void {
        const url = this.getApiPath('delete-confirm-picture-by-asset');
        options.params = {
            'asset.id': asset.id
        };
        if (form && form.id) {
            options.params['id'] = form.id;
        }
        this.http.request('DELETE', url, options);
    }

}
