import { Injectable } from '@angular/core';
import { Page } from 'src/app/components/support/list/page';
import { EntityService } from '../support/entity.service';
import { HttpOptions } from '../support/http-options';
import { HttpService } from '../support/http.service';

@Injectable({
    providedIn: 'root'
})
export class ContractService extends EntityService {

    constructor(protected override http: HttpService) { super(http); }

    get modulePath(): string {
        return 'oa';
    }

    get entityPath(): string {
        return 'contract';
    }

    generate(options: HttpOptions): void {
        const url = this.getApiPath('generate');
        this.http.request('POST', url, options);
    }

    override findOne(id: string, options: HttpOptions): void {
        this.findOneWithParty(id, options);
    }

    findOneWithParty(id: string, options: HttpOptions): void {
        const url = this.getApiPath('find-one-with-party');
        if (id) {
            options.params = { id };
        }
        this.http.request('GET', url, options);
    }

    override findPage(params: any, pageData: Page, options: HttpOptions): void {
        this.findPageWithParty(params, pageData, options);
    }

    findPageWithParty(params: any, pageData: Page, options: HttpOptions): void {
        const url = this.getApiPath('find-page-with-party');
        const result = this.handleParams(params);
        result.page = pageData.page - 1;
        result.size = pageData.size;
        result.sort = pageData.sort?.map(s => s.code + ',' + s.direction);
        options.params = result;
        this.http.request('GET', url, options);
    }

    override save(form: any, options: HttpOptions): void {
        options.failure = () => {
            if (options.errors['partyAId']) {
                options.errors['partyA'] = options.errors['partyAId'];
            }

            if (options.errors['partyBId']) {
                options.errors['partyB'] = options.errors['partyBId'];
            }
        };
        const url = this.getApiPath('save-with-pictures');
        options.params = {};
        if (form.pictures && form.pictures.length > 0) {
            options.params['picture.id'] = form.pictures.map((picture: any) => picture.id);
        }
        if (form.confirmPictures && form.confirmPictures.length > 0) {
            options.params['confirmPicture.id'] = form.confirmPictures.map((picture: any) => picture.id);
        }
        delete form.pictures;
        delete form.confirmPictures;
        options.body = JSON.parse(JSON.stringify(form));
        this.http.request('POST', url, options);
    }

    deletePictureByAsset(form: any, asset: any, options: HttpOptions): void {
        const url = this.getApiPath('delete-picture-by-asset');
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

    confirm(id: string, options: HttpOptions): void {
        const url = this.getApiPath('confirm');
        options.params = { id };
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
