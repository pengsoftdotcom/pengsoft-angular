import { Component, ElementRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Button } from 'src/app/components/support/button/button';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
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
        return [
            // FieldUtils.buildTextForCode(),
            FieldUtils.buildTextForName(),
            FieldUtils.buildPopupForOrganization({ code: 'owner', name: '建设单位' }),
            FieldUtils.buildText({ code: 'ownerManager', name: '项目负责人', list: { width: 100, align: 'center' } }),
            FieldUtils.buildPopupForOrganization({ code: 'supervisionUnit', name: '监理单位' }),
            FieldUtils.buildText({ code: 'suManager', name: '总监理工程师', list: { width: 110, align: 'center' } }),
            FieldUtils.buildPopupForOrganization({ code: 'buildingUnit', name: '施工单位' }),
            FieldUtils.buildPopupForStaff({ code: 'buManager', name: '项目经理', list: { width: 110, align: 'center', render: (field: Field, row: any) => row.buManager?.person?.name } })
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

}
