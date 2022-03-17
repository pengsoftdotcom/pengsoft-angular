import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { EntityUtils } from 'src/app/utils/entity-utils';
import { InputComponent } from '../input.component';

@Component({
    selector: 'app-input-tree-select',
    templateUrl: './tree-select.component.html',
    styleUrls: ['./tree-select.component.scss']
})
export class TreeSelectComponent extends InputComponent implements OnInit, OnChanges {

    override ngOnInit(): void {
        super.ngOnInit();
        if (this.edit?.input?.load) {
            this.edit.input.load(this);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['form'] && this.edit && this.edit.code) {
            if (this.form[this.edit.code]) {
                if (this.edit.input?.multiple) {
                    this.rawValue = this.form[this.edit.code].split(',');
                } else {
                    this.rawValue = this.form[this.edit.code].id;
                }
            } else {
                this.rawValue = undefined;
            }
        }
    }

    override modelChange(event: any): void {
        let values: string[];
        if (this.rawValue instanceof Array) {
            values = this.rawValue;
        } else {
            values = [this.rawValue];
        }
        if (this.edit.code) {
            if (this.edit.input) {
                this.form[this.edit.code] = EntityUtils.findTreeNodes((this.edit.input.options as NzTreeNodeOptions[]), values);
            }
            if (this.form[this.edit.code].length > 0) {
                if (this.edit.input?.multiple) {
                    this.form[this.edit.code] = this.form[this.edit.code].map((node: NzTreeNodeOptions) => node.key).join(',');
                } else {
                    this.form[this.edit.code] = this.form[this.edit.code][0].value;
                }
            } else {
                this.form[this.edit.code] = null;
            }
        }
    }

    getNodes(): NzTreeNodeOptions[] {
        if (this.edit.input?.options) {
            return this.edit.input?.options as NzTreeNodeOptions[];
        } else {
            return [];
        }
    }

}
