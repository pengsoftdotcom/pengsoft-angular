import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DateUtils } from 'src/app/utils/date-utils';
import { Field } from '../../list/field';
import { InputComponent } from '../input.component';

@Component({
    selector: 'app-input-date-range',
    templateUrl: './date-range.component.html',
    styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent extends InputComponent implements OnChanges {

    @Input() field!: Field;

    startDate = '';

    endDate = '';

    override ngOnInit(): void {
        super.ngOnInit();
        if (this.field && this.field.code) {
            const arr = this.field.code.split('::');
            this.startDate = this.field.parentCode ? this.field.parentCode + '.' + arr[0] : arr[0];
            this.endDate = this.field.parentCode ? this.field.parentCode + '.' + arr[1] : arr[1];
            this.setRawValue();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['form']) {
            this.setRawValue();
        }
    }

    setRawValue(): void {
        this.rawValue = [];
        if (this.form[this.startDate]) {
            this.rawValue.push(DateUtils.parseDate(this.form[this.startDate]));
        }
        if (this.form[this.endDate]) {
            this.rawValue.push(DateUtils.parseDate(this.form[this.endDate]));
        }
    }

    override modelChange(event: any): void {
        if (this.rawValue) {
            if (this.rawValue[0]) {
                this.form[this.startDate] = DateUtils.formatDate(this.rawValue[0]);
            } else {
                this.form[this.startDate] = null;
            }
            if (this.rawValue[1]) {
                this.form[this.endDate] = DateUtils.formatDate(this.rawValue[1]);
            } else {
                this.form[this.endDate] = null;
            }
        } else {
            this.form[this.startDate] = null;
            this.form[this.endDate] = null;
        }
    }

}
