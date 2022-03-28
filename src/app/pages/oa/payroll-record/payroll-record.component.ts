import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { PayrollRecordService } from 'src/app/services/oa/payroll-record.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { FieldUtils } from 'src/app/utils/field-utils';

@Component({
    selector: 'app-payroll-record',
    templateUrl: './payroll-record.component.html',
    styleUrls: ['./payroll-record.component.scss']
})
export class PayrollRecordComponent extends EntityComponent<PayrollRecordService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    constructor(
        public override entity: PayrollRecordService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    initFields(): Field[] {
        return [
            FieldUtils.buildText({
                code: 'code', name: '期数',
                list: {
                    sortable: true, sortPriority: 1,
                    render: (field: Field, row: any, sanitizer: DomSanitizer) => sanitizer.bypassSecurityTrustHtml(`<code>${row.code}</code>`)
                },
                edit: { required: true, readonly: (row: any) => !!row.id },
                filter: {}
            }),
            FieldUtils.buildNumber({ code: 'paidCount', name: '支付人数', edit: { readonly: true } }),
            FieldUtils.buildNumber({ code: 'confirmedCount', name: '确认人数', edit: { readonly: true } }),
            FieldUtils.buildUpload({ code: 'sheet', name: '工资表', edit: { required: true } }, {
                locked: true, accept: FieldUtils.EXECL
            }),
            FieldUtils.buildUpload({ code: 'signedSheet', name: '工资确认表', edit: { required: true } }, {
                locked: true, accept: FieldUtils.IMAGE
            }),
            FieldUtils.buildDatetime({ code: 'importedAt', name: '导入时间', edit: { readonly: true } })
        ];
    }

}
