import { Component, Input, OnInit } from '@angular/core';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { BaseComponent } from '../base.component';

@Component({
    selector: 'app-edit-one-to-many',
    templateUrl: './edit-one-to-many.component.html',
    styleUrls: ['./edit-one-to-many.component.scss']
})
export class EditOneToManyComponent extends BaseComponent {

    @Input() override title: string;

    @Input() override width: string;

    @Input() override height: string;

    component: any;

    params: any;

    drawerRef!: NzDrawerRef;

    constructor(private drawer: NzDrawerService) {
        super();
        this.width = '80%';
        this.visible = false;
    }

    override show(): void {
        this.visible = true;
        this.drawerRef = this.drawer.create({
            nzWidth: this.width,
            nzContent: this.component,
            nzContentParams: this.params,
            nzClosable: false
        });
    }

    override hide(): void {
        this.visible = false;
        if (this.drawerRef) {
            this.drawerRef.close();
        }
    }

}
