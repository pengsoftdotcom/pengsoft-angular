import { Component, ViewChild } from '@angular/core';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
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
import { SelectConsumerComponent } from './select-consumer.component';

@Component({
    selector: 'app-consumer',
    templateUrl: './consumer.component.html',
    styleUrls: ['./consumer.component.scss']
})
export class ConsumerComponent extends EntityComponent<SupplierConsumerService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    drawerRef!: NzDrawerRef;

    supplier: any;

    constructor(
        private dictionaryItem: DictionaryItemService,
        private organization: OrganizationService,
        public override entity: SupplierConsumerService,
        public override modal: NzModalService,
        public override security: SecurityService,
        public override message: NzMessageService,
        public drawer: NzDrawerService
    ) {
        super(entity, security, modal, message);
        this.supplier = this.security.userDetails.primaryOrganization;
    }

    initFields(): Field[] {
        OrganizationComponent.prototype.dictionaryItem = this.dictionaryItem;
        OrganizationComponent.prototype.entity = this.organization;
        const organizationFields = OrganizationComponent.prototype.initFields();
        return [
            FieldUtils.buildSelect({ code: 'supplier', name: '供应商', list: { visible: false, childrenVisible: false }, edit: { visible: false, childrenVisible: false } }),
            FieldUtils.buildSelect({ code: 'consumer', name: '客户', children: organizationFields, list: { visible: false }, edit: { visible: false } })
        ];
    }

    override afterInit(): void {
        if (this.supplier) {
            this.filterForm['supplier.id'] = this.supplier.id;
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
                button.isDisabled = () => !this.supplier;
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
        this.editForm.supplier = this.supplier;
    }

    override save(): void {
        const form = this.buildEditForm();
        this.entity.saveConsumer(form, {
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
            nzTitle: '选择客户',
            nzContent: SelectConsumerComponent,
            nzContentParams: { editForm: this.editForm, consumerComponent: this }
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
                    this.supplier = row;
                    this.title = this.supplier.name;
                    modalRef.close();
                    this.afterInit();
                }
            },
            nzFooter: null
        });
    }

}
