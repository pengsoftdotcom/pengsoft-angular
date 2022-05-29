import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { PayrollRecordService } from 'src/app/services/oa/payroll-record.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { DictionaryItemService } from 'src/app/services/system/dictionary-item.service';
import { FieldUtils } from 'src/app/utils/field-utils';

@Component({
    selector: 'app-payroll-record',
    templateUrl: './payroll-record.component.html',
    styleUrls: ['./payroll-record.component.scss']
})
export class PayrollRecordComponent extends EntityComponent<PayrollRecordService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    constructor(
        private dictionaryItem: DictionaryItemService,
        public override entity: PayrollRecordService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    initFields(): Field[] {
        return [
            FieldUtils.buildNumber({ code: 'year', name: '年', list: { width: 100, align: 'center' } }),
            FieldUtils.buildNumber({ code: 'month', name: '月', list: { width: 100, align: 'center' } }),
            FieldUtils.buildSelectForDictionaryItem({ code: 'status', name: '状态', list: { width: 100, align: 'center' } }, this.dictionaryItem, 'payroll_record_status'),
            FieldUtils.buildNumber({ code: 'paidCount', name: '支付人数', edit: { readonly: true } }),
            FieldUtils.buildNumber({ code: 'confirmedCount', name: '确认人数', edit: { readonly: true } }),
            FieldUtils.buildUpload({ code: 'sheet', name: '工资表' }, {
                locked: true, accept: FieldUtils.EXECL,
                remove: (file: NzUploadFile) => new Observable(observer => this.entity.deleteSheetByAsset(this.editForm, file.response[0], {
                    before: () => this.getEditComponent().loading = true,
                    success: (res: any) => {
                        observer.next(true);
                        delete res.sheet;
                        delete res.confirmPictures;
                        this.editForm.sheet = null;
                        this.editForm = { ...this.editForm, ...res };
                        this.list();
                    },
                    failure: () => observer.next(false),
                    after: () => this.getEditComponent().loading = false
                }))
            }),
            FieldUtils.buildUpload({ code: 'confirmPictures', name: '确认图片' }, {
                locked: true, multiple: true, accept: FieldUtils.IMAGE,
                remove: (file: NzUploadFile) => new Observable(observer => this.entity.deleteConfirmPictureByAsset(this.editForm, file.response[0], {
                    before: () => this.getEditComponent().loading = true,
                    success: (res: any) => {
                        observer.next(true);
                        delete res.sheet;
                        delete res.confirmPictures;
                        this.editForm = { ...this.editForm, ...res };
                        const index = this.editForm.confirmPictures.findIndex((picture: any) => picture.id === file.response[0].id);
                        if (index > -1) {
                            this.editForm.confirmPictures.splice(index, 1);
                        }
                        this.list();
                    },
                    failure: () => observer.next(false),
                    after: () => this.getEditComponent().loading = false
                }))
            }),
            FieldUtils.buildDatetime({ code: 'importedAt', name: '导入时间', list: { visible: false }, edit: { readonly: true } })
        ];
    }

}
