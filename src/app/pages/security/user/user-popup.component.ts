import { Component, OnInit } from '@angular/core';
import { Button } from 'src/app/components/support/button/button';
import { UserComponent } from './user.component';

@Component({
    selector: 'app-user-popup',
    templateUrl: './user-popup.component.html',
    styleUrls: ['./user-popup.component.scss']
})
export class UserPopupComponent extends UserComponent {

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

    select(row: any) {
        //
    }


}
