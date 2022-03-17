import { Component } from '@angular/core';
import { EditComponent } from '../edit/edit.component';
import { Field } from '../list/field';

@Component({
    selector: 'app-edit-tab',
    templateUrl: './edit-tab.component.html',
    styleUrls: ['./edit-tab.component.scss']
})
export class EditTabComponent extends EditComponent {

    get level1Fields(): Field[] {
        return this.fields.filter(field => !field.children);
    }

    get level2Fields(): Field[] {
        return this.fields.filter(field => field.children);
    }

}
