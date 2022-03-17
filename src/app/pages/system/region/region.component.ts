import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { TreeEntityComponent } from 'src/app/components/support/tree-entity.component';
import { RegionService } from 'src/app/services/basedata/region.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { FieldUtils } from 'src/app/utils/field-utils';

@Component({
    selector: 'app-region',
    templateUrl: './region.component.html',
    styleUrls: ['./region.component.scss']
})
export class RegionComponent extends TreeEntityComponent<RegionService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    constructor(
        public override entity: RegionService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    override get parentQueryLazy(): boolean {
        return true;
    }

    override initFields(): Field[] {
        return [
            FieldUtils.buildCascaderForRegion(this.entity, { code: 'parent', name: '上级', list: { visible: false } }),
            FieldUtils.buildTextForCode(),
            FieldUtils.buildTextForName(),
            FieldUtils.buildText({ code: 'shortName', name: '简称' }),
            FieldUtils.buildText({ code: 'index', name: '索引' }),
            FieldUtils.buildTextareaForRemark()
        ];
    }

}
