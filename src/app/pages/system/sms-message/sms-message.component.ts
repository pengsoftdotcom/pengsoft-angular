import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { SecurityService } from 'src/app/services/support/security.service';
import { SmsMessageService } from 'src/app/services/system/sms-message.service';
import { FieldUtils } from 'src/app/utils/field-utils';
import { UserPopupComponent } from '../../security/user/user-popup.component';

@Component({
    selector: 'app-sms-message',
    templateUrl: './sms-message.component.html',
    styleUrls: ['./sms-message.component.scss']
})
export class SmsMessageComponent extends EntityComponent<SmsMessageService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    @ViewChild('content', { static: true }) content!: TemplateRef<any>;

    constructor(
        public override entity: SmsMessageService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService) {
        super(entity, security, modal, message);
    }

    initFields(): Field[] {
        return [
            FieldUtils.buildPopup({
                code: 'sender', name: '发件人',
                edit: { required: true, input: { popupComponent: UserPopupComponent, popupComponentSelectRowCode: 'username' } },
                list: { width: 120, align: 'center', render: (f, row) => row.sender ? row.sender.username : '-' },
                filter: {},
            }),
            FieldUtils.buildPopup({
                code: 'receiver', name: '收件人',
                edit: { required: true, input: { popupComponent: UserPopupComponent, popupComponentSelectRowCode: 'username' } },
                list: { width: 120, align: 'center', render: (f, row) => row.receiver ? row.receiver.username : '-' },
                filter: {},
            }),
            FieldUtils.buildTextarea({ code: 'content', name: '内容', list: { visible: true } }),
            FieldUtils.buildDatetime({ code: 'sentAt', name: '发送时间' })
        ];
    }

}
