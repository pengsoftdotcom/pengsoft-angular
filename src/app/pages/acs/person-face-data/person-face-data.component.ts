import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { PersonFaceDataService } from 'src/app/services/acs/person-face-data.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { DictionaryItemService } from 'src/app/services/system/dictionary-item.service';
import { FieldUtils } from 'src/app/utils/field-utils';
import { PersonPopupComponent } from '../../basedata/person/person-popup.component';
import { PersonComponent } from '../../basedata/person/person.component';

@Component({
    selector: 'app-person-face-data',
    templateUrl: './person-face-data.component.html',
    styleUrls: ['./person-face-data.component.scss']
})
export class PersonFaceDataComponent extends EntityComponent<PersonFaceDataService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    constructor(
        private dictionaryItem: DictionaryItemService,
        public override entity: PersonFaceDataService,
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
                edit: {
                    required: true,
                    input: { popupComponent: PersonPopupComponent }
                },
                list: {
                    width: 150, render: (f, row) => {
                        if (f.code) {
                            return row[f.code]?.name
                        }
                        else {
                            return '';
                        }
                    }
                },
                filter: {},
                children: PersonComponent.prototype.initFields()[0].children,
            }),
            FieldUtils.buildImageData({ code: 'face', name: '人脸' }),
            FieldUtils.buildText({ code: 'duration', name: '通行时段' })
        ];
    }

}
