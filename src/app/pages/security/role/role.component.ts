import { Component, ViewChild } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Button } from 'src/app/components/support/button/button';
import { EditManyToManyComponent } from 'src/app/components/support/edit-many-to-many/edit-many-to-many.component';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { TreeEntityComponent } from 'src/app/components/support/tree-entity.component';
import { AuthorityService } from 'src/app/services/security/authority.service';
import { RoleService } from 'src/app/services/security/role.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { FieldUtils } from 'src/app/utils/field-utils';
import { RolePopupComponent } from './role-popup.component';

@Component({
    selector: 'app-role',
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.scss']
})
export class RoleComponent extends TreeEntityComponent<RoleService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    @ViewChild('editManyToManyComponent', { static: true }) editManyToManyComponent!: EditManyToManyComponent;

    modalRef!: NzModalRef;

    grantToolbar: Button[] = [{
        name: '保存', type: 'primary', size: 'default',
        authority: this.getAuthority('grantAuthorities'),
        action: () => {
            const role = this.editForm;
            const authorities = this.editManyToManyComponent.items
                .filter(item => item.direction === 'right')
                .map(item => item.value);
            this.entity.grantAuthorities(role, authorities, {
                before: () => this.editManyToManyComponent.loading = true,
                success: () => {
                    this.message.info('保存成功');
                    this.editManyToManyComponent.hide();
                },
                after: () => this.editManyToManyComponent.loading = false
            });
        }
    }];

    constructor(
        public drawer: NzDrawerService,
        public authority: AuthorityService,
        public override entity: RoleService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    override initFields(): Field[] {
        return super.initFields().concat(
            FieldUtils.buildTextForCode(),
            FieldUtils.buildTextForName(),
            FieldUtils.buildTextareaForRemark()
        );
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        buttons.splice(0, 0, {
            name: '分配权限',
            type: 'link',
            width: 58,
            authority: this.getAuthority('findAllRoleAuthoritiesByRole'),
            action: (row: any) => this.editGrantedAuthorities(row)
        }, {
            name: '复制权限',
            type: 'link',
            width: 58,
            authority: this.getAuthority('findPage'),
            action: (row: any) => this.showSelectRoleComponent(row)
        });
        return buttons;
    }

    editGrantedAuthorities(row: any): void {
        this.editForm = row;
        this.editManyToManyComponent.show();
        this.authority.findAll({}, [], {
            before: () => this.editManyToManyComponent.loading = true,
            success: (authorities: any) => {
                this.editManyToManyComponent.items =
                    authorities.map((authority: any) => Object.assign({ title: authority.name, key: authority.id, value: authority }));
                this.entity.findAllRoleAuthoritiesByRole(row, {
                    success: (roleAuthorities: any) =>
                        this.editManyToManyComponent.targetKeys = roleAuthorities.map((roleAuthority: any) => roleAuthority.authority.id)
                });
            },
            after: () => this.editManyToManyComponent.loading = false
        });
    }

    showSelectRoleComponent(target: any): void {
        this.modalRef = this.modal.create({
            nzWidth: '50%',
            nzContent: RolePopupComponent,
            nzComponentParams: { copy: source => this.copyAuthorities(source, target) },
            nzFooter: null
        });
    }

    copyAuthorities(source: any, target: any): void {
        this.entity.copyAuthorities(source, target, {
            success: () => {
                this.message.info('复制成功');
                this.modalRef.close();
            }
        });
    }

}
