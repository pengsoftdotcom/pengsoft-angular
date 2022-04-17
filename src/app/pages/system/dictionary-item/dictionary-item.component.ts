import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { TreeEntityComponent } from 'src/app/components/support/tree-entity.component';
import { SecurityService } from 'src/app/services/support/security.service';
import { DictionaryItemService } from 'src/app/services/system/dictionary-item.service';
import { FieldUtils } from 'src/app/utils/field-utils';

@Component({
    selector: 'app-dictionary-item',
    templateUrl: './dictionary-item.component.html',
    styleUrls: ['./dictionary-item.component.scss']
})
export class DictionaryItemComponent extends TreeEntityComponent<DictionaryItemService> implements OnInit {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    type: any;

    constructor(
        public override security: SecurityService,
        public override entity: DictionaryItemService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    override get parentQueryParams(): any {
        return { 'type.id': this.type.id };
    }

    override get tree(): boolean {
        if (this.type) {
            return this.type.tree;
        } else {
            return true;
        }
    }

    override initFields(): Field[] {
        const fields = super.initFields().concat(
            FieldUtils.buildSelect({ code: 'type', name: '类型', list: { visible: false }, edit: { visible: false } }),
            FieldUtils.buildTextForCode({ width: 200 }),
            FieldUtils.buildTextForName(),
            FieldUtils.buildTextareaForRemark());
        fields.forEach(field => {
            if (field.code === 'parent' && field.edit) {
                field.edit.visible = this.type.tree;
            }
        });
        return fields;

    }

    override afterInit(): void {
        this.filterForm = { 'type.id': this.type.id };
        this.editForm = { type: this.type };
        super.afterInit();
    }

    override afterEdit(row?: any): void {
        super.afterEdit(row);
        if (!this.editForm.id) {
            this.editForm.type = this.type;
        }
    }

    override afterFilterFormReset(): void {
        this.filterForm = { 'type.id': this.type.id };
        this.list();
    }

}
