import { Component, OnInit } from '@angular/core';
import { InputComponent } from '../input.component';

@Component({
    selector: 'app-hidden',
    templateUrl: './hidden.component.html',
    styleUrls: ['./hidden.component.scss']
})
export class HiddenComponent extends InputComponent {

    override modelChange(event: any): void {
        super.modelChange(event);
        if (event === '' && this.edit.code) {
            delete this.form[this.edit.code];
        }
    }

}
