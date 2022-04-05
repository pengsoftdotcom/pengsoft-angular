import { Component } from '@angular/core';
import { InputComponent } from '../input.component';

@Component({
    selector: 'app-input-text',
    templateUrl: './text.component.html',
    styleUrls: ['./text.component.scss']
})
export class TextComponent extends InputComponent {

    override modelChange(event: string): void {
        super.modelChange(event);
        if (!event) {
            delete this.form[this.code];
        } else {
            this.form[this.code] = event.trim();
        }
    }

}
