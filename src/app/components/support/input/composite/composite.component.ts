import { Component, Input } from '@angular/core';
import { Field } from '../../list/field';
import { InputComponent } from '../input.component';

@Component({
    selector: 'app-input-composite',
    templateUrl: './composite.component.html',
    styleUrls: ['./composite.component.scss']
})
export class CompositeComponent extends InputComponent {

    @Input() field!: Field;

    get compositeErrors() {
        const errors: any = {};
        if (this.field && this.field.code) {
            for (const key in this.errors) {
                const index = key.indexOf(this.field.code);
                if (key.indexOf('.') > -1 && index > -1) {
                    errors[key.substring(index + this.field.code.length + 1)] = this.errors[key];
                }
            }
        }
        return errors;
    }

}
