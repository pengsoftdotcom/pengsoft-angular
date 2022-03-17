import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ResetPasswordComponent } from 'src/app/components/modal/reset-password/reset-password.component';
import { Button } from 'src/app/components/support/button/button';
import { IdentityCardService } from 'src/app/services/basedata/identity-card.service';
import { OrganizationService } from 'src/app/services/basedata/organization.service';
import { PersonService } from 'src/app/services/basedata/person.service';
import { RegionService } from 'src/app/services/basedata/region.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { DictionaryItemService } from 'src/app/services/system/dictionary-item.service';
import { PersonComponent } from '../person/person.component';

@Component({
    selector: 'app-organization-admin',
    templateUrl: './organization-admin.component.html',
    styleUrls: ['./organization-admin.component.scss']
})
export class OrganizationAdminComponent extends PersonComponent {

    organization: any;

    drawerRef!: NzDrawerRef;

    @ViewChild('selectComponent', { static: true }) selectComponent!: TemplateRef<any>;

    constructor(
        private organizationService: OrganizationService,
        public override region: RegionService,
        public override identityCard: IdentityCardService,
        public override dictionaryItem: DictionaryItemService,
        public override entity: PersonService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(region, identityCard, dictionaryItem, entity, security, modal, message);
    }

    override initListToolbar(): Button[] {
        const buttons = super.initListToolbar();
        buttons.splice(2, 2);
        return buttons;
    }

    override initListAction(): Button[] {
        return [{
            name: '选择',
            type: 'link',
            width: 30,
            authority: 'basedata::organization::get_admin',
            action: (row: any) => this.setAdmin(row)
        }];
    }

    override initEditToolbar(): Button[] {
        return [
            { name: '保存', type: 'primary', size: 'default', action: () => this.setAdmin(JSON.parse(JSON.stringify(this.editForm))), authority: 'basedata::organization::set_admin' },
            { name: '重置密码', size: 'default', isReadonly: form => !form.id, action: () => this.resetPassword(this.editForm), authority: 'security::user::reset_password' },
            { name: '选择', size: 'default', action: () => this.showSelectAdmin(), authority: 'basedata::person::find_page' },
            { name: '删除', type: 'primary', danger: true, size: 'default', isReadonly: form => !form.id, action: () => this.setAdmin(null), authority: 'basedata::organization::set_admin' }
        ];
    }

    override afterInit(): void {
        // to nothing
    }

    setAdmin(admin?: any): void {
        if (admin) {
            if (admin.identityCard && JSON.stringify(admin.identityCard.address) === '{}') {
                delete admin.identityCard.address;
            }
            if (JSON.stringify(admin.identityCard) === '{}') {
                delete admin.identityCard;
            }
        }
        this.organizationService.setAdmin(this.organization, admin, {
            errors: this.errors,
            before: () => this.editComponent.loading = true,
            success: () => {
                this.message.info('设置成功！');
                this.editComponent.hide();
                this.hideSelectAdmin();
            },
            after: () => this.editComponent.loading = false
        });
    }

    showSelectAdmin(): void {
        this.editComponent.hide();
        this.list();
        this.drawerRef = this.editComponent.drawer.create({
            nzBodyStyle: { padding: '16px' },
            nzWidth: '60%',
            nzTitle: '选择管理员',
            nzContent: this.selectComponent
        });
    }

    hideSelectAdmin(): void {
        if (this.drawerRef) {
            this.drawerRef.close();
        }
    }

    override resetPassword(row: any): void {
        this.modal.create({
            nzBodyStyle: { padding: '16px', marginBottom: '-24px' },
            nzTitle: '重置密码',
            nzContent: ResetPasswordComponent,
            nzComponentParams: {
                form: { id: row.user.id }
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
