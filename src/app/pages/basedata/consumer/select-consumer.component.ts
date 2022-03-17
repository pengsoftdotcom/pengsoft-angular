import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Button } from 'src/app/components/support/button/button';
import { OrganizationService } from 'src/app/services/basedata/organization.service';
import { PersonService } from 'src/app/services/basedata/person.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { DictionaryItemService } from 'src/app/services/system/dictionary-item.service';
import { OrganizationComponent } from '../organization/organization.component';
import { ConsumerComponent } from './consumer.component';

@Component({
    selector: 'app-select-consumer',
    templateUrl: './select-consumer.component.html',
    styleUrls: ['./select-consumer.component.scss']
})
export class SelectConsumerComponent extends OrganizationComponent {

    consumerComponent!: ConsumerComponent;

    constructor(
        public override dictionaryItem: DictionaryItemService,
        public override person: PersonService,
        public override entity: OrganizationService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(dictionaryItem, person, entity, security, modal, message);
    }

    override initListToolbar(): Button[] {
        const buttons = super.initListToolbar();
        buttons.splice(2, 2);
        return buttons;
    }

    override initListAction(): Button[] {
        return [{
            name: '选择',
            type: 'link',
            width: 30,
            authority: 'basedata::supplier_consumer::save',
            action: (row: any) => {
                this.editForm.consumer = row;
                this.consumerComponent.save();
            }
        }];
    }

    override list(): void {
        this.entity.findAllAvailableConsumers(this.editForm.supplier, {
            before: () => this.listComponent.loading = true,
            success: (res: any) => {
                this.listComponent.allChecked = false;
                this.listComponent.indeterminate = false;
                this.listData = res;
            },
            after: () => this.listComponent.loading = false
        });
    }

}
