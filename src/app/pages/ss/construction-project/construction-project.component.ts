import { Component, ElementRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Button } from 'src/app/components/support/button/button';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { InputComponent } from 'src/app/components/support/input/input.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { ConstructionProjectService } from 'src/app/services/ss/construction-project.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { FieldUtils } from 'src/app/utils/field-utils';

@Component({
    selector: 'app-construction-project',
    templateUrl: './construction-project.component.html',
    styleUrls: ['./construction-project.component.scss']
})
export class ConstructionProjectComponent extends EntityComponent<ConstructionProjectService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    @ViewChild('file') file: ElementRef;

    constructor(
        public override entity: ConstructionProjectService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    initFields(): Field[] {
        const ruManagerField = FieldUtils.buildPopupForStaff({
            code: 'ruManager', name: '负责人',
            edit: { required: false, readonly: (form: any) => !form.regulatoryUnit },
            list: { align: 'center' }
        });

        const ownerManagerField = FieldUtils.buildPopupForStaff({
            code: 'ownerManager', name: '负责人',
            edit: { required: false, readonly: (form: any) => !form.owner },
            list: { align: 'center' }
        });

        const suManagerField = FieldUtils.buildPopupForStaff({
            code: 'suManager', name: '负责人',
            edit: { required: false, readonly: (form: any) => !form.supervisionUnit },
            list: { width: 110, align: 'center' }
        });

        const buManagerField = FieldUtils.buildPopupForStaff({
            code: 'buManager', name: '负责人',
            edit: { required: false, readonly: (form: any) => !form.buildingUnit },
            list: { width: 110, align: 'center' }
        });
        return [
            FieldUtils.buildTextForCode({ width: 120, align: 'center' }),
            FieldUtils.buildTextForName(),
            FieldUtils.buildText({
                code: '', name: '监管单位',
                children: [
                    FieldUtils.buildPopupForOrganization(
                        {
                            code: 'regulatoryUnit', name: '单位', edit: {
                                required: false, input: {
                                    modelChange: () => {
                                        if (ruManagerField.edit && ruManagerField.edit?.input && ruManagerField.edit.input.popupComponentParams) {
                                            ruManagerField.edit.input.popupComponentParams.organization = this.editForm.regulatoryUnit;
                                        }
                                        if (this.editForm.ruManager && this.editForm.ruManager.job.department.organization.id !== this.editForm.regulatoryUnit.id) {
                                            this.editForm.ruManager = {};
                                        }
                                    }
                                }
                            }, list: { label: '名称', align: 'center' }
                        }),
                    ruManagerField
                ]
            }),
            FieldUtils.buildText({
                code: '', name: '建设单位',
                children: [
                    FieldUtils.buildPopupForOrganization({
                        code: 'owner', name: '单位', edit: {
                            required: false, input: {
                                modelChange: () => {
                                    if (ownerManagerField.edit && ownerManagerField.edit?.input && ownerManagerField.edit.input.popupComponentParams) {
                                        ownerManagerField.edit.input.popupComponentParams.organization = this.editForm.owner;
                                    }
                                    if (this.editForm.ownerManager && this.editForm.ownerManager.job.department.organization.id !== this.editForm.owner.id) {
                                        this.editForm.ownerManager = {};
                                    }
                                }
                            }
                        }, list: { label: '名称', align: 'center' }
                    }),
                    ownerManagerField
                ]
            }),
            FieldUtils.buildText({
                code: '', name: '监理单位',
                children: [
                    FieldUtils.buildPopupForOrganization({
                        code: 'supervisionUnit', name: '单位', edit: {
                            required: false, input: {
                                modelChange: () => {
                                    if (suManagerField.edit && suManagerField.edit?.input && suManagerField.edit.input.popupComponentParams) {
                                        suManagerField.edit.input.popupComponentParams.organization = this.editForm.supervisionUnit;
                                    }
                                    if (this.editForm.suManager && this.editForm.suManager.job.department.organization.id !== this.editForm.supervisionUnit.id) {
                                        this.editForm.suManager = {};
                                    }
                                }
                            }
                        }, list: { label: '名称', align: 'center' }
                    }),
                    suManagerField
                ]
            }),
            FieldUtils.buildText({
                code: '', name: '施工单位',
                children: [
                    FieldUtils.buildPopupForOrganization({
                        code: 'buildingUnit', name: '单位', edit: {
                            required: false, input: {
                                modelChange: () => {
                                    if (buManagerField.edit && buManagerField.edit?.input && buManagerField.edit.input.popupComponentParams) {
                                        buManagerField.edit.input.popupComponentParams.organization = this.editForm.buildingUnit;
                                    }
                                    if (this.editForm.buManager && this.editForm.buManager.job.department.organization.id !== this.editForm.buildingUnit.id) {
                                        this.editForm.buManager = {};
                                    }
                                }
                            }
                        }, list: { label: '名称', align: 'center' }
                    }),
                    buManagerField,
                    FieldUtils.buildNumber({ code: 'payday', name: '发薪日', list: { width: 60, align: 'center' } })
                ]
            }),
        ];
    }

    override initListToolbar(): Button[] {
        const buttons = super.initListToolbar();
        buttons.splice(3, 0, { name: '导入', type: 'primary', action: () => this.choose(), authority: this.getAuthority('importData') });
        return buttons;
    }

    choose(): void {
        this.file.nativeElement.click();
    }

    importData(): void {
        this.entity.importData(this.file.nativeElement.files[0], {
            before: () => this.listComponent.loading = true,
            success: () => this.list(),
            after: () => this.listComponent.loading = false
        });
    }

    protected override buildEditForm() {
        const form = super.buildEditForm();
        if (JSON.stringify(form.ruManager) === '{}') {
            delete form.ruManager;
        }
        if (JSON.stringify(form.ownerManager) === '{}') {
            delete form.ownerManager;
        }
        if (JSON.stringify(form.suManager) === '{}') {
            delete form.suManager;
        }
        if (JSON.stringify(form.buManager) === '{}') {
            delete form.buManager;
        }
        return form;
    }

}
