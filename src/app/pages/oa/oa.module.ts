import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { ComponentModule } from 'src/app/components/component.module';
import { AttendanceRecordComponent } from './attendance-record/attendance-record.component';
import { ContractComponent } from './contract/contract.component';
import { OaRoutingModule } from './oa-routing.module';
import { PayrollDetailComponent } from './payroll-detail/payroll-detail.component';
import { PayrollRecordComponent } from './payroll-record/payroll-record.component';
import { MyContractComponent } from './my-contract/my-contract.component';
import { MySalaryComponent } from './my-salary/my-salary.component';

@NgModule({
    declarations: [
        ContractComponent,
        PayrollRecordComponent,
        AttendanceRecordComponent,
        PayrollRecordComponent,
        PayrollDetailComponent,
        MyContractComponent,
        MySalaryComponent
    ],
    imports: [
        CommonModule,
        OaRoutingModule,
        ComponentModule,
        NzStepsModule,
        NzGridModule,
        NzSpaceModule,
        NzSpinModule
    ]
})
export class OaModule { }
