import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { Button } from 'src/app/components/support/button/button';
import { EditManyToManyComponent } from 'src/app/components/support/edit-many-to-many/edit-many-to-many.component';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { Field } from 'src/app/components/support/list/field';
import { InputComponent } from 'src/app/components/support/input/input.component';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { Nav } from 'src/app/components/support/list/nav';
import { TreeEntityComponent } from 'src/app/components/support/tree-entity.component';
import { DepartmentService } from 'src/app/services/basedata/department.service';
import { JobService } from 'src/app/services/basedata/job.service';
import { PostService } from 'src/app/services/basedata/post.service';
import { RoleService } from 'src/app/services/security/role.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { EntityUtils } from 'src/app/utils/entity-utils';
import { FieldUtils } from 'src/app/utils/field-utils';
import { OrganizationPopupComponent } from '../organization/organization-popup.component';

@Component({
    selector: 'app-job',
    templateUrl: './job.component.html',
    styleUrls: ['./job.component.scss']
})
export class JobComponent extends TreeEntityComponent<JobService> implements OnInit {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    @ViewChild('jobRolesComponent', { static: true }) jobRolesComponent!: EditManyToManyComponent;

    grantToolbar: Button[] = [{
        name: '保存', type: 'primary', size: 'default',
        authority: this.getAuthority('grantRoles'),
        action: () => {
            const user = this.editForm;
            const roles = this.jobRolesComponent.items.filter(item => item.direction === 'right').map(item => item.value);
            this.entity.grantRoles(user, roles, {
                before: () => this.jobRolesComponent.loading = true,
                success: () => {
                    this.message.info('保存成功');
                    this.jobRolesComponent.hide();
                },
                after: () => this.jobRolesComponent.loading = false
            });
        }
    }];

    organization: any;

    department: any;

    override expand: boolean = true

    constructor(
        private role: RoleService,
        private post: PostService,
        private departmentService: DepartmentService,
        public override entity: JobService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
        this.organization = this.security.userDetails.primaryOrganization;
    }

    override get parentQueryParams(): any {
        if (this.department) {
            return { 'department.organization.id': this.department.organization.id };
        }
    }

    override initNav(): Nav {
        const nav: Nav = {
            showExpand: true,
            data: []
        };
        this.departmentService.findAll({ 'organization.id': this.organization.id }, [], {
            success: (res: any) => {
                nav.data = EntityUtils.convertListToTree(res, (entity: any) => Object.assign({
                    title: entity.shortName,
                    value: entity,
                    key: entity.id,
                    isLeaf: entity.leaf,
                    expanded: true,
                    children: entity.children
                }));
                nav.data = [{
                    key: this.organization.id,
                    title: this.organization.shortName,
                    value: this.organization,
                    isLeaf: !nav.data || nav.data.length === 0,
                    expanded: true,
                    children: nav.data
                }];
            }
        });
        return nav;
    }

    navChange(event: NzFormatEmitEvent): void {
        if (this.organization.id === event.node?.key) {
            this.department = null;
            delete this.filterForm['department.id'];
        } else {
            this.department = event.node?.origin['value'];
            this.filterForm['department.id'] = this.department.id;
        }
        this.list();
    }

    override initFields(): Field[] {
        return super.initFields().concat(
            FieldUtils.buildTreeSelect({ code: 'department', name: '部门', list: { visible: false }, edit: { visible: false } }),
            FieldUtils.buildSelect({
                code: 'post', name: '职务', edit: {
                    required: true,
                    input: {
                        load: (component: InputComponent) => {
                            this.post.findAll({ 'organization.id': this.organization ? this.organization.id : this.department.organization.id }, [], {
                                before: () => component.loading = true,
                                success: (res: any) => {
                                    if (component.edit.input) {
                                        component.edit.input.options = res.map((entity: any) => Object.assign({ label: entity.name, value: entity }))
                                    }
                                },
                                after: () => component.loading = false
                            });
                        }
                    }
                }
            }),
            FieldUtils.buildTextForName({ list: { sortable: false } }),
            FieldUtils.buildNumber({ code: 'quantity', name: '人数' }),
            FieldUtils.buildBooleanForLocked({ code: 'departmentChief', name: '部门主管' }),
            FieldUtils.buildBooleanForLocked({ code: 'organizationChief', name: '机构主管' })
        );
    }

    override initListToolbar(): Button[] {
        const buttons = super.initListToolbar();
        const button = buttons.find((btn: any) => btn.name === '新增');
        if (button) {
            button.isDisabled = () => !this.department;
        }
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
            name: '分配角色', type: 'link', width: 58, authority: this.getAuthority('findAllJobRolesByJob'),
            action: (row: any) => this.editGrantedRoles(row)
        });
        return buttons;
    }

    override afterInit(): void {
        if (this.department) {
            delete this.filterForm['department.organization.id'];
            this.filterForm['department.id'] = this.department.id;
            super.afterInit();
        } else if (this.organization) {
            delete this.filterForm['department.id'];
            this.filterForm['department.organization.id'] = this.organization.id;
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

    editGrantedRoles(row: any): void {
        this.editForm = row;
        this.jobRolesComponent.treeData = [];
        this.jobRolesComponent.show();
        this.role.findAll({}, [], {
            before: () => this.jobRolesComponent.loading = true,
            success: (roles: any) => {
                this.jobRolesComponent.items = roles.map((role: any) => Object.assign({ title: role.name, key: role.id, value: role }));
                this.entity.findAllUserRolesByUser(row, {
                    success: (userRoles: any) => {
                        this.jobRolesComponent.targetKeys = userRoles.map((userRole: any) => userRole.role.id);
                        this.jobRolesComponent.treeData = EntityUtils.convertListToTree(roles, (entity: any) => {
                            const node = EntityUtils.convertTreeEntityToTreeNode(entity);
                            node.expanded = false;
                            node.disabled = userRoles.some((userRole: any) => userRole.role.id === node.key);
                            node.checked = node.disabled;
                            return node;
                        });
                    }
                });
            },
            after: () => this.jobRolesComponent.loading = false
        });
    }

    override afterEdit(): void {
        if (!this.editForm.id && this.department) {
            this.editForm.department = this.department;
        }
    }

    override afterFilterFormReset(): void {
        if (this.organization) {
            this.filterForm['department.organization.id'] = this.organization.id;
        }
        if (this.department) {
            delete this.filterForm['department.organization.id'];
            this.filterForm['department.id'] = this.department.id;
        }
        super.afterFilterFormReset();
    }

}
