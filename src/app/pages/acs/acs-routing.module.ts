import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessRecordComponent } from './access-record/access-record.component';
import { PersonFaceDataComponent } from './person-face-data/person-face-data.component';



const routes: Routes = [
    {
        path: 'acs',
        data: { name: '门禁管理', icon: 'alert' },
        children: [
            { path: 'access-recard', component: AccessRecordComponent, data: { code: 'acs::access_record::find_page', name: '通行记录' } },
            { path: 'person-face-data', component: PersonFaceDataComponent, data: { code: 'acs::person_face_data::find_page', name: '人脸数据' } }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AcsRoutingModule { }
