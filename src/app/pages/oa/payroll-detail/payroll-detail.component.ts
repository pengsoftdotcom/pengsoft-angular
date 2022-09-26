import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Button } from 'src/app/components/support/button/button';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { PayrollDetailService } from 'src/app/services/oa/payroll-detail.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { FieldUtils } from 'src/app/utils/field-utils';
import { PayrollRecordComponent } from '../payroll-record/payroll-record.component';

@Component({
    selector: 'app-payroll-detail',
    templateUrl: './payroll-detail.component.html',
    styleUrls: ['./payroll-detail.component.scss']
})
export class PayrollDetailComponent extends EntityComponent<PayrollDetailService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    constructor(
        public override entity: PayrollDetailService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    initFields(): Field[] {
        const payrollFields = PayrollRecordComponent.prototype.initFields();

        return [
            FieldUtils.buildText({ code: 'payroll', name: '发薪记录', children: payrollFields.splice(0, 2) }),
            FieldUtils.buildText({
                code: '', name: '发薪明细', children: [
                    FieldUtils.buildPopupForStaff(),
                    FieldUtils.buildNumber({ code: 'grossPay', name: '总收入' }),
                    FieldUtils.buildNumber({ code: 'netPay', name: '净收入' }),
                    FieldUtils.buildDatetime({ code: 'confirmedAt', name: '确认时间', edit: { readonly: true } })
                ]
            })
        ];
    }

    override initListToolbar(): Button[] {
        const buttons = super.initListToolbar();
        buttons.splice(2, 2);
        return buttons;
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        delete buttons[0].exclusive;
        buttons.splice(1, 2);
        return buttons;
    }

    override initEditToolbar(): Button[] {
        return [{ name: '确认', type: 'primary', size: 'default', action: () => this.confirm(), authority: this.getAuthority('confirm'), isDisabled: (form: any) => form.confirmedAt }];
    }

    confirm(): void {
        this.modal.confirm({
            nzTitle: '确认工资已收到？',
            nzOnOk: () => new Promise(resolve => this.entity.confirm(this.editForm.id, {
                before: () => this.getEditComponent().loading = true,
                success: () => {
                    this.message.info('确认成功');
                    this.getEditComponent().hide();
                    this.list();
                },
                after: () => {
                    this.getEditComponent().loading = false;
                    resolve();
                }
            }))
        });
    }

}
