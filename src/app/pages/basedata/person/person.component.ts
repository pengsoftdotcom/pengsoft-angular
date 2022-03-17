import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ResetPasswordComponent } from 'src/app/components/modal/reset-password/reset-password.component';
import { Button } from 'src/app/components/support/button/button';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { IdentityCardService } from 'src/app/services/basedata/identity-card.service';
import { PersonService } from 'src/app/services/basedata/person.service';
import { RegionService } from 'src/app/services/basedata/region.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { DictionaryItemService } from 'src/app/services/system/dictionary-item.service';
import { FieldUtils } from 'src/app/utils/field-utils';

@Component({
    selector: 'app-person',
    templateUrl: './person.component.html',
    styleUrls: ['./person.component.scss']
})
export class PersonComponent extends EntityComponent<PersonService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    constructor(
        public region: RegionService,
        public identityCard: IdentityCardService,
        public dictionaryItem: DictionaryItemService,
        public override entity: PersonService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        if (this.editComponent) {
            this.editComponent.width = '60%';
        }
    }

    initFields(): Field[] {
        return FieldUtils.buildPersonFields(this.dictionaryItem, this.identityCard, this.region, this.entity, this.editComponent);
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        buttons.splice(0, 0, {
            name: '重置密码',
            type: 'link',
            width: 58,
            authority: 'security::user::reset_password',
            action: (row: any) => this.resetPassword(row)
        });
        return buttons;
    }

    override afterEdit(): void {
        if (!this.editForm.identityCard) {
            this.editForm.identityCard = {};
        }
    }

    override buildEditForm(): any {
        const form = super.buildEditForm();
        if (JSON.stringify(form.identityCard) === '{}') {
            delete form.identityCard;
        }
        return form;
    }

    resetPassword(row: any): void {
        this.modal.create({
            nzBodyStyle: { padding: '16px', marginBottom: '-24px' },
            nzTitle: '重置密码',
            nzContent: ResetPasswordComponent,
            nzComponentParams: {
                form: { id: row.user.id }
            },
            nzOnOk: component => new Promise(resolve => {
                component.submit({
                    before: () => component.loading = true,
                    success: () => {
                        this.message.info('重置成功');
                        resolve(true);
                    },
                    failure: () => resolve(false),
                    after: () => component.loading = false
                });
            })
        });
    }

}
