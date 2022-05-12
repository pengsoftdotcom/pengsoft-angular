import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstructionProjectComponent } from './construction-project/construction-project.component';
import { QualityCheckComponent } from './quality-check/quality-check.component';
import { SafetyCheckComponent } from './safety-check/safety-check.component';
import { SafetyTrainingComponent } from './safety-training/safety-training.component';

const routes: Routes = [{
    path: 'ss',
    data: { name: '施工监管', icon: 'safety' },
    children: [
        { path: 'construction-project', component: ConstructionProjectComponent, data: { code: 'ss::construction_project::find_page', name: '工程项目' } },
        { path: 'safety-check', component: SafetyCheckComponent, data: { code: 'ss::safety_check::find_page', name: '安全检查' } },
        { path: 'quality-check', component: QualityCheckComponent, data: { code: 'ss::quality_check::find_page', name: '质量检查' } },
        { path: 'safety-training', component: SafetyTrainingComponent, data: { code: 'ss::safety_training::find_page', name: '安全培训' } }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SsRoutingModule { }
