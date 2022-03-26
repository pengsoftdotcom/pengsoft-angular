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
        return [
            FieldUtils.buildText({ code: 'payrollRecord', name: '期数', list: { width: 320, align: 'center', render: (field: Field, row: any) => row.payrollRecord.code } }),
            FieldUtils.buildPopupForStaff(),
            FieldUtils.buildNumber({ code: 'grossPay', name: '总收入' }),
            FieldUtils.buildNumber({ code: 'netPay', name: '净收入' }),
            FieldUtils.buildDatetime({ code: 'confirmedAt', name: '确认时间' })
        ];
    }

    override initListAction(): Button[] {
        const listAction = super.initListAction();
        listAction.splice(0, 0, {
            name: '确认', type: 'link', width: 30, authority: this.getAuthority('confirm'),
            action: (row: any) => this.confirm(row),
            isDisabled: (row: any) => !row.confirmedAt
        });
        return listAction;
    }

    confirm(row: any): void {
        this.modal.confirm({
            nzTitle: '确认工资已收到？',
            nzOnOk: () => new Promise(resolve => this.entity.confirm(row.id, {
                success: () => { this.message.info('确认成功'); resolve(); }
            }))
        });
    }

}
