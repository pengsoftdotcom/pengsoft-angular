import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { PayrollDetailService } from 'src/app/services/oa/payroll-detail.service';
import { SecurityService } from 'src/app/services/support/security.service';

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
        return [];
    }

}
