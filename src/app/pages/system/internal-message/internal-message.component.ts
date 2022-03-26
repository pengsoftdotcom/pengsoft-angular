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
            FieldUtils.buildSelect({ code: 'sender', name: '发件人', list: { width: 150, align: 'center', render: (field: Field, row: any) => row.sender.username } }),
            FieldUtils.buildSelect({ code: 'receiver', name: '收件人', list: { width: 150, align: 'center', render: (field: Field, row: any) => row.receiver.username } }),
            FieldUtils.buildText({ code: 'subject', name: '主题' }),
            FieldUtils.buildTextarea({ code: 'content', name: '内容' }),
            FieldUtils.buildDatetime({ code: 'sentAt', name: '发送时间' }),
            FieldUtils.buildDatetime({ code: 'readAt', name: '阅读时间' })
        ];
    }

}
