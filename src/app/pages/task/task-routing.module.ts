import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskComponent } from './task/task.component';

const routes: Routes = [
    { path: 'task', component: TaskComponent, data: { code: 'task::task::find_page', name: '我的任务' } }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TaskRoutingModule { }
