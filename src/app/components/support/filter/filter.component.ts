import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Field } from '../list/field';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent extends BaseComponent implements OnInit {

    @Input() span = 12;

    @Input() form = {};

    @Input() fields: Field[] = [];

    ngOnInit(): void {
        const result: Field[] = [];
        const queue: any[] = [];
        this.fields.forEach(field => {
            queue.push(field);
            while (queue.length > 0) {
                field = queue.shift();
                if (field && field.filter && field.edit?.visible) {
                    result.push(Object.assign({}, field));
                }
                if (field && field.children) {
                    field.children.forEach(subField => queue.push(subField));
                }
            }
        });
        this.fields = result;
    }

}
