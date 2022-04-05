import { Component } from '@angular/core';
import { NzCascaderOption } from 'ng-zorro-antd/cascader';
import { InputComponent } from '../input.component';

@Component({
    selector: 'app-input-cascader',
    templateUrl: './cascader.component.html',
    styleUrls: ['./cascader.component.scss']
})
export class CascaderComponent extends InputComponent {

    override ngOnInit(): void {
        super.ngOnInit();
        if (!this.edit.input?.lazy && this.edit.input?.load) {
            this.edit.input.load(this);
        }
        if (this.form[this.code]) {
            const id = this.form[this.code].id;
            const parentIds = this.form[this.code].parentIds;
            if (parentIds) {
                this.rawValue = parentIds.split('::').concat(id);
            } else {
                this.rawValue = [id];
            }
        }
    }

    override modelChange(event: any): void {
        if (this.rawValue && this.rawValue.length > 0) {
            this.form[this.code] = { id: this.rawValue[this.rawValue.length - 1] };
        } else {
            this.form[this.code] = null;
        }
    }

    getOptions(): NzCascaderOption[] {
        if (this.edit.input?.options) {
            return this.edit.input.options as NzCascaderOption[];
        } else {
            return [];
        }
    }

}
