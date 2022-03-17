import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { SecurityService } from 'src/app/services/support/security.service';
import { PushMessageService } from 'src/app/services/system/push-message.service';

@Component({
    selector: 'app-push-message',
    templateUrl: './push-message.component.html',
    styleUrls: ['./push-message.component.scss']
})
export class PushMessageComponent extends EntityComponent<PushMessageService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    @ViewChild('content', { static: true }) content!: TemplateRef<any>;

    constructor(
        public override entity: PushMessageService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService) {
        super(entity, security, modal, message);
    }

    initFields(): Field[] {
        return [];
    }

}
