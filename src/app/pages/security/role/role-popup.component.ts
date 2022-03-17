import { Component, ViewChild } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Button } from 'src/app/components/support/button/button';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { TreeEntityComponent } from 'src/app/components/support/tree-entity.component';
import { RoleService } from 'src/app/services/security/role.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { RoleComponent } from './role.component';

@Component({
    selector: 'app-role-popup',
    templateUrl: './role-popup.component.html',
    styleUrls: ['./role-popup.component.scss']
})
export class RolePopupComponent extends RoleComponent {

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
        return [{
            name: '复制',
            type: 'link',
            width: 30,
            authority: 'security::role::copy_authorities',
            action: (row: any) => this.copy(row)
        }];
    }

    copy(role: any) {
        //
    }

}
