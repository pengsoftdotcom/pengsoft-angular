import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Button } from 'src/app/components/support/button/button';
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

    override ngOnInit(): void {
        super.ngOnInit();
        this.editComponent.width = '40%';
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
                    FieldUtils.buildText({ code: 'templateCode', name: '模版', edit: { required: true } }),
                    FieldUtils.buildTextarea({ code: 'content', name: '内容', edit: { required: true } }),
                    FieldUtils.buildDatetime({ code: 'sentAt', name: '发送时间' })
                ]
            }),
            FieldUtils.buildText({
                code: 'email', name: '邮件消息', list: { visible: false, childrenVisible: false }, children: [
                    FieldUtils.buildText({ code: 'subject', name: '主题', edit: { required: true } }),
                    FieldUtils.buildTextarea({ code: 'content', name: '内容', edit: { required: true } }),
                    FieldUtils.buildDatetime({ code: 'sentAt', name: '发送时间' })
                ]
            }),
            FieldUtils.buildText({
                code: 'subscribe', name: '订阅消息', list: { visible: false, childrenVisible: false }, children: [
                    FieldUtils.buildText({ code: 'appid', name: 'APP ID', edit: { required: true } }),
                    FieldUtils.buildText({ code: 'templateId', name: '模版', edit: { required: true } }),
                    FieldUtils.buildText({ code: 'page', name: '页面' }),
                    FieldUtils.buildText({ code: 'subject', name: '标题', edit: { required: true } }),
                    FieldUtils.buildTextarea({ code: 'content', name: '内容', edit: { required: true } }),
                    FieldUtils.buildDatetime({ code: 'sentAt', name: '发送时间' })
                ]
            })
        ];
    }

    override initEditToolbar(): Button[] {
        const buttons = super.initEditToolbar();
        buttons.push({ name: '清除站内消息', type: 'primary', size: 'default', action: () => this.editForm.internal = {} });
        buttons.push({ name: '清除推送消息', type: 'primary', size: 'default', action: () => this.editForm.push = {} });
        buttons.push({ name: '清除短信消息', type: 'primary', size: 'default', action: () => this.editForm.sms = {} });
        buttons.push({ name: '清除邮件消息', type: 'primary', size: 'default', action: () => this.editForm.email = {} });
        buttons.push({ name: '清除订阅消息', type: 'primary', size: 'default', action: () => this.editForm.subscribe = {} });
        return buttons;
    }

    override afterEdit(row?: any): void {
        super.afterEdit(row);
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
        if (!this.editForm.subscribe) {
            this.editForm.subscribe = {};
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
        if (JSON.stringify(form.subscribe) === '{}') {
            delete form.subscribe;
        }
        return form;
    }

}
