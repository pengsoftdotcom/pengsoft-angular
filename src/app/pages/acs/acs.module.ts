import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { ComponentModule } from 'src/app/components/component.module';
import { AcsRoutingModule } from './acs-routing.module';
import { AccessRecordComponent } from './access-record/access-record.component';
import { PersonFaceDataComponent } from './person-face-data/person-face-data.component';

@NgModule({
    declarations: [
        AccessRecordComponent,
        PersonFaceDataComponent
    ],
    imports: [
        CommonModule,
        AcsRoutingModule,
        ComponentModule,
        NzStepsModule,
        NzGridModule,
        NzSpaceModule,
        NzSpinModule
    ]
})
export class AcsModule { }
