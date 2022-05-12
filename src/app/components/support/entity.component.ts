import { Injectable, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EntityService } from 'src/app/services/support/entity.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { BaseComponent } from './base.component';
import { Button } from './button/button';
import { EditComponent } from './edit/edit.component';
import { FilterComponent } from './filter/filter.component';
import { Field } from './list/field';
import { ListComponent } from './list/list.component';
import { Nav } from './list/nav';
import { Page } from './list/page';
import { Sort } from './list/sort';

@Injectable()
export abstract class EntityComponent<S extends EntityService> extends BaseComponent implements OnInit {

    filterForm: any = {};

    filterWidth = 900;

    filterSpan = 12;

    editForm: any = {};

    editToolbar: Button[] = [];

    fields: Field[] = [];

    listData: any[] = [];

    pageData: Page = { page: 1, size: 20, total: 1, sort: [] };

    sortData: Sort[] = [];

    listToolbar: Button[] = [];

    listAction: Button[] = [];

    allowLoadNavData = true;

    nav!: Nav | null;

    errors: any = {};

    child = false;

    sequenceChangeable = false;

    constructor(
        public entity: EntityService,
        public security: SecurityService,
        public modal: NzModalService,
        public message: NzMessageService
    ) {
        super();
    }

    abstract getListComponent(): ListComponent;

    abstract getEditComponent(): EditComponent;

    ngOnInit(): void {
        this.beforeInit();
        this.fields = this.initFields();
        this.initFieldsPropertyDefaultValue(this.fields);
        this.sequenceChangeable = this.initSequenceChangeable();
        this.editToolbar = this.initEditToolbar();
        this.listToolbar = this.initListToolbar();
        this.listAction = this.initListAction();
        this.afterInit();
    }

    beforeInit(): void {
        // 空实现
    }

    initNav(): Nav | null {
        return null;
    }

    abstract initFields(): Field[];

    initFieldsPropertyDefaultValue(fields: Field[]): void {
        fields.forEach(field => this.initFieldPropertyDefaultValue(null, field));
    }

    initFieldPropertyDefaultValue(field: Field | null, subField: Field): void {
        if (field) {
            subField.parentCode = field.parentCode ? field.parentCode + '.' + field.code : field.code;
            if (field.list?.childrenVisible === false && subField.list) {
                subField.list.visible = false;
            }
            if (field.edit?.childrenVisible === false && subField.edit) {
                subField.edit.visible = false;
            }
        } else {
            if (subField.children) {
                subField.children.forEach(subSubField => this.initFieldPropertyDefaultValue(subField, subSubField));
            }
        }
    }

    initSequenceChangeable(): boolean {
        return this.security.hasAnyAuthority(this.getAuthority('sort'));
    }

    initEditToolbar(): Button[] {
        return [
            { name: '保存', type: 'primary', size: 'default', action: () => this.save(), authority: this.getAuthority('save') }
        ];
    }

    initListToolbar(): Button[] {
        const buttons: Button[] = [
            { name: '刷新', icon: 'reload', action: () => this.list(), authority: this.getAuthority('findPage') + ', ' + this.getAuthority('findAll') },
            { name: '新增', type: 'primary', action: () => this.edit(), authority: this.getAuthority('save') },
            { name: '批量删除', type: 'primary', danger: true, action: () => this.delete(), authority: this.getAuthority('delete') }
        ];
        if (this.fields.some(field => field.filter)
            || this.fields.filter(field => field.children).some(field => field.children && field.children.some(subField => subField.filter))) {
            buttons.splice(1, 0, {
                name: '搜索',
                authority: this.getAuthority('findPage') + ', ' + this.getAuthority('findAll'),
                action: () => this.filter()
            });
        }
        return buttons;

    }

    initListAction(): Button[] {
        return [
            { name: '查看', type: 'link', width: 30, action: (row: any) => this.edit(row), authority: this.getAuthority('findOne'), exclusive: this.getAuthority('save') },
            { name: '修改', type: 'link', width: 30, action: (row: any) => this.edit(row), authority: this.getAuthority('save') },
            { name: '删除', type: 'link', danger: true, width: 30, action: (row: any) => this.delete(row), authority: this.getAuthority('delete') }
        ];
    }

