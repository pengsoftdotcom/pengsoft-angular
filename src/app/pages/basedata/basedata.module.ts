import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { ComponentModule } from 'src/app/components/component.module';
import { BasedataRoutingModule } from './basedata-routing.module';
import { BusinessLicenseComponent } from './business-license/business-license.component';
import { ConsumerComponent } from './consumer/consumer.component';
import { SelectConsumerComponent } from './consumer/select-consumer.component';
import { DepartmentComponent } from './department/department.component';
import { JobComponent } from './job/job.component';
import { LegalRepresentativeComponent } from './legal-representative/legal-representative.component';
import { OrganizationAdminComponent } from './organization-admin/organization-admin.component';
import { AuthenticationComponent } from './organization/authentication.component';
import { OrganizationPopupComponent } from './organization/organization-popup.component';
import { OrganizationComponent } from './organization/organization.component';
import { PersonPopupComponent } from './person/person-popup.component';
import { PersonComponent } from './person/person.component';
import { PostComponent } from './post/post.component';
import { RankComponent } from './rank/rank.component';
import { StaffPopupComponent } from './staff/staff-popup.component';
import { StaffComponent } from './staff/staff.component';
import { SelectSupplierComponent } from './supplier/select-supplier.component';
import { SupplierComponent } from './supplier/supplier.component';
import { CodingRuleComponent } from './coding-rule/coding-rule.component';



@NgModule({
    declarations: [
        PersonComponent,
        PersonPopupComponent,
        OrganizationComponent,
        DepartmentComponent,
        PostComponent,
        JobComponent,
        StaffComponent,
        StaffPopupComponent,
        SupplierComponent,
        SelectSupplierComponent,
        ConsumerComponent,
        SelectConsumerComponent,
        OrganizationAdminComponent,
        OrganizationPopupComponent,
        LegalRepresentativeComponent,
        BusinessLicenseComponent,
        AuthenticationComponent,
        RankComponent,
        CodingRuleComponent
    ],
    imports: [
        CommonModule,
        BasedataRoutingModule,
        ComponentModule,
        NzStepsModule,
        NzGridModule,
        NzSpaceModule,
        NzSpinModule
    ]
})
export class BasedataModule { }
