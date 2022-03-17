import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { AccessRecordService } from 'src/app/services/acs/access-record.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { DictionaryItemService } from 'src/app/services/system/dictionary-item.service';
import { FieldUtils } from 'src/app/utils/field-utils';
import { PersonPopupComponent } from '../../basedata/person/person-popup.component';
import { PersonComponent } from '../../basedata/person/person.component';

@Component({
    selector: 'app-access-record',
    templateUrl: './access-record.component.html',
    styleUrls: ['./access-record.component.scss']
})
export class AccessRecordComponent extends EntityComponent<AccessRecordService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    constructor(
        private dictionaryItem: DictionaryItemService,
        public override entity: AccessRecordService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    initFields(): Field[] {
        PersonComponent.prototype.dictionaryItem = this.dictionaryItem;
        return [
            FieldUtils.buildPopup({
                code: 'person', name: '人员信息',
                edit: { required: true, input: { popupComponent: PersonPopupComponent } },
                list: { width: 150, render: (f, row) => row.person ? row.person.name : '-' },
                filter: {},
                children: PersonComponent.prototype.initFields()[0].children,
            }),
            FieldUtils.buildNumber({
                code: 'temperature', name: '通行温度',
                list: { width: 100, align: 'center', render: (field: Field, row: any) => row.temperature ? row.temperature + '°C' : '-' }
            }),
            FieldUtils.buildImageData({ code: 'photo', name: '抓拍照片' }),
            FieldUtils.buildPopup({
                code: 'device', name: '设备',
                edit: { required: true },
                list: { width: 150, render: (f, row) => f.code ? row[f.code]?.name : '-' },
                filter: {}
            })
        ];
    }

}
