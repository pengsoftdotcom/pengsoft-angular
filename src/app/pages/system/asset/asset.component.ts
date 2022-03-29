import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Button } from 'src/app/components/support/button/button';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { AssetService } from 'src/app/services/basedata/asset.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { FieldUtils } from 'src/app/utils/field-utils';

@Component({
    selector: 'app-asset',
    templateUrl: './asset.component.html',
    styleUrls: ['./asset.component.scss']
})
export class AssetComponent extends EntityComponent<AssetService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    @ViewChild('content', { static: true }) content!: TemplateRef<any>;

    constructor(
        public override entity: AssetService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService) {
        super(entity, security, modal, message);
    }

    initFields(): Field[] {
        return [
            FieldUtils.buildText({
                code: 'originalName', name: '原名称',
                edit: { readonly: true },
                filter: { readonly: false }
            }),
            FieldUtils.buildText({
                code: 'presentName', name: '现名称',
                list: { visible: false },
                edit: { readonly: true },
                filter: { readonly: false }
            }),
            FieldUtils.buildText({ code: 'storagePath', name: '存储地址', list: { visible: false }, edit: { readonly: true } }),
            FieldUtils.buildText({ code: 'accessPath', name: '访问地址', list: { visible: false }, edit: { readonly: true } }),
            FieldUtils.buildText({ code: 'contentType', name: 'MIME类型', edit: { readonly: true } }),
            FieldUtils.buildNumber({
                code: 'contentLength', name: '大小(B)', edit: { readonly: true },
                filter: { readonly: false, input: { placeholder: '小于录入的值' } }
            }),
            FieldUtils.buildBooleanForLocked(),
            FieldUtils.buildDatetimeForCreatedAt()
        ];
    }

    override initListToolbar(): Button[] {
        const buttons = super.initListToolbar();
        const index = buttons.findIndex(button => button.name === '新增');
        if (index > -1) {
            buttons.splice(index, 1);
        }
        return buttons;
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        buttons.forEach(button => {
            if (button.name === '修改') {
                button.name = '查看';
            }
        })
        return buttons;
    }

    override initEditToolbar(): Button[] {
        return [];
    }

}
