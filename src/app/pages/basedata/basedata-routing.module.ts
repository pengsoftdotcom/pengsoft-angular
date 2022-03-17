import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodingRuleComponent } from './coding-rule/coding-rule.component';
import { DepartmentComponent } from './department/department.component';
import { JobComponent } from './job/job.component';
import { OrganizationComponent } from './organization/organization.component';
import { PersonComponent } from './person/person.component';
import { PostComponent } from './post/post.component';
import { StaffComponent } from './staff/staff.component';

const routes: Routes = [
    {
        path: 'basedata',
        data: { name: '基础数据', icon: 'database' },
        children: [
            { path: 'coding-rule', component: CodingRuleComponent, data: { code: 'basedata::coding_rule::find_page', name: '编码规则' } },
            /* { path: 'supplier', component: SupplierComponent, data: { name: '供应商' } },
            { path: 'consumer', component: ConsumerComponent, data: { name: '客户' } }, */
            { path: 'organization', component: OrganizationComponent, data: { code: 'basedata::organization::find_page', name: '机构' } },
            { path: 'department', component: DepartmentComponent, data: { code: 'basedata::department::find_all', name: '部门' } },
            { path: 'post', component: PostComponent, data: { code: 'basedata::post::find_all', name: '职务' } },
            { path: 'job', component: JobComponent, data: { code: 'basedata::job::find_all', name: '职位' } },
            { path: 'staff', component: StaffComponent, data: { code: 'basedata::staff::find_page', name: '员工' } },
            { path: 'person', component: PersonComponent, data: { code: 'basedata::person::find_page', name: '人员' } }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BasedataRoutingModule { }
