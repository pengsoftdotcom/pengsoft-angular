import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { AttendanceRecordService } from 'src/app/services/oa/attendance-record.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { FieldUtils } from 'src/app/utils/field-utils';
import { AccessRecordComponent } from '../../acs/access-record/access-record.component';

@Component({
    selector: 'app-attendance-record',
    templateUrl: './attendance-record.component.html',
    styleUrls: ['./attendance-record.component.scss']
})
export class AttendanceRecordComponent extends EntityComponent<AttendanceRecordService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    constructor(
        public override entity: AttendanceRecordService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    initFields(): Field[] {
        const accessRecordFields = AccessRecordComponent.prototype.initFields();
        accessRecordFields.splice(0, 1);
        return [
            FieldUtils.buildPopupForStaff()
        ].concat(accessRecordFields);
    }

}
