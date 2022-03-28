import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstructionProjectComponent } from './construction-project/construction-project.component';
import { MySafetyTrainingParticipantComponent } from './my-safety-training-participant/my-safety-training-participant.component';
import { SafetyCheckComponent } from './safety-check/safety-check.component';
import { SafetyTrainingComponent } from './safety-training/safety-training.component';

const routes: Routes = [{
    path: 'ss',
    data: { name: '工地安全', icon: 'safety' },
    children: [
        { path: 'construction-project', component: ConstructionProjectComponent, data: { code: 'ss::construction_project::find_page', name: '工程项目' } },
        { path: 'safety-training', component: SafetyTrainingComponent, data: { code: 'ss::safety_training::find_page', name: '安全培训' } },
        { path: 'my-safety-training-participant', component: MySafetyTrainingParticipantComponent, data: { code: 'authorized', name: '我的安全培训', exclusive: 'ss::safety_training::find_page, oa::contract::find_page' } },
        { path: 'safety-check', component: SafetyCheckComponent, data: { code: 'ss::safety_check::find_page', name: '安全检查' } },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SsRoutingModule { }
