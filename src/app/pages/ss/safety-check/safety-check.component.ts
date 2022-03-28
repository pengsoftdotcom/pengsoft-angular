import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { Button } from 'src/app/components/support/button/button';
import { EditOneToManyComponent } from 'src/app/components/support/edit-one-to-many/edit-one-to-many.component';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { SafetyCheckService } from 'src/app/services/ss/safety-check.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { DictionaryItemService } from 'src/app/services/system/dictionary-item.service';
import { FieldUtils } from 'src/app/utils/field-utils';
import { StaffPopupComponent } from '../../basedata/staff/staff-popup.component';

@Component({
    selector: 'app-safety-check',
    templateUrl: './safety-check.component.html',
    styleUrls: ['./safety-check.component.scss']
})
export class SafetyCheckComponent extends EntityComponent<SafetyCheckService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    @ViewChild('participants', { static: true }) participantsComponent: EditOneToManyComponent;

    organization: any;

    department: any;

    constructor(
        private dictionaryItem: DictionaryItemService,
        public override entity: SafetyCheckService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
        this.organization = this.security.userDetails.primaryOrganization;
        this.department = this.security.userDetails.primaryDepartment;
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.editComponent.width = '40%';

    }

    initFields(): Field[] {
        return [
            FieldUtils.buildSelect({ code: 'project', name: '工程项目', edit: { readonly: true, required: true }, list: { visible: false } }),
            FieldUtils.buildTextForCode(),
            FieldUtils.buildText({ code: 'subject', name: '检查主题', edit: { required: true } }),
            FieldUtils.buildPopup({
                code: 'checker', name: '检查人',
                edit: {
                    required: true,
                    readonly: !this.security.hasAnyRole(['bu_manager']),
                    input: {
                        popupComponent: StaffPopupComponent,
                        popupComponentSelectRowCode: 'person.name',
                        popupComponentParams: {
                            organization: this.organization,
                            department: this.department,
                            params: {
                                'job.name': '安全员'
                            }
                        }
                    }
                },
                list: { render: (f: Field, row: any) => f.code && row[f.code] ? row[f.code].person.name : '-' },
                filter: {}
            }),
            FieldUtils.buildSelectForDictionaryItem({ code: 'status', name: '状态', edit: { required: true } }, this.dictionaryItem, 'safety_check_status'),
            FieldUtils.buildUpload({
                code: 'submitFiles', name: '检查图片', edit: { required: true }
            }, {
                multiple: true, accept: 'image/*',
                showRemove: (form: any) => !form.id,
                remove: (file: NzUploadFile) => this.remove(file)
            }),
            FieldUtils.buildTextarea({ code: 'reason', name: '检查描述', edit: { required: true, readonly: (form: any) => form.submittedAt } }),
            FieldUtils.buildDatetime({ code: 'submittedAt', name: '提交时间', edit: { readonly: true } }),
            FieldUtils.buildUpload({
                code: 'handleFiles', name: '处理图片', edit: { required: true, visible: (form: any) => form.submittedAt }
            }, {
                multiple: true, accept: 'image/*',
                showRemove: (form: any) => !form.id,
                remove: (file: NzUploadFile) => this.remove(file)
            }),
            FieldUtils.buildTextarea({ code: 'result', name: '处理结果', edit: { required: true, visible: (form: any) => form.submittedAt } }),
            FieldUtils.buildDatetime({ code: 'handledAt', name: '处理时间', edit: { readonly: true, visible: (form: any) => form.submittedAt } }),
        ];
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        buttons.forEach(button => {
            if (button.name === '查看') {
                delete button.exclusive;
            }
        });
        buttons.splice(1, 1);
        return buttons;
    }

    override initEditToolbar(): Button[] {
        return [
            { name: '提交', type: 'primary', size: 'default', action: () => this.submit(), authority: this.getAuthority('submit'), isDisabled: (form: any) => form.submittedAt },
            { name: '处理', type: 'primary', size: 'default', action: () => this.handle(), authority: this.getAuthority('handle'), isDisabled: (form: any) => form.status?.code === 'safe' || form.handledAt }
        ];
    }

    remove(file: NzUploadFile): Observable<boolean> {
        return new Observable(observer => this.entity.deleteFileByAsset(this.editForm, file.response[0], {
            success: () => observer.next(true),
            failure: () => observer.next(false)
        }));
    }

    submit(): void {
        const form = this.buildEditForm();
        if (this.entity) {
            this.entity.submit(form, {
                errors: this.errors,
                before: () => this.getEditComponent().loading = true,
                success: (res: any) => {
                    this.message.info('提交成功');
                    this.getEditComponent().hide();
                    this.list();
                },
                after: () => this.getEditComponent().loading = false
            });
        }
    }

    handle(): void {
        const form = this.buildEditForm();
        if (this.entity) {
            this.entity.handle(form, {
                errors: this.errors,
                before: () => this.getEditComponent().loading = true,
                success: (res: any) => {
                    this.message.info('处理成功');
                    this.getEditComponent().hide();
                    this.list();
                },
                after: () => this.getEditComponent().loading = false
            });
        }
    }

}
