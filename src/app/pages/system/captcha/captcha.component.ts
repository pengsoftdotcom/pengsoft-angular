import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Button } from 'src/app/components/support/button/button';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { SecurityService } from 'src/app/services/support/security.service';
import { CaptchaService } from 'src/app/services/system/captcha.service';
import { FieldUtils } from 'src/app/utils/field-utils';
import { UserComponent } from '../../security/user/user.component';

@Component({
    selector: 'app-captcha',
    templateUrl: './captcha.component.html',
    styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent extends EntityComponent<CaptchaService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    constructor(
        public override entity: CaptchaService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    initFields(): Field[] {
        UserComponent.prototype.initFields();
        return [
            FieldUtils.buildTextForCode({ width: 103, align: 'center', sortable: false }),
            FieldUtils.buildDatetimeForExpiredAt(),
            FieldUtils.buildText({
                code: 'user', name: '用户',
                children: UserComponent.prototype.initFields()
                    .filter(field => field.code && !['username', 'email', 'weixinMpOpenId'].includes(field.code))
                    .map((field: Field) => {
                        if (field.code === 'expiredAt') {
                            delete field.filter;
                        }
                        return field;
                    })
            })
        ];
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        buttons.splice(0, 1);
        return buttons;
    }

}
