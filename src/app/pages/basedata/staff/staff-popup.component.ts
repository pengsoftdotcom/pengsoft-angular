import { Component } from '@angular/core';
import { Button } from 'src/app/components/support/button/button';
import { StaffComponent } from './staff.component';

@Component({
    selector: 'app-staff-popup',
    templateUrl: './staff-popup.component.html',
    styleUrls: ['./staff-popup.component.scss']
})
export class StaffPopupComponent extends StaffComponent {

    multiple = false;

    params: any;

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
        return this.multiple ? [] : [{ name: '选择', type: 'link', width: 30, action: (row: any) => this.select(row) }];
    }

    select(row: any, listData?: any[]) {
        // 
    }

    override list(): void {
        this.entity.findPage(Object.assign(this.filterForm, this.params), this.pageData, {
            before: () => this.getListComponent().loading = true,
            success: (res: any) => {
                this.listData = res.content;
                this.pageData.total = res.totalElements;
            },
            after: () => {
                this.getListComponent().loading = false;
                this.uncheckAll();
            }
        });
    }

}
