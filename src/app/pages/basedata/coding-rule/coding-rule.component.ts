import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { CodingRuleService } from 'src/app/services/basedata/coding-rule.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { FieldUtils } from 'src/app/utils/field-utils';

@Component({
    selector: 'app-coding-rule',
    templateUrl: './coding-rule.component.html',
    styleUrls: ['./coding-rule.component.scss']
})
export class CodingRuleComponent extends EntityComponent<CodingRuleService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    constructor(
        public override entity: CodingRuleService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    initFields(): Field[] {
        return [
            FieldUtils.buildText({ code: 'entity', name: '实体', edit: { required: true } }),
            FieldUtils.buildText({ code: 'prefix', name: '前缀' }),
            FieldUtils.buildText({ code: 'suffix', name: '后缀' }),
            FieldUtils.buildNumber({ code: 'step', name: '步长' }),
            FieldUtils.buildNumber({ code: 'index', name: '角标' }),
            FieldUtils.buildNumber({ code: 'length', name: '长度' }),
            FieldUtils.buildText({ code: 'value', name: '值' }),
            FieldUtils.buildText({ code: 'generator', name: '生成器', edit: { required: true } })
        ];
    }

}
