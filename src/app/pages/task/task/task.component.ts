import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Button } from 'src/app/components/support/button/button';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { SecurityService } from 'src/app/services/support/security.service';
import { DictionaryItemService } from 'src/app/services/system/dictionary-item.service';
import { TaskService } from 'src/app/services/task/task.service';
import { FieldUtils } from 'src/app/utils/field-utils';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss']
})
export class TaskComponent extends EntityComponent<TaskService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    constructor(
        private router: Router,
        private dictionaryItem: DictionaryItemService,
        public override entity: TaskService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService) {
        super(entity, security, modal, message);
    }

    initFields(): Field[] {
        return [
            FieldUtils.buildText({ code: 'name', name: '名称', list: { width: 150 } }),
            FieldUtils.buildTextarea({ code: 'content', name: '内容', list: { visible: true } }),
            FieldUtils.buildSelectForDictionaryItem({
                code: 'priority', name: '优先级', list: {
                    width: 70, align: 'center',
                    render: (_field: Field, row: any, sanitizer: DomSanitizer) => {
                        if (row.priority.code === 'high') {
                            return sanitizer.bypassSecurityTrustHtml(`<span style="color: #ff4d4f">${row.priority.name}</span>`);
                        } else if (row.priority.code === 'medium') {
                            return sanitizer.bypassSecurityTrustHtml(`<span style="color: #eed202">${row.priority.name}</span>`);
                        } else {
                            return sanitizer.bypassSecurityTrustHtml(`<span style="color: #0b8235">${row.priority.name}</span>`);
                        }
                    }
                }
            }, this.dictionaryItem, 'task_priority'),
            FieldUtils.buildSelectForDictionaryItem({ code: 'status', name: '状态', list: { width: 70, align: 'center' } }, this.dictionaryItem, 'task_status'),
            FieldUtils.buildText({ code: 'targetPath', name: '目标路径', list: { visible: false } }),
            FieldUtils.buildText({ code: 'targetId', name: '目标ID', list: { visible: false } }),
            FieldUtils.buildJson({ code: 'targetParams', name: '参数' }),
            FieldUtils.buildDatetimeForCreatedAt(),
            FieldUtils.buildDatetime({ code: 'finishedAt', name: '完成时间' })
        ];
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        delete buttons[0].exclusive;
        buttons.splice(1, 1,
            { name: '前往', type: 'link', width: 30, action: (row: any) => this.forward(row), isDisabled: (row: any) => row.finishedAt },
            { name: '结束', type: 'link', width: 30, action: (row: any) => this.finish(row), authority: this.getAuthority('finish'), isDisabled: (row: any) => row.finishedAt }
        );
        return buttons;
    }

    override initEditToolbar(): Button[] {
        const buttons = super.initEditToolbar();
        buttons[0].isDisabled = (form: any) => form.id
        buttons.push({ name: '结束', type: 'primary', size: 'default', action: (form: any) => this.finish(form), authority: this.getAuthority('finish'), isDisabled: (form: any) => form.finishedAt });
        return buttons;
    }

    forward(row: any): void {
        this.router.navigateByUrl(row.targetPath);
    }

    finish(row: any): void {
        this.modal.confirm({
            nzTitle: '确定要结束吗?',
            nzOnOk: () => this.entity.finish(row.id, {
                errors: this.errors,
                before: () => this.getEditComponent().loading = true,
                success: () => {
                    this.message.info('结束成功');
                    this.getEditComponent().hide();
                    this.list();
                },
                after: () => this.getEditComponent().loading = false
            })
        });
    }

}
