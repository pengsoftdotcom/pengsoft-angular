import { Component, ViewChild } from '@angular/core';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SwitchOrganizationComponent } from 'src/app/components/modal/switch-organization/switch-organization.component';
import { Button } from 'src/app/components/support/button/button';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { OrganizationService } from 'src/app/services/basedata/organization.service';
import { SupplierConsumerService } from 'src/app/services/basedata/supplier-consumer.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { DictionaryItemService } from 'src/app/services/system/dictionary-item.service';
import { FieldUtils } from 'src/app/utils/field-utils';
import { OrganizationPopupComponent } from '../organization/organization-popup.component';
import { OrganizationComponent } from '../organization/organization.component';
import { SelectSupplierComponent } from './select-supplier.component';

@Component({
    selector: 'app-supplier',
    templateUrl: './supplier.component.html',
    styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent extends EntityComponent<SupplierConsumerService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    drawerRef!: NzDrawerRef;

    consumer: any;

    constructor(
        private drawer: NzDrawerService,
        private dictionaryItem: DictionaryItemService,
        private organization: OrganizationService,
        public override entity: SupplierConsumerService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService,
    ) {
        super(entity, security, modal, message);
        this.consumer = this.security.userDetails.primaryOrganization;
    }

    initFields(): Field[] {
        OrganizationComponent.prototype.dictionaryItem = this.dictionaryItem;
        OrganizationComponent.prototype.entity = this.organization;
        const organizationFields = OrganizationComponent.prototype.initFields();
        return [
            FieldUtils.buildSelect({ code: 'supplier', name: '供应商', children: organizationFields, list: { visible: false } }),
            FieldUtils.buildSelect({ code: 'consumer', name: '客户', list: { visible: false, childrenVisible: false }, edit: { visible: false, childrenVisible: false } })
        ];
    }

    override afterInit(): void {
        if (this.consumer) {
            this.filterForm['consumer.id'] = this.consumer.id;
            super.afterInit();
        } else {
            this.switchOrganization();
        }
    }

    override initListToolbar(): Button[] {
        const buttons = super.initListToolbar();
        if (!this.security.userDetails.primaryOrganization) {
            buttons.splice(0, 0, {
                name: '切换机构',
                type: 'link',
                action: () => this.switchOrganization()
            });
        }
        buttons.forEach(button => {
            if (button.name === '新增') {
                button.isReadonly = () => !this.consumer;
            }
        })
        return buttons;
    }

    override initEditToolbar(): Button[] {
        const buttons = super.initEditToolbar();
        buttons.splice(1, 0, { name: '选择', size: 'default', action: (row: any) => this.showSelectSupplier() });
        return buttons;
    }

    override afterEdit(): void {
        this.editForm.consumer = this.consumer;
    }

    override save(): void {
        const form = this.buildEditForm();
        this.entity.saveSupplier(form, {
            errors: this.errors,
            before: () => this.getEditComponent().loading = true,
            success: (res: any) => this.saveSuccess(res),
            after: () => this.getEditComponent().loading = false
        });
    }

    override saveSuccess(res: any): void {
        super.saveSuccess(res);
        if (this.drawerRef) {
            this.hideSelectSupplier();
        }
    }

    showSelectSupplier(): void {
        this.editComponent.hide();
        this.drawerRef = this.drawer.create({
            nzBodyStyle: { padding: '16px' },
            nzWidth: '70%',
            nzTitle: '选择供应商',
            nzContent: SelectSupplierComponent,
            nzContentParams: { editForm: this.editForm, supplierComponent: this }
        });
    }

    hideSelectSupplier(): void {
        this.drawerRef.close();
    }

    switchOrganization(): void {
        const modalRef = this.modal.create({
            nzWidth: '80%',
            nzContent: OrganizationPopupComponent,
            nzComponentParams: {
                title: '切换机构',
                action: '切换',
                select: row => {
                    this.consumer = row;
                    this.title = this.consumer.name;
                    modalRef.close();
                    this.afterInit();
                }
            },
            nzFooter: null
        });
    }

}
