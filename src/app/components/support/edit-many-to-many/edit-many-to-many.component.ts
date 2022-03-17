import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { TransferChange, TransferItem } from 'ng-zorro-antd/transfer';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { BaseComponent } from '../base.component';
import { Button } from '../button/button';

@Component({
    selector: 'app-edit-many-to-many',
    templateUrl: './edit-many-to-many.component.html',
    styleUrls: ['../edit/edit.component.scss', './edit-many-to-many.component.scss']
})
export class EditManyToManyComponent extends BaseComponent implements OnInit {

    @Input() override title: string;

    @Input() toolbar!: Button[];

    items: any[] = [];

    targetKeys = [];

    treeData!: NzTreeNodeOptions[];

    drawerRef!: NzDrawerRef;

    transferHeight!: number;

    @ViewChild('content', { static: true }) content!: TemplateRef<any>;

    searchValue = '';

    constructor(private drawer: NzDrawerService) {
        super();
        this.title = '编辑';
        this.width = '60%';
    }

    ngOnInit(): void {
        this.initTransferHeight();
    }

    private initTransferHeight() {
        const totalHeight = window.innerHeight;
        const titleHeight = 55;
        const toolbarHeight = 65;
        this.transferHeight = totalHeight - titleHeight - toolbarHeight;
    }

    treeSelectChange(event: any, onItemSelect: (item: TransferItem) => void): void {
        event.node.checked = !event.node.checked;
        onItemSelect(this.items.find(item => item.key === event.node.key));
    }

    selectChange(event: any): void {
        if (event.direction === 'left') {
            const queue = Object.assign([], this.treeData);
            while (queue.length > 0) {
                const parent: any = queue.shift();
                if (parent && event.item.key === parent.key) {
                    parent.checked = event.checked;
                }
                if (parent && parent.children) {
                    parent.children.forEach((child: any) => queue.push(child));
                }
            }
        }
    }

    searchChange(event: any): void {
        if (event.direction === 'left') {
            this.searchValue = event.value;
        }
    }

    transferChange(event: TransferChange): void {
        if (event.list.length > 0) {
            const readonly = event.from === 'left';
            if (this.treeData.length > 0) {
                const queue = Object.assign([], this.treeData);
                while (queue.length > 0) {
                    const parent: any = queue.shift();
                    if (parent && event.list.some((selected: any) => selected.key === parent.key)) {
                        parent.readonly = readonly;
                        parent.checked = readonly;
                    }
                    if (parent && parent.children) {
                        parent.children.forEach((child: any) => queue.push(child));
                    }
                }
                this.treeData = Object.assign([], this.treeData);
            }
        }
    }

    override show(): void {
        this.drawerRef = this.drawer.create({
            nzBodyStyle: { padding: 0 },
            nzWidth: this.width,
            nzTitle: this.title,
            nzContent: this.content
        });
    }

    override hide(): void {
        if (this.drawerRef) {
            this.drawerRef.close();
        }
    }

}
