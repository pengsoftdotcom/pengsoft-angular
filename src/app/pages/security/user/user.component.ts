import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ResetPasswordComponent } from 'src/app/components/modal/reset-password/reset-password.component';
import { SetPrimaryRoleComponent } from 'src/app/components/modal/set-primary-role/set-primary-role.component';
import { Button } from 'src/app/components/support/button/button';
import { EditManyToManyComponent } from 'src/app/components/support/edit-many-to-many/edit-many-to-many.component';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { RoleService } from 'src/app/services/security/role.service';
import { UserService } from 'src/app/services/security/user.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { EntityUtils } from 'src/app/utils/entity-utils';
import { FieldUtils } from 'src/app/utils/field-utils';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent extends EntityComponent<UserService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    @ViewChild('userRolesComponent', { static: true }) userRolesComponent!: EditManyToManyComponent;

    grantToolbar: Button[] = [
        {
            name: '设置主要角色', size: 'default',
            authority: this.getAuthority('setPrimaryRole'),
            action: () => this.editPrimaryRole()
        },
        {
            name: '保存', type: 'primary', size: 'default',
            authority: this.getAuthority('grantRoles'),
            action: () => {
                const user = this.editForm;
                const roles = this.userRolesComponent.items.filter(item => item.direction === 'right').map(item => item.value);
                this.entity.grantRoles(user, roles, {
                    before: () => this.userRolesComponent.loading = true,
                    success: () => this.message.info('保存成功'),
                    after: () => this.userRolesComponent.loading = false
                });
            }
        }
    ];

    constructor(
        private role: RoleService,
        public override entity: UserService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.editComponent.width = '35%';
    }

    initFields(): Field[] {
        return [
            FieldUtils.buildText({
                code: 'username', name: '账号',
                edit: {
                    required: true,
                    readonly: (form: any) => !!form.id,
                    label: {
                        tooltip: '4到20位字符，支持数字, 小写字母, 大写字母和分隔符("- _ @ .")的组合'
                    }
                },
                filter: { label: { tooltip: '' } }
            }),
            FieldUtils.buildNumber({ code: 'mobile', name: '手机号码', edit: { input: { mode: 'tel' }, readonly: (form: any) => !!form.id }, list: { visible: false } }),
            FieldUtils.buildText({ code: 'email', name: '邮件', edit: { readonly: (form: any) => !!form.id }, list: { visible: false } }),
            FieldUtils.buildText({ code: 'mpOpenid', name: '微信Open ID', edit: { readonly: (form: any) => !!form.id }, list: { visible: false } }),
            FieldUtils.buildPassword({
                code: 'password', name: '密码',
                edit: {
                    required: true,
                    visible: (form: any) => !form.id,
                    label: {
                        tooltip: '6-20位字符，支持数字, 小写字母, 大写字母和标点符号的组合，至少含有其中2种'
                    }
                }
            }),
            FieldUtils.buildSelect({
                code: 'locale', name: '语言',
                list: {
                    width: 63, align: 'center',
                    render: (field: Field, row: any) => {
                        if (field.edit?.input?.options) {
                            return field.edit.input.options.filter(option => field.code && EntityUtils.equals(option.value, row[field.code]))[0]?.label;
                        } else {
                            return '-';
                        }
                    }
                },
                edit: {
                    input: {
                        options: [
                            { label: '简体', value: 'zh_CN', title: '简体', key: 'zh_CN' },
                            { label: 'English', value: 'en_US', title: 'English', key: 'en_US' }
                        ]
                    }
                },
                filter: {}
            }),
            FieldUtils.buildDatetime({ code: 'signedInAt', name: '登录时间', edit: { readonly: true, input: { placeholder: '尚未登录' } } }),
            FieldUtils.buildNumber({ code: 'signInFailureCount', name: '今日登录失败', list: { width: 133 } }),
            FieldUtils.buildDatetimeForExpiredAt(),
            FieldUtils.buildBooleanForEnabled()
        ];
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        buttons.splice(0, 0, {
            name: '重置密码',
            type: 'link',
            width: 58,
            authority: this.getAuthority('resetPassword'),
            action: (row: any) => this.resetPassword(row)
        }, {
            name: '分配角色',
            type: 'link',
            width: 58,
            authority: this.getAuthority('findAllUserRolesByUser'),
            action: (row: any) => this.editGrantedRoles(row)
        });
        return buttons;
    }

    resetPassword(row: any): void {
        this.modal.create({
            nzBodyStyle: { padding: '16px', marginBottom: '-24px' },
            nzTitle: '重置密码',
            nzContent: ResetPasswordComponent,
            nzComponentParams: {
                form: { id: row.id }
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

    editGrantedRoles(row: any): void {
        this.editForm = row;
        this.userRolesComponent.treeData = [];
        this.userRolesComponent.show();
        this.role.findAll({}, [], {
            before: () => this.userRolesComponent.loading = true,
            success: (roles: any) => {
                this.userRolesComponent.items = roles.map((role: any) => Object.assign({ title: role.name, key: role.id, value: role }));
                this.entity.findAllUserRolesByUser(row, {
                    success: (userRoles: any) => {
                        this.userRolesComponent.targetKeys = userRoles.map((userRole: any) => userRole.role.id);
                        this.userRolesComponent.treeData = EntityUtils.convertListToTree(roles, entity => {
                            const node = EntityUtils.convertTreeEntityToTreeNode(entity);
                            node.expanded = true;
                            node.disabled = userRoles.some((userRole: any) => userRole.role.id === node.key);
                            node.checked = node.disabled;
                            return node;
                        });
                    }
                });
            },
            after: () => this.userRolesComponent.loading = false
        });
    }

    editPrimaryRole(): void {
        this.entity.findAllUserRolesByUser(this.editForm, {
            success: (res: any) => this.modal.create({
                nzBodyStyle: { padding: '16px' },
                nzTitle: '设置主要角色',
                nzContent: SetPrimaryRoleComponent,
                nzComponentParams: { items: res },
                nzOnOk: component => new Promise(resolve => {
                    component.submit({
                        before: () => component.loading = true,
                        success: () => {
                            this.message.info('设置成功');
                            resolve(true);
                        },
                        failure: () => resolve(false),
                        after: () => component.loading = false
                    });
                })
            })
        });

    }

}
