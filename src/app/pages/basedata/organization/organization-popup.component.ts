import { Component } from '@angular/core';
import { Button } from 'src/app/components/support/button/button';
import { OrganizationComponent } from './organization.component';

@Component({
    selector: 'app-organization-popup',
    templateUrl: './organization-popup.component.html',
    styleUrls: ['./organization-popup.component.scss']
})
export class OrganizationPopupComponent extends OrganizationComponent {

    action = '选择';

    override initListToolbar(): Button[] {
        return [
            { name: '刷新', icon: 'reload', action: () => this.list(), authority: this.getAuthority('findPage') + ', ' + this.getAuthority('findAll') },
            {
                name: '搜索',
                authority: this.getAuthority('findPage') + ', ' + this.getAuthority('findAll'),
                action: () => this.filter()
            }]
    }

    override initListAction(): Button[] {
        return [{ name: this.action, type: 'link', width: 30, action: (row: any) => this.select(row) }]
    }

    select(_row: any) {
        //
    }

}
