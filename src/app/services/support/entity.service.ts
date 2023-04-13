import { Page } from 'src/app/components/support/list/page';
import { Sort } from 'src/app/components/support/list/sort';
import { BaseService } from './base.service';
import { HttpOptions } from './http-options';
import { HttpService } from './http.service';

export abstract class EntityService extends BaseService {

    constructor(protected http: HttpService) { super(); }

    abstract get modulePath(): string;

    abstract get entityPath(): string;

    override getApiPath(path: string): string {
        return super.getApiPath('/' + [this.modulePath, this.entityPath, path].join('/'));
    }

    save(form: any, options: HttpOptions): void {
        const url = this.getApiPath('save');
        options.body = JSON.parse(JSON.stringify(form));
        this.http.request('POST', url, options);
    }

    delete(ids: string[], options: HttpOptions): void {
        const url = this.getApiPath('delete');
        options.params = { id: ids };
        this.http.request('DELETE', url, options);
    }

    enable(ids: string[], options: HttpOptions): void {
        const url = this.getApiPath('enable');
        options.params = { id: ids };
        this.http.request('PUT', url, options);
    }

    disable(ids: string[], options: HttpOptions): void {
        const url = this.getApiPath('disable');
        options.params = { id: ids };
        this.http.request('PUT', url, options);
    }

    sort(sortInfo: any, options: HttpOptions): void {
        const url = this.getApiPath('sort');
        options.body = sortInfo;
        this.http.request('PUT', url, options);
    }

    findOne(id: string, options: HttpOptions): void {
        const url = this.getApiPath('find-one');
        if (id) {
            options.params = { id };
        }
        this.http.request('GET', url, options);
    }

    findPage(params: any, pageData: Page, options: HttpOptions): void {
        const url = this.getApiPath('find-page');
        const result = this.handleParams(params);
        result.page = pageData.page - 1;
        result.size = pageData.size;
        result.sort = pageData.sort?.map(s => s.code + ',' + s.direction);
        options.params = result;
        this.http.request('GET', url, options);
    }

    findAll(params: any, sortData: Sort[], options: HttpOptions): void {
        const url = this.getApiPath('find-all');
        const result = this.handleParams(params);
        if (sortData) {
            result.sort = sortData.map(s => s.code + ',' + s.direction);
        }
        options.params = result;
        this.http.request('GET', url, options);
    }

    handleParams(params: any): any {
        if (params) {
            const result: any = {};
            for (const key in params) {
                const val = params[key];
                if (val && JSON.stringify(val) !== '{}') {
                    if (typeof val === 'object' && val?.id) {
                        result[key + '.id'] = val.id;
                    } else {
                        result[key] = val;
                    }
                }
            }
            return result;
        } else {
            return {};
        }
    }

}
