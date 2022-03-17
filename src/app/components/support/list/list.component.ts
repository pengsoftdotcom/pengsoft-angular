import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityService } from 'src/app/services/support/security.service';
import { BaseComponent } from '../base.component';
import { Button } from '../button/button';
import { Field } from './field';
import { Nav } from './nav';
import { Page } from './page';
import { Sort } from './sort';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {

    @Input() override title: string;

    @Input() checkbox = true;

    @Input() fields: Field[] = [];

    visibleFields: Field[] = [];

    @Input() nav!: Nav | null;

    @Input() navSpan = 4;

    @Input() listData: any[] = [];

    @Input() pageData!: Page;

    @Input() sortData: Array<Sort> = [];

    @Input() toolbar: Button[] = [];

    @Input() action: Button[] = [];

    @Output() pageChange = new EventEmitter<Page>();

    @Output() sortChange = new EventEmitter<any>();

    @Output() expandChange = new EventEmitter<any>();

    @Input() sequenceChangeable = false;

    @Input() sortField: Field = { code: 'sequence', name: '排序', list: { code: '', sortPriority: 1 }, edit: { code: '' } };

    @Output() sequenceChange = new EventEmitter<any>();

    @Output() navChange = new EventEmitter<any>();

    navHeight: any = 0;

    bodyHeight: any = 0;

    widthConfig: any[] = [];

    allChecked = false;

    indeterminate = false;

    checkedCount = 0;

    pageable = false;

    groupable = false;

    @Input() level = 1;

    fieldsArray: Field[][] = [];

    firstVisibleFieldIndex = -1;

    @Input() tree = false;

    constructor(private security: SecurityService, public sanitizer: DomSanitizer) {
        super();
        this.title = '列表';
    }

    ngOnInit(): void {
        this.initVisibleFields();
        this.initGroupable();
        this.initPageable();
        this.initWidthConfig();
        this.initBodyHeight();
    }

    private initVisibleFields() {
        let fields = JSON.parse(JSON.stringify(this.fields));
        while (fields.length > 0) {
            if (fields.filter((field: Field) => field.list && field.list.visible).length > 0) {
                this.fieldsArray.push(fields);
            }
            let subFields: Field[] = [];
            fields.filter((field: Field) => field.children)
                .forEach((field: Field) => field.children?.forEach((subField: Field) => subFields.push(subField)));
            fields = subFields;
        }

        const queue: any[] = [];
        this.fields.forEach((field: Field) => {
            queue.push(field);
            while (queue.length > 0) {
                field = queue.shift();
                if (field.children) {
                    field.children.forEach((subField: Field) => queue.push(subField));
                } else if (field.list && field.list.visible) {
                    this.visibleFields.push(field);
                }
            }
        });
    }

    private initGroupable(): void {
        this.groupable = this.fields.some(field => field.list && field.list.childrenVisible && field.children);
    }

    private initPageable(): void {
        if (this.pageData) {
            this.pageable = true;
        } else {
            this.pageData = { page: 1, size: 20 };
        }

    }

    private initBodyHeight(): void {
        const totalHeight = window.innerHeight - 64 - 48 - 48 - 41 - 46;
        this.navHeight = totalHeight - 24;

        const titleHeight = 41;
        const toolbarHeight = 57;
        const headerHeight = this.groupable ? 47 * 2 : 47;

        this.bodyHeight = totalHeight;
        this.bodyHeight -= titleHeight;
        this.bodyHeight -= toolbarHeight;
        this.bodyHeight -= headerHeight;
        this.bodyHeight += 'px';
    }

    private initWidthConfig(): void {
        if (this.checkbox) {
            const checkAllWidth = 46;
            this.widthConfig.push(checkAllWidth);
        }

        this.visibleFields.forEach(field => {
            if (field.children) {
                field.children.forEach((subField: Field) => this.fillWidthConfig(subField));
            } else {
                this.fillWidthConfig(field);
            }
        });

        const sortWidth = 82;
        if (this.sequenceChangeable) {
            this.widthConfig.push(sortWidth);
        }

        let actionWidth = 17;
        this.action = this.action.filter(button => this.security.hasAnyAuthority(button.authority, button.exclusive));
        this.action.forEach((button, index) => {
            if (button.width) {
                actionWidth += button.width;
            }
            if (index + 1 < this.action.length) {
                actionWidth += 17;
            }
        });
        if (this.action.length > 0) {
            this.widthConfig.push(actionWidth);
        }
        this.widthConfig = this.widthConfig.map(width => width ? width + 'px' : null);
    }

    private fillWidthConfig(field: Field): void {
        if (field.list && field.list.visible) {
            if (field.list.width) {
                this.widthConfig.push(field.list.width);
            } else {
                this.widthConfig.push(null);
            }
        }
    }

    private initLefWidthAndCount(field: Field, leftWidth: any, noWidthColumbCount: number) {
        if (field.list && field.list.visible) {
            if (field.list.width) {
                leftWidth -= field.list.width;
            } else {
                noWidthColumbCount++;
            }
        }
        return { leftWidth, noWidthColumbCount };
    }

    checkAll(allChecked: boolean): void {
        this.indeterminate = false;
        this.allChecked = allChecked;
        this.checkedCount = allChecked ? this.listData.length : 0;
        this.listData.forEach((data: any) => data.checked = allChecked);
    }

    check(): void {
        this.checkedCount = this.listData.filter((data: any) => data.checked).length;
        this.allChecked = this.listData.every((data: any) => data.checked);
        this.indeterminate = !this.allChecked && !this.listData.every((data: any) => !data.checked);
    }

    isVisible(row: any): boolean {
        if (this.tree) {
            const parents = this.listData.filter((data, i) => row.id !== data.id && row.parentIds.indexOf(data.id) > -1);
            if (parents.length > 0) {
                return parents.every(parent => parent.expand);
            }
        }
        return true;
    }

    getRowspan(field?: Field, index?: number): number {
        let rowspan = 1;
        if (!field) {
            rowspan = this.fieldsArray.length;
        } else if (!field.children && index !== undefined) {
            rowspan = this.fieldsArray.length - index;
        }
        return rowspan;
    }

    getColspan(field: Field): number {
        if (field.children) {
            let length = 0;
            const queue: Field[] = [field];
            while (queue.length > 0) {
                const f = queue.shift();
                if (f) {
                    if (f.children) {
                        f.children.forEach(subField => queue.push(subField))
                    } else if (f.list && f.list.visible) {
                        length++;
                    }
                }
            }
            return length;
        } else {
            return 1;
        }
    }

    render(field: Field, row: any): any {
        const list = field.list;
        let value: any;
        value = row;
        if (field.parentCode) {
            const codes = field.parentCode.split('.');
            for (const code of codes) {
                value = value[code];
            }
        }
        if (list) {
            if (list.render) {
                value = list.render(field, value, this.sanitizer);
            } else if (list.code) {
                value = value !== undefined && value !== null ? value[list.code] : null;
            }
        }
        if (value === undefined || value === null) {
            return '-';
        } else {
            return value;
        }
    }

    sortOrderChange(field: Field, direction: string): void {
        let code = field.code ? field.code : '';
        if (field.parentCode) {
            code = field.parentCode + '.' + code;
        }
        const sort: Sort = { code, direction: 'asc', priority: 0 };
        if (field.list?.sortPriority) {
            sort.priority = field.list.sortPriority;
        }
        switch (direction) {
            case 'ascend':
                sort.direction = 'asc';
                break;
            case 'descend':
                sort.direction = 'desc';
                break;
            default:
                sort.direction = 'asc';
                break;
        }
        let sortData: Sort[] = this.sortData;
        if (this.pageable && this.pageData.sort) {
            sortData = this.pageData.sort;
        }

        const index = sortData.findIndex(value => value.code === code);
        if (index > -1) {
            sortData.splice(index, 1);
        }
        if (sort.direction) {
            sortData.push(sort);
        }
        sortData.sort((a, b) => {
            if (a.priority < b.priority) {
                return -1;
            } else if (a.priority === b.priority) {
                return 0;
            } else {
                return 1;
            }
        });
        if (this.pageable) {
            this.pageChange.emit();
        } else {
            this.sortChange.emit();
        }
    }

    counter(i: number) {
        return new Array(i);
    }

    get tableSpan(): number {
        return this.nav ? (24 - this.navSpan) : 24;
    }

    isReadonly(buuton: Button, form: any): boolean {
        if (buuton.isReadonly) {
            return buuton.isReadonly(form);
        } else {
            return false;
        }
    }

    getAlign(field: Field): 'left' | 'center' | 'right' {
        if (field.list?.align) {
            return field.list.align;
        } else {
            return 'left';
        }
    }

    getLabel(field: Field): string {
        if (field.list?.label) {
            return field.list.label
        }
        if (field.name) {
            return field.name;
        }
        return '';
    }

}
