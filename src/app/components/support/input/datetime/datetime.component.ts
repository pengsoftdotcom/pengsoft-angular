import { Component } from '@angular/core';
import { DateUtils } from 'src/app/utils/date-utils';
import { InputComponent } from '../input.component';

@Component({
    selector: 'app-input-datetime',
    templateUrl: './datetime.component.html',
    styleUrls: ['./datetime.component.scss']
})
export class DatetimeComponent extends InputComponent {

    override modelChange(event: any): void {
        if (this.rawValue) {
            this.form[this.code] = DateUtils.formatDateTime(this.rawValue);
        } else {
            this.form[this.code] = null;
        }
    }

}
