import { Component, Input, OnInit } from '@angular/core';
import { InputType } from 'src/app/enums/input-type.enum';
import { BaseComponent } from '../base.component';
import { Edit } from '../edit/edit';
import { Field } from '../list/field';
import { Upload } from '../input/upload/upload';

@Component({
    selector: 'app-form-item',
    templateUrl: './form-item.component.html',
    styleUrls: ['./form-item.component.scss']
})
export class FormItemComponent extends BaseComponent implements OnInit {

    InputType = InputType;

    @Input() form: any = {};

    @Input() errors: any = {};

    @Input() field: Field | undefined;

    @Input() filterable = false;

    @Input() column = 1;

    @Input() labelSpan = 4;

    @Input() inputSpan = 24;

    edit: Edit | undefined;

    code = '';

    required = false;

    label = '';

    labelVisible = true;

    colonVisible = true;

    inputVisible = true;

    ngOnInit(): void {
        this.initForm();
        this.initEdit();
        this.check();
        this.initRequired();
        this.initSpan();
        this.initLabel();
        this.initLabelVisible();
        this.initColonVisible();
        this.initInputVisible();
    }

    private initEdit() {
        if (this.filterable) {
            this.edit = this.field?.filter;
        } else {
            this.edit = this.field?.edit;
        }

        if (this.field?.parentCode) {
            this.code = this.field.parentCode + '.';
        }

        if (this.edit?.code) {
            if (!this.edit.code?.startsWith(this.code)) {
                this.code += this.edit.code;
            } else {
                this.code = this.edit.code;
            }
        }

        if (this.filterable && this.edit) {
            this.edit.code = this.code;
        }
    }

    private initForm() {
        if (!this.form) {
            this.form = {};
        }
    }

    private initSpan() {
        if (this.column > 1 && this.edit?.column === 1) {
            this.labelSpan /= this.column;
        }
        this.inputSpan = 24 - this.labelSpan;
    }

    check(): void {
        if (this.edit === undefined) {
            throw new Error('The edit is not configured.');
        }
        if (this.edit.label === undefined) {
            throw new Error('The label is not configured.');
        }
        if (this.edit.input === undefined) {
            throw new Error('The input is not configured.');
        }
    }

    get editVisible(): boolean {
        if (typeof this.edit?.visible === 'function') {
            return this.edit.visible(this.form, this.edit);
        }
        else {
            return this.edit?.visible !== false;
        }
    }

    initRequired(): void {
        this.required = !this.filterable && !!this.edit?.required;
    }

    initLabel(): void {
        if (this.field && this.field.name) {
            this.label = this.field.name;
        }
        if (this.edit?.label?.value) {
            this.label = this.edit.label.value;
        }
    }


    initLabelVisible(): void {
        this.labelVisible = this.edit?.label?.visible !== false;
    }

    initColonVisible(): void {
        this.colonVisible = this.edit?.label?.noColon !== true;
    }

    initInputVisible(): void {
        this.inputVisible = this.edit?.input?.visible !== false;
    }

    get status(): string {
        if (this.errors && JSON.stringify(this.errors) !== '{}' && !!this.errors[this.code]) {
            return 'error';
        } else {
            return '';
        }
    }

}
