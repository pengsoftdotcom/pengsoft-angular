import { Component } from '@angular/core';
import { InputComponent } from '../input.component';

@Component({
    selector: 'app-input-text',
    templateUrl: './text.component.html',
    styleUrls: ['./text.component.scss']
})
export class TextComponent extends InputComponent {

    override modelChange(event: any): void {
        super.modelChange(event);
        if (event === '' && this.edit.code) {
            delete this.form[this.edit.code];
        }
    }

}
