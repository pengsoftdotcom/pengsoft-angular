import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { SecurityService } from 'src/app/services/support/security.service';
import { CompositeMessageTemplateService } from 'src/app/services/system/composite-message-template.service';
import { FieldUtils } from 'src/app/utils/field-utils';

@Component({
    selector: 'app-composite-message-template',
    templateUrl: './composite-message-template.component.html',
    styleUrls: ['./composite-message-template.component.scss']
})
export class CompositeMessageTemplateComponent extends EntityComponent<CompositeMessageTemplateService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    @ViewChild('content', { static: true }) content!: TemplateRef<any>;

    constructor(
        public override entity: CompositeMessageTemplateService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService) {
        super(entity, security, modal, message);
    }

    initFields(): Field[] {
        return [
            FieldUtils.buildTextForCode(),
            FieldUtils.buildTextForName(),
            FieldUtils.buildText({
                code: 'internal', name: '站内消息', list: { visible: false, childrenVisible: false }, children: [
                    FieldUtils.buildText({ code: 'subject', name: '标题', edit: { required: true } }),
                    FieldUtils.buildTextarea({ code: 'content', name: '内容', edit: { required: true } }),
                    FieldUtils.buildDatetime({ code: 'sentAt', name: '发送时间' })
                ]
            }),
            FieldUtils.buildText({
                code: 'push', name: '推送消息', list: { visible: false, childrenVisible: false }, children: [
                    FieldUtils.buildText({ code: 'subject', name: '标题', edit: { required: true } }),
                    FieldUtils.buildTextarea({ code: 'content', name: '内容', edit: { required: true } }),
                    FieldUtils.buildDatetime({ code: 'sentAt', name: '发送时间' })
                ]
            }),
            FieldUtils.buildText({
                code: 'sms', name: '短信消息', list: { visible: false, childrenVisible: false }, children: [
                    FieldUtils.buildText({ code: 'signName', name: '签名', edit: { required: true } }),
                    FieldUtils.buildText({ code: 'templateCode', name: '模版编码', edit: { required: true } }),
                    FieldUtils.buildTextarea({ code: 'content', name: '内容', edit: { required: true } }),
                    FieldUtils.buildDatetime({ code: 'sentAt', name: '发送时间' })
                ]
            }),
            FieldUtils.buildText({
                code: 'email', name: '邮件消息', list: { visible: false, childrenVisible: false }, children: [
                    FieldUtils.buildText({ code: 'subject', name: '标题', edit: { required: true } }),
                    FieldUtils.buildTextarea({ code: 'content', name: '内容', edit: { required: true } }),
                    FieldUtils.buildDatetime({ code: 'sentAt', name: '发送时间' })
                ]
            })
        ];
    }

    override afterEdit(): void {
        if (!this.editForm.internal) {
            this.editForm.internal = {};
        }
        if (!this.editForm.push) {
            this.editForm.push = {};
        }
        if (!this.editForm.sms) {
            this.editForm.sms = {};
        }
        if (!this.editForm.email) {
            this.editForm.email = {};
        }
    }


    override buildEditForm(): any {
        const form = super.buildEditForm();
        if (JSON.stringify(form.internal) === '{}') {
            delete form.internal;
        }
        if (JSON.stringify(form.push) === '{}') {
            delete form.push;
        }
        if (JSON.stringify(form.sms) === '{}') {
            delete form.sms;
        }
        if (JSON.stringify(form.email) === '{}') {
            delete form.email;
        }
        return form;
    }

}
