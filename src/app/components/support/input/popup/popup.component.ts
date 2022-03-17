import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { InputComponent } from '../input.component';

@Component({
    selector: 'app-input-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss']
})
export class PopupComponent extends InputComponent implements OnChanges {

    constructor(private modal: NzModalService) {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['form']) {
            if (this.edit && this.edit.code && this.form[this.edit.code]) {
                this.rawValue = this.edit.input?.popupComponentSelectRowCode ? eval('this.form[this.edit.code].' + this.edit.input.popupComponentSelectRowCode) : this.form[this.edit.code].name;
            } else {
                this.rawValue = null;
            }
        }
    }

    override clear(): void {
        super.clear();
        this.rawValue = null;
    }

    popup() {
        if (this.edit.input?.popupComponent) {
            this.edit.input.popupComponent.prototype.select = (row: any) => {
                if (this.edit.code) {
                    this.form[this.edit.code] = row;
                    if (this.form[this.edit.code]) {
                        this.rawValue = this.edit.input?.popupComponentSelectRowCode ? eval('row.' + this.edit.input.popupComponentSelectRowCode) : row.name;
                    }
                    if (this.edit.input?.popupComponentSelect) {
                        this.edit.input.popupComponentSelect(this, row);
                    }
                }
                modalRef.close();
            };
            const modalRef = this.modal.create({
                nzContent: this.edit.input.popupComponent,
                nzComponentParams: this.edit.input.popupComponentParams,
                nzWidth: '80%',
                nzFooter: null
            });
        }
    }

}
