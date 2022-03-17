import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Button } from 'src/app/components/support/button/button';
import { EditManyToManyComponent } from 'src/app/components/support/edit-many-to-many/edit-many-to-many.component';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { TreeEntityComponent } from 'src/app/components/support/tree-entity.component';
import { DeviceService } from 'src/app/services/iot/device.service';
import { GroupService } from 'src/app/services/iot/group.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { FieldUtils } from 'src/app/utils/field-utils';

@Component({
    selector: 'app-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss']
})
export class GroupComponent extends TreeEntityComponent<GroupService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    @ViewChild('editManyToManyComponent', { static: true }) editManyToManyComponent!: EditManyToManyComponent;

    grantToolbar: Button[] = [{
        name: '保存', type: 'primary', size: 'default',
        authority: this.getAuthority('grantDevices'),
        action: () => {
            const group = this.editForm;
            const authorities = this.editManyToManyComponent.items
                .filter(item => item.direction === 'right')
                .map(item => item.value);
            this.entity.grantDevices(group, authorities, {
                before: () => this.editManyToManyComponent.loading = true,
                success: () => {
                    this.message.info('保存成功');
                    this.editManyToManyComponent.hide();
                },
                after: () => this.editManyToManyComponent.loading = false
            });
        }
    }];

    constructor(
        private device: DeviceService,
        public override entity: GroupService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    override initFields(): Field[] {
        return super.initFields().concat(
            FieldUtils.buildTextForCode(),
            FieldUtils.buildTextForName()
        );
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        buttons.splice(0, 0, {
            name: '分配设备',
            type: 'link',
            width: 58,
            authority: this.getAuthority('findAllGroupDevicesByGroup'),
            action: (row: any) => this.editGroupDevices(row)
        });
        return buttons;
    }

    editGroupDevices(row: any): void {
        this.editForm = row;
        this.editManyToManyComponent.show();
        this.device.findAll({}, [], {
            before: () => this.editManyToManyComponent.loading = true,
            success: (devices: any) => {
                this.editManyToManyComponent.items =
                    devices.map((device: any) => Object.assign({ title: device.name, key: device.id, value: device }));
                this.entity.findAllGroupDevicesByGroup(row, {
                    success: (groupDevices: any) =>
                        this.editManyToManyComponent.targetKeys = groupDevices.map((groupDevice: any) => groupDevice.device.id)
                });
            },
            after: () => this.editManyToManyComponent.loading = false
        });
    }

}
