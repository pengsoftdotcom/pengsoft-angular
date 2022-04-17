import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Button } from 'src/app/components/support/button/button';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { SafetyTrainingParticipantService } from 'src/app/services/ss/safety-training-participant.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { DictionaryItemService } from 'src/app/services/system/dictionary-item.service';
import { FieldUtils } from 'src/app/utils/field-utils';
import { StaffPopupComponent } from '../../basedata/staff/staff-popup.component';

@Component({
    selector: 'app-safety-training-participant',
    templateUrl: './safety-training-participant.component.html',
    styleUrls: ['./safety-training-participant.component.scss']
})
export class SafetyTrainingParticipantComponent extends EntityComponent<SafetyTrainingParticipantService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    organization: any;

    department: any;

    training: any;

    constructor(
        private dictionaryItem: DictionaryItemService,
        public override entity: SafetyTrainingParticipantService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
        this.organization = this.security.userDetails.primaryOrganization;
        this.department = this.security.userDetails.primaryDepartment;
    }

    initFields(): Field[] {
        return [
            FieldUtils.buildPopup({
                code: 'staff', name: '员工',
                edit: {
                    required: true,
                    input: {
                        popupComponent: StaffPopupComponent,
                        popupComponentSelectRowCode: 'person.name',
                        popupComponentParams: {
                            organization: this.organization,
                            department: this.department,
                            params: {
                                'job.name': '工人'
                            }
                        }
                    }
                },
                list: { width: 100, align: 'center', render: (f: Field, row: any) => f.code && row[f.code] ? row[f.code].person.name : '-' },
                filter: {}
            }),
            FieldUtils.buildSelectForDictionaryItem({
                code: 'status', name: '状态',
                edit: { readonly: (form: any) => form.confirmedAt }, list: { width: 80, align: 'center' }
            }, this.dictionaryItem, 'safety_training_participant_status'),
            FieldUtils.buildText({ code: 'reason', name: '原因' }),
            FieldUtils.buildDatetime({ code: 'confirmedAt', name: '确认时间', edit: { readonly: true } })
        ];
    }

    override initListToolbar(): Button[] {
        const buttons = super.initListToolbar();
        if (this.training && this.training.submittedAt) {
            buttons.splice(2, 2);
        }
        return buttons;
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        delete buttons[0].exclusive;
        return buttons;
    }

    override initEditToolbar(): Button[] {
        return [{ name: '确认', type: 'primary', size: 'default', action: () => this.confirm(), authority: this.getAuthority('confirm'), isDisabled: (form: any) => form.confirmedAt }];
    }

    confirm(): void {
        const form = this.buildEditForm();
        this.entity.confirm(form, {
            errors: this.errors,
            before: () => this.getEditComponent().loading = true,
            success: () => {
                this.message.info('确认成功');
                this.getEditComponent().hide();
                this.list();
            },
            after: () => this.getEditComponent().loading = false
        });
    }

    override afterInit(): void {
        this.filterForm = { 'training.id': this.training.id };
        this.editForm = { training: this.training };
        super.afterInit();
    }

    override afterEdit(row?: any): void {
        super.afterEdit(row);
        this.editForm.training = this.training;
    }

    override afterFilterFormReset(): void {
        this.filterForm = { 'training.id': this.training.id };
        this.list();
    }

}
