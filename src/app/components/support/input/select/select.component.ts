import { Component, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EntityUtils } from 'src/app/utils/entity-utils';
import { InputComponent } from '../input.component';
import { Option } from '../tree-select/option';

@Component({
    selector: 'app-input-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss']
})
export class SelectComponent extends InputComponent implements OnChanges {

    constructor(public sanitizer: DomSanitizer) { super(); }

    override ngOnInit(): void {
        super.ngOnInit();
        this.ngOnChanges();
    }

    ngOnChanges(): void {
        this.rawValue = this.edit.input?.multiple ? this.form[this.code].split(',') : this.form[this.code];
        if (this.rawValue && typeof this.rawValue === 'object') {
            const options = this.edit.input?.options;
            if (options && !options.find(option => EntityUtils.equals(option.value, this.rawValue))) {
                const render = this.edit.input?.optionLabelRender;
                const option: any = {
                    label: !render ? this.rawValue.name : render(this.edit, this.form),
                    value: this.rawValue
                };
                option.title = option.label;
                option.key = option.value;
                options.push(option);
            }
        }
    }

    compareWith(v1: any, v2: any): boolean {
        return EntityUtils.equals(v1, v2);
    }

    override modelChange(event: any): void {
        let values: string[];
        if (this.rawValue instanceof Array) {
            values = this.rawValue;
        } else {
            values = [this.rawValue];
        }
        if (this.edit.code) {
            if (values.length > 0) {
                if (this.edit.input?.multiple) {
                    this.form[this.edit.code] = values.join(',');
                } else {
                    this.form[this.edit.code] = values[0];
                }
            } else {
                this.form[this.edit.code] = null;
            }
        }
        super.modelChange(event);
    }

    search(keywords: string): void {
        if (this.edit.input?.load) {
            this.edit.input.load(this, keywords);
        }
    }

    customRender(option: Option): string | SafeHtml {
        if (option.customRender) {
            return option.customRender(this.sanitizer);
        } else {
            return '';
        }
    }

}
