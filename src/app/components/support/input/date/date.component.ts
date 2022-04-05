import { Component } from '@angular/core';
import { DateUtils } from 'src/app/utils/date-utils';
import { InputComponent } from '../input.component';

@Component({
    selector: 'app-input-date',
    templateUrl: './date.component.html',
    styleUrls: ['./date.component.scss']
})
export class DateComponent extends InputComponent {

    override modelChange(event: any): void {
        if (this.rawValue) {
            this.form[this.code] = DateUtils.formatDate(this.rawValue);
        } else {
            this.form[this.code] = null;
        }
    }

}
