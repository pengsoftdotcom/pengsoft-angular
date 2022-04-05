import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { ResetPasswordComponent } from 'src/app/components/modal/reset-password/reset-password.component';
import { Button } from 'src/app/components/support/button/button';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { Option } from 'src/app/components/support/input/tree-select/option';
import { InputComponent } from 'src/app/components/support/input/input.component';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { Nav } from 'src/app/components/support/list/nav';
import { DepartmentService } from 'src/app/services/basedata/department.service';
import { JobService } from 'src/app/services/basedata/job.service';
import { StaffService } from 'src/app/services/basedata/staff.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { DictionaryItemService } from 'src/app/services/system/dictionary-item.service';
import { EntityUtils } from 'src/app/utils/entity-utils';
import { FieldUtils } from 'src/app/utils/field-utils';
import { OrganizationPopupComponent } from '../organization/organization-popup.component';
import { PersonComponent } from '../person/person.component';


@Component({
    selector: 'app-staff',
    templateUrl: './staff.component.html',
    styleUrls: ['./staff.component.scss']
})
export class StaffComponent extends EntityComponent<StaffService> implements OnInit {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    organization: any;

    department: any;

    constructor(
        private dictionaryItem: DictionaryItemService,
        private job: JobService,
        private departmentService: DepartmentService,
        public override entity: StaffService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
        this.organization = this.security.userDetails.primaryOrganization;
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

    initFields(): Field[] {
        PersonComponent.prototype.dictionaryItem = this.dictionaryItem;
        return [
            FieldUtils.buildText({ code: 'person', name: '基本信息', children: PersonComponent.prototype.initFields()[0].children }),
            FieldUtils.buildText({
                code: '', name: '职位信息', children: [
                    FieldUtils.buildTreeSelect({
                        code: 'job', name: '职位',
                        list: { width: 120, align: 'center' },
                        edit: {
                            required: true,
                            input: {
                                lazy: false,
                                load: (component: InputComponent) => this.job.findAll({ 'department.organization.id': this.organization ? this.organization.id : this.department.organization.id }, [], {
                                    before: () => component.loading = true,
                                    success: (res: any) => {
                                        if (component.edit.input) {
                                            component.edit.input.options = EntityUtils.convertListToTree(res) as Option[];
                                        }
                                    },
                                    after: () => component.loading = false
                                })
                            }
                        }
                    }),
                    FieldUtils.buildBoolean({
                        code: 'primary', name: '主要', list: {
                            render: (field: Field, row: any, sanitizer: DomSanitizer) => {
                                if (field.code && row[field.code]) {
                                    return sanitizer.bypassSecurityTrustHtml('<span style="color: #0b8235">是</span>');
                                } else {
                                    return sanitizer.bypassSecurityTrustHtml('<span style="color: #ff4d4f">否</span>');
                                }
                            }
                        }
                    })
                ]
            })
        ];
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
            name: '重置密码',
            type: 'link',
            width: 58,
            authority: 'security::user::reset_password',
            action: (row: any) => this.resetPassword(row)
        });
        buttons.forEach(button => {
            if (button.name === '新增') {
                button.isDisabled = () => !this.organization;
            }
        })
        return buttons;
    }

    override afterInit(): void {
        if (this.department) {
            delete this.filterForm['organization.id'];
            this.filterForm['department.id'] = this.department.id;
            super.afterInit();
        } else if (this.organization) {
            delete this.filterForm['department.id'];
            this.filterForm['organization.id'] = this.organization.id;
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

    override afterEdit(): void {
        this.editForm.organization = this.organization;
        this.editForm.department = this.department;
    }

    override afterFilterFormReset(): void {
        if (this.organization) {
            this.filterForm['organization.id'] = this.organization.id;
        }
        if (this.department) {
            delete this.filterForm['organization.id'];
            this.filterForm['department.id'] = this.department.id;
        }
        super.afterFilterFormReset();
    }

    resetPassword(row: any): void {
        this.modal.create({
            nzBodyStyle: { padding: '16px', marginBottom: '-24px' },
            nzTitle: '重置密码',
            nzContent: ResetPasswordComponent,
            nzComponentParams: {
                form: { id: row.person.user.id }
            },
            nzOnOk: component => new Promise(resolve => {
                component.submit({
                    before: () => component.loading = true,
                    success: () => {
                        this.message.info('重置成功');
                        resolve(true);
                    },
                    failure: () => resolve(false),
                    after: () => component.loading = false
                });
            })
        });
    }

}
