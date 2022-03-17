import { Injectable } from '@angular/core';
import { HttpOptions } from '../support/http-options';
import { HttpService } from '../support/http.service';
import { TreeEntityService } from '../support/tree-entity.service';

@Injectable({
    providedIn: 'root'
})
export class GroupService extends TreeEntityService {

    constructor(protected override http: HttpService) { super(http); }

    get modulePath(): string {
        return 'iot';
    }

    get entityPath(): string {
        return 'group';
    }

    grantDevices(group: any, devices: any[], options: HttpOptions): void {
        const url = this.getApiPath('grant-devices');
        options.params = { 'group.id': group.id, 'device.id': devices.map(device => device.id) };
        this.http.request('POST', url, options);
    }

    findAllGroupDevicesByGroup(group: any, options: HttpOptions) {
        const url = this.getApiPath('find-all-group-devices-by-group');
        options.params = { id: group.id };
        this.http.request('GET', url, options);
    }

}
