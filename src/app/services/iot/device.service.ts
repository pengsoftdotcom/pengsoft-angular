import { Injectable } from '@angular/core';
import { Page } from 'src/app/components/support/list/page';
import { EntityService } from '../support/entity.service';
import { HttpOptions } from '../support/http-options';
import { HttpService } from '../support/http.service';

@Injectable({
    providedIn: 'root'
})
export class DeviceService extends EntityService {

    constructor(protected override http: HttpService) { super(http); }

    get modulePath(): string {
        return 'iot';
    }

    get entityPath(): string {
        return 'device';
    }

    override save(form: any, options: HttpOptions): void {
        this.saveWithGroups(form, options);
    }

    saveWithGroups(form: any, options: HttpOptions): void {
        const url = this.getApiPath('save-with-groups');
        if (form.groups) {
            options.params = { 'groups': form.groups };
            delete form.groups;
        }
        options.body = JSON.parse(JSON.stringify(form));
        this.http.request('POST', url, options);
    }

    override findOne(id: string, options: HttpOptions): void {
        this.findOneWithGroups(id, options);
    }

    findOneWithGroups(id: string, options: HttpOptions) {
        const url = this.getApiPath('find-one-with-groups');
        if (id) {
            options.params = { id };
        }
        this.http.request('GET', url, options);
    }

    override findPage(params: any, pageData: Page, options: HttpOptions): void {
        this.findPageByGroupAndName(params['group.id'], params['name'], pageData, options);
    }

    findPageByGroupAndName(groupId: string, name: string, pageData: Page, options: HttpOptions): void {
        const url = this.getApiPath('find-page-by-group-and-name');
        if (groupId) {
            const result: any = { 'group.id': groupId };
            if (name) {
                result.name = name;
            }
            result.page = pageData.page - 1;
            result.size = pageData.size;
            result.sort = pageData.sort?.map(s => s.code + ',' + s.direction);
            options.params = result;
            this.http.request('GET', url, options);
        }
    }

}
