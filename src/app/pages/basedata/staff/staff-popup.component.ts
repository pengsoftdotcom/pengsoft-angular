import { Component } from '@angular/core';
import { Button } from 'src/app/components/support/button/button';
import { StaffComponent } from './staff.component';

@Component({
    selector: 'app-staff-popup',
    templateUrl: './staff-popup.component.html',
    styleUrls: ['./staff-popup.component.scss']
})
export class StaffPopupComponent extends StaffComponent {

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
        return [{ name: '选择', type: 'link', width: 30, action: (row: any) => this.select(row) }]
    }

    select(row: any) {
        // 
    }

}
