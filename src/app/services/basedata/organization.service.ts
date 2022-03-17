import { Injectable } from '@angular/core';
import { HttpOptions } from '../support/http-options';
import { HttpService } from '../support/http.service';
import { TreeEntityService } from '../support/tree-entity.service';

@Injectable({
    providedIn: 'root'
})
export class OrganizationService extends TreeEntityService {

    constructor(protected override http: HttpService) { super(http); }

    get modulePath(): string {
        return 'basedata';
    }

    get entityPath(): string {
        return 'organization';
    }

    submit(id: string, options: HttpOptions): void {
        const url = this.getApiPath('submit');
        options.params = { id };
        this.http.request('PUT', url, options);
    }

    authenticate(id: string, authenticated: boolean, options: HttpOptions): void {
        const url = this.getApiPath('authenticate');
        options.params = { id, authenticated };
        this.http.request('POST', url, options);
    }

    setAdmin(organization: any, admin: any, options: HttpOptions): void {
        const url = this.getApiPath('set-admin');
        options.params = { 'id': organization.id };
        if (admin) {
            options.body = JSON.parse(JSON.stringify(admin));
        }
        this.http.request('POST', url, options);
    }

    setLegalRepresentative(organization: any, legalRepresentative: any, options: HttpOptions): void {
        const url = this.getApiPath('set-legal-representative');
        options.params = { 'id': organization.id };
        if (legalRepresentative) {
            options.body = JSON.parse(JSON.stringify(legalRepresentative));
        }
        this.http.request('POST', url, options);
    }

    setBusinessLicense(organization: any, businessLicense: any, options: HttpOptions): void {
        const url = this.getApiPath('set-business-license');
        options.params = { 'id': organization.id };
        if (businessLicense) {
            options.body = JSON.parse(JSON.stringify(businessLicense));
        }
        this.http.request('POST', url, options);
    }

    recgonizeBusinessLicense(asset: any, options: HttpOptions) {
        const url = this.getApiPath('recognize-business-license');
        options.params = { 'asset.id': asset.id };
        this.http.request('POST', url, options);
    }

    deleteLogoByAsset(organization: any, asset: any, options: HttpOptions) {
        const url = this.getApiPath('delete-logo-by-asset');
        options.params = { 'asset.id': asset.id };
        if (organization && organization.id) {
            options.params['id'] = organization.id;
        }
        this.http.request('DELETE', url, options);
    }

    getAdmin(organization: any, options: HttpOptions): void {
        const url = this.getApiPath('get-admin');
        options.params = { 'id': organization.id };
        this.http.request('GET', url, options);
    }

    getLegalRepresentative(organization: any, options: HttpOptions): void {
        const url = this.getApiPath('get-legal-representative');
        options.params = { 'id': organization.id };
        this.http.request('GET', url, options);
    }

    getBusinessLicense(organization: any, options: HttpOptions): void {
        const url = this.getApiPath('get-business-license');
        options.params = { 'id': organization.id };
        this.http.request('GET', url, options);
    }

    findPageOfAvailableConsumers(supplier: any, options: HttpOptions): void {
        const url = this.getApiPath('find-page-of-available-consumers');
        options.params = { 'supplier.id': supplier.id };
        this.http.request('GET', url, options);
    }

    findAllAvailableConsumers(supplier: any, options: HttpOptions): void {
        const url = this.getApiPath('find-all-available-consumers');
        options.params = { 'supplier.id': supplier.id };
        this.http.request('GET', url, options);
    }

    findPageOfAvailableSuppliers(consumner: any, options: HttpOptions): void {
        const url = this.getApiPath('find-page-of-available-suppliers');
        options.params = { 'consumer.id': consumner.id };
        this.http.request('GET', url, options);
    }

    findAllAvailableSuppliers(consumner: any, options: HttpOptions): void {
        const url = this.getApiPath('find-all-available-suppliers');
        options.params = { 'consumer.id': consumner.id };
        this.http.request('GET', url, options);
    }

}
