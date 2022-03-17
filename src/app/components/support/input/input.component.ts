import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Edit } from '../edit/edit';
import { Label } from '../form-item/label';

@Component({
    template: ''
})
export abstract class InputComponent extends BaseComponent implements OnInit {

    rawValue: any;

    @Input() form: any;

    @Input() edit!: Edit;

    @Input() errors: any;

    code: string;

    placeholder = '';

    ngOnInit(): void {
        this.initCode();
        this.initPlaceholder();
    }

    initCode(): void {
        if (this.edit.code) {
            this.code = this.edit.code;
        }
    }

    initPlaceholder(): void {
        if (this.edit.input?.placeholder) {
            this.placeholder = this.edit.input.placeholder;
        }
    }

    modelChange(event: any): void {
        if (this.edit.input?.modelChange) {
            this.edit.input.modelChange(event);
        }
    }

    clear(): void {
        if (this.form[this.code]) {
            delete this.form[this.code];
        }
    }

    get readonly(): boolean {
        if (typeof this.edit.readonly === 'function') {
            return this.edit.readonly(this.form, this.edit);
        } else {
            if (this.edit.readonly === undefined) {
                return false;
            } else {
                return this.edit.readonly;
            }
        }
    }

}
