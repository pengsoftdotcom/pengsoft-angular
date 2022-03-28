import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { ComponentModule } from 'src/app/components/component.module';
import { ConstructionProjectComponent } from './construction-project/construction-project.component';
import { SafetyTrainingParticipantComponent } from './safety-training-participant/safety-training-participant.component';
import { SafetyTrainingComponent } from './safety-training/safety-training.component';
import { SsRoutingModule } from './ss-routing.module';
import { SafetyCheckComponent } from './safety-check/safety-check.component';
import { MySafetyTrainingParticipantComponent } from './my-safety-training-participant/my-safety-training-participant.component';

@NgModule({
    declarations: [
        ConstructionProjectComponent,
        SafetyTrainingComponent,
        SafetyTrainingParticipantComponent,
        SafetyCheckComponent,
        MySafetyTrainingParticipantComponent
    ],
    imports: [
        CommonModule,
        SsRoutingModule,
        ComponentModule,
        NzStepsModule,
        NzGridModule,
        NzSpaceModule,
        NzSpinModule
    ]
})
export class SsModule { }
