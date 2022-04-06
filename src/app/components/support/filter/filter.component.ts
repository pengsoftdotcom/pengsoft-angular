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
                const f = queue.shift();
                if (f && f.filter && f.filter?.visible) {
                    result.push(f);
                }
                if (f && f.children) {
                    f.children.forEach((sf: any) => queue.push(sf));
                }
            }
        });
        this.fields = result;
    }

}
