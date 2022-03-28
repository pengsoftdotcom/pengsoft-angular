import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal';
import { InputComponent } from '../input.component';

@Component({
    selector: 'app-input-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss']
})
export class PopupComponent extends InputComponent implements OnChanges {

    multiple = false;

    rowCode = 'name';

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

    override ngOnInit(): void {
        super.ngOnInit();
        if (this.edit.input?.popupComponentParams?.multiple) {
            this.multiple = true;
        }
        if (this.edit.input?.popupComponentSelectRowCode) {
            this.rowCode = this.edit.input?.popupComponentSelectRowCode;
        }
    }

    popup(): void {
        if (this.edit.input?.popupComponent) {
            this.edit.input.popupComponent.prototype.select = (row: any, listData: any[]) => {
                if (this.edit.code) {
                    this.form[this.edit.code] = row;
                    if (this.form[this.edit.code]) {
                        this.rawValue = eval('row.' + this.rowCode);
                    }
                    if (this.edit.input?.popupComponentSelect) {
                        this.edit.input.popupComponentSelect(this, row);
                    }
                }
                modalRef.close();
            };
            const options: ModalOptions = {
                nzContent: this.edit.input.popupComponent,
                nzComponentParams: this.edit.input.popupComponentParams,
                nzWidth: '80%',
                nzFooter: null
            };
            if (this.multiple) {
                options.nzOnOk = () => {
                    if (this.edit.code) {
                        this.form[this.edit.code] = modalRef.getContentComponent().listData.filter((row: any) => row.checked);
                        this.rawValue = this.form[this.edit.code].map((row: any) => eval('row.' + this.rowCode)).join(', ');
                    }
                };
                delete options.nzFooter;
            }

            const modalRef = this.modal.create(options);
        }
    }

}