    protected getAuthority(action: string): string {
        if (action.indexOf('::') === -1) {
            let moduleCode = '';
            let entityCode = '';
            let actionCode = '';
            if (this.entity) {
                moduleCode = this.entity.modulePath.replace(/\//g, '_').replace(/-/g, '_');
                entityCode = this.entity.entityPath.replace(/\//g, '_').replace(/-/g, '_');
                const length = action.length;
                for (let index = 0; index < length; index++) {
                    const c = action.charAt(index);
                    if (c === c.toUpperCase()) {
                        actionCode += '_' + c.toLowerCase();
                    } else {
                        actionCode += c;
                    }
                }
            }
            return [moduleCode, entityCode, actionCode].join('::');
        } else {
            return action;
        }
    }

    afterInit(): void {
        if (this.allowLoadNavData) {
            this.nav = this.initNav();
        }
        if (!this.nav) {
            this.list();
        }
    }

    beforeEdit(_row?: any): void {
        this.errors = {};
        this.editForm = {};
    }

    edit(row?: any): void {
        this.beforeEdit();
        const id = row ? row.id : null;
        if (this.entity) {
            this.entity.findOne(id, {
                before: () => this.getListComponent().loading = true,
                success: res => {
                    this.editForm = res
                    this.getEditComponent().show();
                    this.afterEdit(row);
                },
                after: () => this.getListComponent().loading = false
            });
        }
    }

    afterEdit(_row?: any): void {
        // 空实现
    }

    save(): void {
        const form = this.buildEditForm();
        if (this.entity) {
            this.entity.save(form, {
                errors: this.errors,
                before: () => this.getEditComponent().loading = true,
                success: (res: any) => this.saveSuccess(res),
                after: () => this.getEditComponent().loading = false,
            });
        }
    }

    saveSuccess(_res: any): void {
        this.message.info('保存成功');
        this.getEditComponent().hide();
        this.list();
    }

    protected buildEditForm(): any {
        return Object.assign({}, this.editForm);
    }

    filter(): void {
        this.modal.create({
            nzBodyStyle: { padding: '16px', marginBottom: '-24px' },
            nzTitle: '搜索',
            nzWidth: this.filterWidth,
            nzContent: FilterComponent,
            nzComponentParams: {
                span: this.filterSpan,
                form: this.filterForm,
                fields: this.fields
            },
            nzOnOk: () => this.list(),
            nzCancelText: '重置',
            nzOnCancel: () => {
                this.filterForm = {};
                this.afterFilterFormReset();
            }
        });
    }

    afterFilterFormReset(): void {
        this.list();
    }

    list(): void {
        if (this.pageData) {
            this.entity.findPage(this.filterForm, this.pageData, {
                before: () => this.getListComponent().loading = true,
                success: (res: any) => {
                    this.listData = res.content;
                    this.pageData.total = res.totalElements;
                },
                after: () => {
                    this.getListComponent().loading = false;
                    this.uncheckAll();
                }
            });
        } else {
            this.entity.findAll(this.filterForm, this.sortData, {
                before: () => this.getListComponent().loading = true,
                success: res => this.listData = res,
                after: () => {
                    this.getListComponent().loading = false;
                    this.uncheckAll();
                }
            });
        }
    }

    uncheckAll(): void {
        if (this.getListComponent()) {
            this.getListComponent().allChecked = false;
            this.getListComponent().indeterminate = false;
        }
    }

    delete(row?: any): void {
        const ids = row ? [row.id] : this.listData.filter(entity => entity.checked).map(entity => entity.id);
        if (ids.length > 0) {
            this.modal.confirm({
                nzTitle: '确定要删除这些数据吗？',
                nzOnOk: () => new Promise(resolve => {
                    if (this.entity) {
                        this.entity.delete(ids, {
                            before: () => this.getListComponent().loading = true,
                            success: () => {
                                this.afterDelete(ids.map(id => this.listData.find(value => value.id === id)));
                                this.message.info('删除成功');
                            },
                            after: () => {
                                this.getListComponent().loading = false;
                                this.uncheckAll();
                                resolve();
                            }
                        });
                    }
                })
            });
        }
    }

    afterDelete(_deletedRows: any[]): void {
        this.list();
    }

    sort(): void {
        const entities = this.listData.filter(d => d.dirty);
        if (entities.length > 0) {
            if (this.entity) {
                this.entity.sort(entities, {
                    before: () => this.getListComponent().loading = true,
                    success: () => {
                        this.message.info('排序成功');
                        this.list();
                    },
                    after: () => this.getListComponent().loading = false
                });
            }
        }
    }

    override hide(): void {
        super.hide();
        if (this.getListComponent()) {
            this.getListComponent().hide();
        }
        if (this.getEditComponent()) {
            this.getEditComponent().hide();
        }
    }

}
