import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentModule } from 'src/app/components/component.module';
import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task/task.component';



@NgModule({
    declarations: [
        TaskComponent
    ],
    imports: [
        CommonModule,
        TaskRoutingModule,
        ComponentModule
    ]
})
export class TaskModule { }
