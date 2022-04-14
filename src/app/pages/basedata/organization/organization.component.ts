import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { Button } from 'src/app/components/support/button/button';
import { EditOneToManyComponent } from 'src/app/components/support/edit-one-to-many/edit-one-to-many.component';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { InputComponent } from 'src/app/components/support/input/input.component';
import { Option } from 'src/app/components/support/input/tree-select/option';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { TreeEntityComponent } from 'src/app/components/support/tree-entity.component';
import { OrganizationService } from 'src/app/services/basedata/organization.service';
import { PersonService } from 'src/app/services/basedata/person.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { DictionaryItemService } from 'src/app/services/system/dictionary-item.service';
import { EntityUtils } from 'src/app/utils/entity-utils';
import { FieldUtils } from 'src/app/utils/field-utils';
import { BusinessLicenseComponent } from '../business-license/business-license.component';
import { DepartmentComponent } from '../department/department.component';
import { LegalRepresentativeComponent } from '../legal-representative/legal-representative.component';
import { OrganizationAdminComponent } from '../organization-admin/organization-admin.component';
import { PersonComponent } from '../person/person.component';
import { PostComponent } from '../post/post.component';
import { RankComponent } from '../rank/rank.component';
import { AuthenticationComponent } from './authentication.component';


