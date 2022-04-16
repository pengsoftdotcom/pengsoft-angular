import { Component } from '@angular/core';
import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal';
import { InputComponent } from '../input.component';

@Component({
    selector: 'app-input-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss']
})
export class PopupComponent extends InputComponent {

    multiple = false;

    params: any = {};

    rowCode = 'name';

    constructor(private modal: NzModalService) {
        super();
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.modelChange(this.form[this.code]);
        if (this.edit.input?.popupComponentParams?.multiple) {
            this.multiple = true;
        }
        if (this.edit.input?.popupComponentParams) {
            this.params = this.edit.input.popupComponentParams;
        }
        if (this.edit.input?.popupComponentSelectRowCode) {
            this.rowCode = this.edit.input?.popupComponentSelectRowCode;
        }
        if (this.form[this.code]) {
            this.setName();
        } else {
            this.form[this.code] = {};
        }
    }

    setName(): void {
        let value = { ...this.form[this.code] };
        this.rowCode.split('.').forEach(code => {
            if (value) {
                value = value[code];
            }
        });
        this.form[this.code].name = value;
    }

    popup(): void {
        const component = this.edit?.input?.popupComponent;
        component.prototype.select = (row: any) => {
            this.form[this.code] = row;
            this.setName();
            if (this.edit.input?.popupComponentSelect) {
                this.edit.input.popupComponentSelect(this, row);
            }
            this.modelChange(row);
            modalRef.close();
        };
        const options: ModalOptions = {
            nzContent: component,
            nzComponentParams: this.params,
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
