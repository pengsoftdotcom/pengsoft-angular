import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Button } from 'src/app/components/support/button/button';
import { Upload } from 'src/app/components/support/input/upload/upload';
import { Field } from 'src/app/components/support/list/field';
import { AssetService } from 'src/app/services/basedata/asset.service';
import { ContractService } from 'src/app/services/oa/contract.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { DictionaryItemService } from 'src/app/services/system/dictionary-item.service';
import { ContractComponent } from '../contract/contract.component';

@Component({
    selector: 'app-my-contract',
    templateUrl: './my-contract.component.html',
    styleUrls: ['./my-contract.component.scss']
})
export class MyContractComponent extends ContractComponent {

    override initFields(): Field[] {
        const fields = super.initFields();
        fields.forEach(field => {
            if (field.code === 'pictures') {
                const upload = field.edit?.input as Upload;
                if (upload) {
                    upload.convertToFile = (entity: any) => new Promise(resolve => this.entity.download(entity.id, null, null, {
                        responseType: 'text',
                        before: () => this.loading = true,
                        success: (data: any) => resolve({
                            uid: entity.id,
                            name: entity.originalName,
                            status: 'done',
                            response: [entity],
                            thumbUrl: data
                        }),
                        after: () => this.loading = false
                    }));
                }
            }
        });
        return fields;
    }

    override initListToolbar(): Button[] {
        const buttons = super.initListToolbar();
        buttons.forEach(button => delete button.authority);
        buttons.splice(2, 2);
        return buttons;
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        buttons.forEach(button => delete button.authority);
        buttons.splice(1, 2);
        return buttons;
    }

    override initEditToolbar(): Button[] {
        return [
            { name: '确认', type: 'primary', size: 'default', action: () => this.confirmOfMine(), isDisabled: (form: any) => form.confirmedAt }
        ];
    }

    confirmOfMine(): void {
        const form = this.buildEditForm();
        this.modal.confirm({
            nzTitle: '合同真实有效吗?',
            nzOnOk: () =>
                this.entity.confirmMine(form, {
                    errors: this.errors,
                    success: () => {
                        this.message.info('确认成功');
                        this.getEditComponent().hide();
                        this.list();
                    }
                })
        });
    }

    override edit(row?: any): void {
        this.beforeEdit();
        this.getEditComponent().show();
        const id = row ? row.id : null;
        if (this.entity) {
            this.entity.findOneOfMine(id, {
                before: () => this.getEditComponent().loading = true,
                success: res => this.editForm = res,
                after: () => {
                    this.getEditComponent().loading = false;
                    this.afterEdit();
                }
            });
        }
    }

    override list(): void {
        this.entity.findPageOfMine(this.filterForm, this.pageData, {
            before: () => this.getListComponent().loading = true,
            success: (res: any) => {
                this.listData = res.content;
                this.pageData.total = res.totalElements;
            },
            after: () => {
                this.getListComponent().loading = false;
                this.uncheckAll();
            }
        });
    }

}
