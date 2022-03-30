import { Component, ViewChild } from '@angular/core';
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
        private dictionaryItem: DictionaryItemService,
        public override entity: TaskService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService) {
        super(entity, security, modal, message);
    }

    initFields(): Field[] {
        return [
            FieldUtils.buildText({ code: 'name', name: '名称' }),
            FieldUtils.buildText({ code: 'content', name: '内容' }),
            FieldUtils.buildSelectForDictionaryItem({ code: 'priority', name: '优先级' }, this.dictionaryItem, 'task_priority'),
            FieldUtils.buildSelectForDictionaryItem({ code: 'status', name: '状态' }, this.dictionaryItem, 'task_status'),
            FieldUtils.buildJson({ code: 'params', name: '参数' }),
        ];
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        delete buttons[0].exclusive;
        buttons.splice(1, 1, { name: '结束', type: 'link', width: 30, action: (row: any) => this.finish(row), authority: this.getAuthority('finish'), isDisabled: (row: any) => row.finishedAt });
        return buttons;
    }

    override initEditToolbar(): Button[] {
        const buttons = super.initEditToolbar();
        buttons[0].isDisabled = (form: any) => form.id
        buttons.push({ name: '结束', type: 'primary', size: 'default', action: (form: any) => this.finish(form), authority: this.getAuthority('finish'), isDisabled: (form: any) => form.finishedAt });
        return buttons;
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
