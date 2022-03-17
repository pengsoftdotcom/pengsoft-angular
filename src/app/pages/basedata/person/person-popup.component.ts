import { Component } from '@angular/core';
import { Button } from 'src/app/components/support/button/button';
import { PersonComponent } from './person.component';

@Component({
    selector: 'app-person-popup',
    templateUrl: './person-popup.component.html',
    styleUrls: ['./person-popup.component.scss']
})
export class PersonPopupComponent extends PersonComponent {

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
