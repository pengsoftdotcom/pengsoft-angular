import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { Nav } from 'src/app/components/support/list/nav';
import { SecurityService } from 'src/app/services/support/security.service';
import { InternalMessageService } from 'src/app/services/system/internal-message.service';
import { FieldUtils } from 'src/app/utils/field-utils';

@Component({
    selector: 'app-internal-message',
    templateUrl: './internal-message.component.html',
    styleUrls: ['./internal-message.component.scss']
})
export class InternalMessageComponent extends EntityComponent<InternalMessageService>  {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    constructor(
        public override entity: InternalMessageService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }


    initFields(): Field[] {
        return [
            FieldUtils.buildText({ code: 'subject', name: '主题' })
        ];
    }

    override initNav(): Nav {
        return {
            showExpand: false,
            data: [{
                key: '收件箱',
                title: '收件箱',
                icon: 'inbox',
                isLeaf: true
            }, {
                key: '草稿',
                title: '草稿',
                icon: 'file',
                isLeaf: true
            }, {
                key: '已发送',
                title: '已发送',
                icon: 'send',
                isLeaf: true
            }, {
                key: '垃圾箱',
                title: '垃圾箱',
                icon: 'delete',
                isLeaf: true
            }]
        }
    }

}
