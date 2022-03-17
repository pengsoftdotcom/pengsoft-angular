import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceComponent } from './device/device.component';
import { GroupComponent } from './group/group.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
    {
        path: 'iot',
        data: { name: '设备管理', icon: 'tablet' },
        children: [
            { path: 'product', component: ProductComponent, data: { code: 'iot::product::find_page', name: '产品' } },
            { path: 'device', component: DeviceComponent, data: { code: 'iot::device::find_page', name: '设备' } },
            { path: 'group', component: GroupComponent, data: { code: 'iot::group::find_page', name: '分组' } }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IotRoutingModule { }
