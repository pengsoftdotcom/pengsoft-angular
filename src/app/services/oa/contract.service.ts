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
        options.failure = (err: any) => {
            if (options.errors['partyAId']) {
                options.errors['partyA'] = options.errors['partyAId'];
            }

            if (options.errors['partyBId']) {
                options.errors['partyB'] = options.errors['partyBId'];
            }
        };
        const url = this.getApiPath('save-with-pictures');
        options.params = {
            'picture.id': form.pictures?.map((picture: any) => picture.id)
        };
        delete form.pictures;
        options.body = JSON.parse(JSON.stringify(form));
        this.http.request('POST', url, options);
    }

    deletePictureByAsset(contract: any, asset: any, options: HttpOptions): void {
        const url = this.getApiPath('delete-picture-by-asset');
        options.params = {
            'asset.id': asset.id
        };
        if (contract && contract.id) {
            options.params['id'] = contract.id;
        }
        this.http.request('DELETE', url, options);
    }

    confirm(id: string, options: HttpOptions): void {
        const url = this.getApiPath('confirm');
        options.params = { id };
        this.http.request('PUT', url, options);
    }

}
