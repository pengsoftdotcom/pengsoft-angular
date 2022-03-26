import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { InputComponent } from 'src/app/components/support/input/input.component';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { Nav } from 'src/app/components/support/list/nav';
import { DeviceService } from 'src/app/services/iot/device.service';
import { GroupService } from 'src/app/services/iot/group.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { EntityUtils } from 'src/app/utils/entity-utils';
import { FieldUtils } from 'src/app/utils/field-utils';
import { ProductPopupComponent } from '../product/product-popup.component';
import { Option } from 'src/app/components/support/input/tree-select/option';
import { Button } from 'src/app/components/support/button/button';

@Component({
    selector: 'app-device',
    templateUrl: './device.component.html',
    styleUrls: ['./device.component.scss']
})
export class DeviceComponent extends EntityComponent<DeviceService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    group: any;

    constructor(
        private groupService: GroupService,
        public override entity: DeviceService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    initFields(): Field[] {
        return [
            FieldUtils.buildTreeSelect({
                code: 'groups', name: '分组', edit: {
                    required: true,
                    input: {
                        lazy: false,
                        multiple: true,
                        load: (component: InputComponent) => {
                            if (component.edit.input) {
                                component.edit.input.options = this.nav?.data as Option[];
                            }
                        }
                    }
                },
                list: { visible: false }
            }),
            FieldUtils.buildPopup({
                code: 'product', name: '产品',
                edit: {
                    required: true,
                    input: { popupComponent: ProductPopupComponent }
                },
                list: { width: 150, render: (f, row) => f.code ? row[f.code].name : '-' },
                filter: {}
            }),
            FieldUtils.buildTextForCode({ width: 160 }),
            FieldUtils.buildTextForName(),
            FieldUtils.buildText({ code: 'ip', name: 'IP', list: { align: 'center', width: 140 } }),
            FieldUtils.buildDatetime({ code: 'connectedAt', name: '连接时间' })
        ]
    }

    override initNav(): Nav {
        const nav: Nav = {
            showExpand: true,
            data: []
        };
        this.groupService.findAll({}, [], {
            success: (res: any) => nav.data = EntityUtils.convertListToTree(res)
        });
        return nav;
    }

    override initListToolbar(): Button[] {
        const buttons = super.initListToolbar();
        buttons.forEach((button: Button) => {
            if (button.name === '新增') {
                button.isDisabled = () => this.group
            }
        });
        return buttons;
    }

    navChange(event: NzFormatEmitEvent): void {
        if (event.node?.origin.selected) {
            this.group = event.node.origin['value'];
            this.filterForm['group.id'] = event.node.origin.key;
            this.list();
        } else {
            this.group = null;
            delete this.filterForm['group.id'];
        }
    }

    override afterEdit(): void {
        this.editForm.groups = this.group.id;
    }

}
