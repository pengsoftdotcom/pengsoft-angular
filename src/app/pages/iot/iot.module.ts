import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { ComponentModule } from 'src/app/components/component.module';
import { DeviceComponent } from './device/device.component';
import { GroupComponent } from './group/group.component';
import { IotRoutingModule } from './iot-routing.module';
import { ProductPopupComponent } from './product/product-popup.component';
import { ProductComponent } from './product/product.component';

@NgModule({
    declarations: [
        DeviceComponent,
        ProductComponent,
        GroupComponent,
        ProductPopupComponent
    ],
    imports: [
        CommonModule,
        IotRoutingModule,
        ComponentModule,
        NzStepsModule,
        NzGridModule,
        NzSpaceModule,
        NzSpinModule
    ]
})
export class IotModule { }
