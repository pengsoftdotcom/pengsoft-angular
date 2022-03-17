import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceRecordComponent } from './attendance-record/attendance-record.component';
import { ContractComponent } from './contract/contract.component';
import { PayrollDetailComponent } from './payroll-detail/payroll-detail.component';
import { PayrollRecordComponent } from './payroll-record/payroll-record.component';

const routes: Routes = [{
    path: 'oa',
    data: { name: '协同办公', icon: 'file-excel' },
    children: [
        { path: 'contract', component: ContractComponent, data: { code: 'oa::contract::find_page', name: '合同' } },
        { path: 'attendance-record', component: AttendanceRecordComponent, data: { code: 'oa::attendance_record::find_page', name: '考勤记录' } },
        {
            path: '', data: { name: '薪酬管理', path: 'payroll' }, children: [
                { path: 'payroll-record', component: PayrollRecordComponent, data: { code: 'oa::payroll_record::find_page', name: '发薪记录' } },
                { path: 'payroll-detail', component: PayrollDetailComponent, data: { code: 'oa::payroll_record::find_page', name: '发薪明细' } }
            ]
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OaRoutingModule {

}
