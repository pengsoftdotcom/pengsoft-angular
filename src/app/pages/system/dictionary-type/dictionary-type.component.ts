import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Button } from 'src/app/components/support/button/button';
import { EditOneToManyComponent } from 'src/app/components/support/edit-one-to-many/edit-one-to-many.component';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { SecurityService } from 'src/app/services/support/security.service';
import { DictionaryTypeService } from 'src/app/services/system/dictionary-type.service';
import { FieldUtils } from 'src/app/utils/field-utils';
import { DictionaryItemComponent } from '../dictionary-item/dictionary-item.component';

@Component({
    selector: 'app-dictionary-type',
    templateUrl: './dictionary-type.component.html',
    styleUrls: ['./dictionary-type.component.scss']
})
export class DictionaryTypeComponent extends EntityComponent<DictionaryTypeService>  {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    @ViewChild('itemsComponent', { static: true }) itemsComponent!: EditOneToManyComponent;

    constructor(
        public override entity: DictionaryTypeService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    initFields(): Field[] {
        return [
            FieldUtils.buildTextForCode(),
            FieldUtils.buildTextForName(),
            FieldUtils.buildBooleanForLocked({ code: 'tree', name: '树形' }),
            FieldUtils.buildTextareaForRemark()
        ];
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        buttons.splice(0, 0, {
            name: '详情',
            type: 'link',
            width: 30,
            authority: 'system::dictionary_item::find_all',
            action: (row: any) => this.editItems(row)
        })
        return buttons;
    }

    editItems(row: any): void {
        this.itemsComponent.width = '40%';
        this.itemsComponent.component = DictionaryItemComponent;
        this.itemsComponent.params = { title: row.name, type: row };
        this.itemsComponent.show();
    }

}
