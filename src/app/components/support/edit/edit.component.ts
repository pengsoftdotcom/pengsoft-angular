import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { BaseComponent } from '../base.component';
import { Button } from '../button/button';
import { Field } from '../list/field';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent extends BaseComponent implements OnInit {

    @Input() override title: string;

    @Input() mode: 'drawer' | 'modal' = 'drawer';

    @Input() form: any = {};

    @Input() fields: Field[] = [];

    @Input() toolbar: Button[] = [];

    @Input() errors: any = {};

    @ViewChild('content', { static: true }) content!: TemplateRef<any>;

    formHeight = 0;

    drawerRef!: NzDrawerRef;

    @Input() level = 1;

    @Input() column = 1;

    @Input() labelSpan = 4;

    @Input() inputSpan = 20;

    constructor(public drawer: NzDrawerService) {
        super();
        this.title = '编辑';
        this.width = '30%';
    }

    ngOnInit(): void {
        this.initFormHeight();
    }

    private initFormHeight() {
        const totalHeight = window.innerHeight;
        const titleHeight = 55;
        const toolbarHeight = 65;
        this.formHeight = totalHeight - titleHeight - toolbarHeight;
    }

    override show(): void {
        this.drawerRef = this.drawer.create({
            nzBodyStyle: { padding: 0 },
            nzWidth: this.width,
            nzTitle: this.title,
            nzContent: this.content,
            nzClosable: false
        });
    }

    override hide(): void {
        if (this.drawerRef) {
            this.drawerRef.close();
        }
    }

    getForm(field: Field, form: any): any {
        if (field.edit?.code) {
            return form[field.edit.code];
        }
        if (field.code) {
            return form[field.code];
        }
        return form;
    }

}
