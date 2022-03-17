import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzButtonType } from 'ng-zorro-antd/button';
import { BaseComponent } from '../base.component';
import { Button } from './button';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent extends BaseComponent implements OnInit {

    @Input() button!: Button;

    @Input() form: any;

    @Output() action = new EventEmitter<any>();

    ngOnInit(): void {
        if (this.button.type === undefined) {
            this.button.type = 'default';
        }
        if (this.button.danger === undefined) {
            this.button.danger = false;
        }
        if (this.button.size === undefined) {
            this.button.size = 'small';
        }
        if (this.button.loading === undefined) {
            this.button.loading = false;
        }
    }

    isReadonly(): boolean {
        if (this.button.isReadonly) {
            return this.button.isReadonly(this.form);
        } else {
            return false;
        }
    }

    isVisible(): boolean {
        if (this.button.isVisible) {
            return this.button.isVisible(this.form);
        } else {
            return true;
        }
    }

    render(): string {
        if (typeof this.button.name === 'function') {
            return this.button.name(this.form);
        }
        if (typeof this.button.name === 'string') {
            return this.button.name;
        }
        return '';
    }

    getType(): NzButtonType {
        if (this.button.type) {
            return this.button.type;
        } else {
            return null;
        }
    }

}