@Component({
    selector: 'app-organization',
    templateUrl: './organization.component.html',
    styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent extends TreeEntityComponent<OrganizationService> implements OnInit {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    @ViewChild('authenticationComponent', { static: true }) authenticationComponent!: AuthenticationComponent;

    @ViewChild('legalRepresentativeComponent', { static: true }) legalRepresentativeComponent!: LegalRepresentativeComponent;

    @ViewChild('businessLicenseComponent', { static: true }) businessLicenseComponent!: BusinessLicenseComponent;

    @ViewChild('organizationAdminComponent', { static: true }) organizationAdminComponent!: OrganizationAdminComponent;

    @ViewChild('ranksComponent', { static: true }) ranksComponent!: EditOneToManyComponent;

    @ViewChild('postsComponent', { static: true }) postsComponent!: EditOneToManyComponent;

    @ViewChild('departmentsComponent', { static: true }) departmentsComponent!: EditOneToManyComponent;

    constructor(
        public dictionaryItem: DictionaryItemService,
        public person: PersonService,
        public override entity: OrganizationService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    override initFields(): Field[] {
        PersonComponent.prototype.dictionaryItem = this.dictionaryItem;
        const personFields = PersonComponent.prototype.initFields();
        personFields.forEach(field => {
            switch (field.code) {
                case 'nickname':
                case 'gender':
                    if (field.list) {
                        field.list.visible = false;
                    }
                    break;
                default: break;
            }
        });
        return [
            FieldUtils.buildUpload({
                code: 'logo', name: 'Logo', list: {
                    align: 'center',
                    visible: true, render: (_field: Field, row: any, _sanitizer: DomSanitizer) => {
                        if (row.logo) {
                            const src = row.logo.accessPath + '?x-oss-process=image/resize,h_32';
                            return `<img src="${src}"></img>`
                        } else {
                            return '-';
                        }
                    }
                }, edit: { column: 1 }
            }, {
                accept: FieldUtils.IMAGE,
                remove: (file: NzUploadFile) => new Observable(observer => this.entity.deleteLogoByAsset(this.editForm, file.response[0], {
                    success: (res) => {
                        if (res > -1) {
                            this.editForm['version'] = res;
                        }
                        observer.next(true);
                    },
                    failure: () => observer.next(false)
                }))
            }),
            FieldUtils.buildSelect({
                code: 'parent', name: '上级',
                list: { visible: false },
                edit: {
                    input: {
                        load: (component: InputComponent, event?: string) => {
                            const params: any = {};
                            if (event) {
                                params.name = event;
                            }
                            this.entity.findAll(params, [], {
                                before: () => this.loading = true,
                                success: (res: any) => {
                                    if (component.edit.input) {
                                        component.edit.input.options = res.map((entity: any) => Object.assign({ label: entity.name, value: entity }))
                                    }
                                },
                                after: () => this.loading = false
                            });
                        }
                    }
                }
            }),
            FieldUtils.buildTextForName(),
            FieldUtils.buildText({ code: 'shortName', name: '简称' }),
            FieldUtils.buildNumber({ code: 'payday', name: '发薪日', list: { width: 100, align: 'center' } }),
            FieldUtils.buildCascader({
                code: 'type', name: '类型',
                list: { width: 200, align: 'center' },
                edit: {
                    // required: true,
                    input: {
                        load: (component: InputComponent) => {
                            this.dictionaryItem.findAllByTypeCode('organization_type', null, {
                                before: () => component.loading = true,
                                success: (res: any) => {
                                    if (component.edit.input) {
                                        component.edit.input.options = EntityUtils.convertListToTree(res) as Option[]
                                    }
                                },
                                after: () => component.loading = false
                            });
                        }
                    }
                },
                filter: {}
            }),
            FieldUtils.buildText({
                code: 'authentication', name: '实名认证状态', edit: { visible: false }, list: {
                    visible: false,
                    align: 'center',
                    render: (_field, row, sanitizer) => {
                        const value = row.authentication;
                        if (!value || value.status.code === 'unauthenticated') {
                            return sanitizer.bypassSecurityTrustHtml('<span style="color: #ff4d4f">未认证</span>');
                        } else if (value.status.code === 'authenticated') {
                            return sanitizer.bypassSecurityTrustHtml('<span style="color: #0b8235">' + value.status.name + '</span>');
                        } else {
                            return sanitizer.bypassSecurityTrustHtml('<span>' + value.status.name + '</span>');
                        }
                    }
                }
            })
        ];
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        buttons.splice(0, 0,/*  {
            name: '职级', type: 'link', width: 30, authority: 'basedata::rank::find_all',
            action: (row: any) => this.editRanks(row)
        }, */ {
                name: '职务', type: 'link', width: 30, authority: 'basedata::post::find_all',
                action: (row: any) => this.editPosts(row)
            }, {
            name: '部门', type: 'link', width: 30, authority: 'basedata::department::find_all',
            action: (row: any) => this.editDepartments(row)
        });
        return buttons;
    }

    editRanks(organization: any): void {
        this.ranksComponent.component = RankComponent;
        this.ranksComponent.width = '40%';
        this.ranksComponent.params = { title: organization.name, organization, child: true };
        this.ranksComponent.show();
    }

    editPosts(organization: any): void {
        this.postsComponent.component = PostComponent;
        this.postsComponent.width = '40%';
        this.postsComponent.params = { title: organization.name, organization, child: true };
        this.postsComponent.show();
    }

    editDepartments(organization: any): void {
        this.departmentsComponent.component = DepartmentComponent;
        this.departmentsComponent.params = { title: organization.name, organization, child: true };
        this.departmentsComponent.show();
    }

    /*  实名认证相关开始 */
    showAuthenticationComponent(row: any): void {
        this.authenticationComponent.organization = row;
        this.authenticationComponent.show();
        this.authenticationComponent.goTo(0);
    }

    editOrganizationAdmin(organization: any): void {
        this.organizationAdminComponent.editComponent.show();
        this.entity.getAdmin(organization, {
            before: () => {
                this.organizationAdminComponent.editComponent.loading = true;
                this.organizationAdminComponent.editForm = {};
                this.organizationAdminComponent.errors = { identityCard: {} };
            },
            success: res => {
                this.organizationAdminComponent.organization = organization;
                this.organizationAdminComponent.editForm = res;
                if (!res.identityCard) {
                    this.organizationAdminComponent.editForm.identityCard = { address: {} };
                }
            },
            after: () => this.organizationAdminComponent.editComponent.loading = false
        });
    }

    editLegalRepresentative(organization: any): void {
        this.legalRepresentativeComponent.editComponent.show();
        this.entity.getLegalRepresentative(organization, {
            before: () => {
                this.legalRepresentativeComponent.editComponent.loading = true;
                this.legalRepresentativeComponent.editForm = {};
                this.legalRepresentativeComponent.errors = { identityCard: {} };
            },
            success: res => {
                this.legalRepresentativeComponent.organization = organization;
                this.legalRepresentativeComponent.editForm = res;
                if (!res.identityCard) {
                    this.legalRepresentativeComponent.editForm.identityCard = { address: {} };
                }
            },
            after: () => this.legalRepresentativeComponent.editComponent.loading = false
        });
    }

    editBusinessLicense(organization: any): void {
        this.businessLicenseComponent.getEditComponent().show();
        this.entity.getBusinessLicense(organization, {
            before: () => {
                this.businessLicenseComponent.getEditComponent().loading = true;
                this.businessLicenseComponent.editForm = {};
                this.businessLicenseComponent.errors = { businessLicense: {} };
            },
            success: res => {
                this.businessLicenseComponent.organization = organization;
                this.businessLicenseComponent.editForm = res;
                if (!res.address) {
                    this.businessLicenseComponent.editForm.address = {};
                }
            },
            after: () => this.businessLicenseComponent.getEditComponent().loading = false
        });
    }
    /*  实名认证相关结束 */

    override list(): void {
        this.entity.findPage(this.filterForm, this.pageData, {
            before: () => this.getListComponent().loading = true,
            success: (res: any) => {
                this.getListComponent().allChecked = false;
                this.getListComponent().indeterminate = false;
                this.listData = res.content;
                this.pageData.total = res.totalElements;
            },
            after: () => this.getListComponent().loading = false
        });
    }

}
