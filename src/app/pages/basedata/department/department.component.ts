import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Button } from 'src/app/components/support/button/button';
import { EditOneToManyComponent } from 'src/app/components/support/edit-one-to-many/edit-one-to-many.component';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { TreeEntityComponent } from 'src/app/components/support/tree-entity.component';
import { DepartmentService } from 'src/app/services/basedata/department.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { FieldUtils } from 'src/app/utils/field-utils';
import { JobComponent } from '../job/job.component';
import { OrganizationPopupComponent } from '../organization/organization-popup.component';
import { StaffComponent } from '../staff/staff.component';


@Component({
    selector: 'app-department',
    templateUrl: './department.component.html',
    styleUrls: ['./department.component.scss']
})
export class DepartmentComponent extends TreeEntityComponent<DepartmentService> implements OnInit {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    @ViewChild('jobsComponent', { static: true }) jobsComponent!: EditOneToManyComponent;

    @ViewChild('staffsComponent', { static: true }) staffsComponent!: EditOneToManyComponent;

    organization: any;

    constructor(
        public override entity: DepartmentService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
        this.organization = this.security.userDetails.primaryOrganization;
    }

    override get parentQueryParams(): any {
        if (this.organization) {
            return { 'organization.id': this.organization.id };
        }
    }

    override initFields(): Field[] {
        return super.initFields().concat(
            FieldUtils.buildTreeSelect({ code: 'organization', name: '机构', list: { visible: false }, edit: { visible: false } }),
            FieldUtils.buildTextForName(),
            FieldUtils.buildText({ code: 'shortName', name: '简称' }),
            FieldUtils.buildNumber({ code: 'number', name: '员工数', edit: { readonly: true }, list: { align: 'right' } }),
        );
    }

    override initListToolbar(): Button[] {
        const buttons = super.initListToolbar();
        if (!this.child) {
            buttons.splice(0, 0, {
                name: '切换机构',
                type: 'link',
                action: () => this.switchOrganization()
            });
        }
        return buttons;
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        buttons.splice(0, 0, {
            name: '职位', type: 'link', width: 30, authority: 'basedata::job::find_all',
            action: (row: any) => this.editJobs(row)
        }, {
            name: '员工', type: 'link', width: 30, authority: 'basedata::staff::find_all',
            action: (row: any) => this.editStaff(row)
        });
        return buttons;
    }

    override afterInit(): void {
        if (this.organization) {
            this.filterForm = { 'organization.id': this.organization.id };
            this.editForm = { organization: this.organization };
            super.afterInit();
        } else {
            this.switchOrganization();
        }
    }

    switchOrganization(): void {
        const modalRef = this.modal.create({
            nzWidth: '80%',
            nzContent: OrganizationPopupComponent,
            nzComponentParams: {
                title: '切换机构',
                action: '切换',
                select: row => {
                    this.organization = row;
                    this.title = this.organization.name;
                    modalRef.close();
                    this.afterInit();
                }
            },
            nzFooter: null
        });
    }

    editJobs(department: any): void {
        this.jobsComponent.component = JobComponent;
        this.jobsComponent.width = '70%';
        this.jobsComponent.params = { title: department.name, department, allowLoadNavData: false, child: true };
        this.jobsComponent.show();
    }

    editStaff(department: any): void {
        this.staffsComponent.component = StaffComponent;
        this.staffsComponent.width = '70%';
        this.staffsComponent.params = { title: department.name, department, allowLoadNavData: false, child: true };
        this.staffsComponent.show();
    }

    override afterEdit(row?: any): void {
        super.afterEdit(row);
        if (!this.editForm.id && this.organization) {
            this.editForm.organization = this.organization;
        }
    }

    override afterFilterFormReset(): void {
        if (this.organization) {
            this.filterForm = { 'organization.id': this.organization.id };
        }
        this.list();
    }

}
