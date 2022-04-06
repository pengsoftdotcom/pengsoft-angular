import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { InputComponent } from 'src/app/components/support/input/input.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { ContractService } from 'src/app/services/oa/contract.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { DictionaryItemService } from 'src/app/services/system/dictionary-item.service';
import { FieldUtils } from 'src/app/utils/field-utils';
import { OrganizationPopupComponent } from '../../basedata/organization/organization-popup.component';
import { PersonPopupComponent } from '../../basedata/person/person-popup.component';

@Component({
    selector: 'app-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss']
})
export class ContractComponent extends EntityComponent<ContractService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    constructor(
        private dictionaryItem: DictionaryItemService,
        public override entity: ContractService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    initFields(): Field[] {
        const partyAField = FieldUtils.buildPopup({
            code: 'partyA', name: '甲方',
            edit: {
                required: true,
                input: {
                    popupComponentParams: { title: '选择甲方' }, popupComponentSelect: (component: InputComponent, row: any) => {
                        if (this.editForm.partyBId === row.id) {
                            component.clear();
                            this.errors.partyA = ['甲方不能和乙方相同'];
                        } else {
                            this.editForm.partyAId = row.id;
                        }
                    }
                }
            },
            list: { align: 'center', render: (_field: Field, row: any) => row.partyA ? row.partyA.name : '-' }
        });
        const partyBField = FieldUtils.buildPopup({
            code: 'partyB', name: '乙方',
            edit: {
                required: true,
                input: {
                    popupComponentParams: { title: '选择乙方' }, popupComponentSelect: (component: InputComponent, row: any) => {
                        if (this.editForm.partyAId === row.id) {
                            component.clear();
                            this.errors.partyB = ['乙方不能和甲方相同'];
                        } else {
                            this.editForm.partyBId = row.id;
                        }
                    }
                }
            },
            list: { align: 'center', render: (_field: Field, row: any) => row.partyB ? row.partyB.name : '-' }
        });
        return [
            FieldUtils.buildSelectForDictionaryItem({
                code: 'partyAType', name: '甲方类型',
                edit: {
                    required: true, input: {
                        modelChange: () => {
                            delete this.editForm.partyAId;
                            delete this.editForm.partyA;
                            (document.getElementById('partyA') as HTMLInputElement).value = '';
                            if (this.editForm.partyAType && partyAField.edit && partyAField.edit.input) {
                                partyAField.edit.input.popupComponent = this.editForm.partyAType.code === 'organization' ? OrganizationPopupComponent : PersonPopupComponent;
                            }
                        }
                    }
                },
                list: { visible: false },
                filter: {}
            }, this.dictionaryItem, 'contract_party_type'),
            partyAField,
            FieldUtils.buildHidden({ code: 'partyAId' }),
            FieldUtils.buildSelectForDictionaryItem({
                code: 'partyBType', name: '乙方类型',
                edit: {
                    required: true, input: {
                        modelChange: () => {
                            delete this.editForm.partyBId;
                            delete this.editForm.partyB;
                            (document.getElementById('partyB') as HTMLInputElement).value = '';
                            if (this.editForm.partyBType && partyBField.edit && partyBField.edit.input) {
                                partyBField.edit.input.popupComponent = this.editForm.partyBType.code === 'organization' ? OrganizationPopupComponent : PersonPopupComponent;
                            }
                        }
                    }
                },
                list: { visible: false },
                filter: {}
            }, this.dictionaryItem, 'contract_party_type'),
            partyBField,
            FieldUtils.buildHidden({ code: 'partyBId' }),
            FieldUtils.buildSelectForDictionaryItem({ code: 'status', name: '状态' }, this.dictionaryItem, 'contract_status'),
            FieldUtils.buildDate({ code: 'signedAt', name: '签订日期' }),
            FieldUtils.buildDatetime({ code: 'confirmedAt', name: '确认时间', edit: { readonly: true, input: { placeholder: ' ' } } }),
            FieldUtils.buildUpload({
                code: 'pictures', name: '合同图片'
            }, {
                locked: true, multiple: true, accept: FieldUtils.IMAGE,
                remove: (file: NzUploadFile) => new Observable(observer => this.entity.deletePictureByAsset(this.editForm, file.response[0], {
                    success: () => observer.next(true),
                    failure: () => observer.next(false)
                }))
            })
        ];
    }

    confirm(row: any): void {
        this.modal.confirm({
            nzTitle: '确定该合同的真实有效吗？',
            nzOnOk: () => this.entity.confirm(row.id, {
                success: () => this.list()
            }),
        });
    }

}
