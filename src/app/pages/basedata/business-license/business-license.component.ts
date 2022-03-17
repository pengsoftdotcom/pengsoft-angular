import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Button } from 'src/app/components/support/button/button';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { BusinessLicenseService } from 'src/app/services/basedata/business-license.service';
import { OrganizationService } from 'src/app/services/basedata/organization.service';
import { RegionService } from 'src/app/services/basedata/region.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { FieldUtils } from 'src/app/utils/field-utils';

@Component({
    selector: 'app-business-license',
    templateUrl: './business-license.component.html',
    styleUrls: ['./business-license.component.scss']
})
export class BusinessLicenseComponent extends EntityComponent<BusinessLicenseService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    organization: any;

    constructor(
        private region: RegionService,
        private organizationService: OrganizationService,
        public override entity: BusinessLicenseService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.editComponent.width = '60%';
    }

    initFields(): Field[] {
        return [
            // FieldUtils.buildUpload({ code: 'asset', name: '证件照片', edit: { column: 1 } }, {
            //     locked: true,
            //     modelChange: () => {
            //         this.organizationService.recgonizeBusinessLicense(this.editForm.asset, {
            //             before: () => this.editComponent.loading = true,
            //             success: res => {
            //                 const editForm = JSON.parse(JSON.stringify(this.editForm));
            //                 editForm.business = res.business;
            //                 editForm.capital = res.capital;
            //                 editForm.establishDate = res.establishDate;
            //                 editForm.legalPerson = res.legalPerson;
            //                 editForm.name = res.name;
            //                 editForm.registerNumber = res.registerNumber;
            //                 editForm.type = res.type;
            //                 editForm.validPeriod = res.validPeriod;
            //                 editForm.address = res.address;
            //                 this.editForm = editForm;
            //             },
            //             after: () => this.editComponent.loading = false,
            //         });
            //     }
            // }),
            FieldUtils.buildText({ code: 'registerNumber', name: '统一社会信用代码' }),
            FieldUtils.buildTextForName({ edit: { required: false } }),
            FieldUtils.buildText({ code: 'type', name: '类型' }),
            FieldUtils.buildText({ code: 'legalPerson', name: '法定代表人' }),
            FieldUtils.buildText({ code: 'capital', name: '注册资本' }),
            FieldUtils.buildDate({ code: 'establishDate', name: '成立日期' }),
            FieldUtils.buildDate({ code: 'validPeriod', name: '营业期限', edit: { label: { tooltip: '2999年12月31日表示“长期”' } } }),
            FieldUtils.buildComposite({
                code: 'address', name: '住所', edit: { column: 1 }, children: [
                    FieldUtils.buildCascaderForRegion(this.region),
                    FieldUtils.buildText({ code: 'detail' })
                ]
            }),
            FieldUtils.buildTextarea({ code: 'business', name: '经营范围', edit: { column: 1 } })
        ];
    }

    override initListToolbar(): Button[] {
        const buttons = super.initListToolbar();
        buttons.splice(2, 2);
        return buttons;
    }

    override initListAction(): Button[] {
        return [
            {
                name: '选择',
                type: 'link',
                width: 30,
                authority: 'basedata::organization::get_admin',
                action: (row: any) => this.setBusinessLicense(row)
            }
        ];
    }

    override initEditToolbar(): Button[] {
        return [
            { name: '保存', type: 'primary', size: 'default', action: () => this.setBusinessLicense(JSON.parse(JSON.stringify(this.editForm))), authority: 'basedata::organization::set_admin' },
            { name: '删除', type: 'primary', danger: true, size: 'default', isReadonly: form => !form.id, action: () => this.setBusinessLicense(null), authority: 'basedata::organization::set_admin' }
        ];
    }


    override afterInit(): void {
        // to nothing
    }

    setBusinessLicense(businessLicense?: any): void {
        this.organizationService.setBusinessLicense(this.organization, businessLicense, {
            errors: this.errors,
            before: () => this.getEditComponent().loading = true,
            success: () => {
                this.message.info('设置成功！');
                this.getEditComponent().hide();
            },
            after: () => this.getEditComponent().loading = false
        });
    }

}
