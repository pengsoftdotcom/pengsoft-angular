import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { SecurityService } from 'src/app/services/support/security.service';
import { TreeEntityService } from 'src/app/services/support/tree-entity.service';
import { EntityUtils } from 'src/app/utils/entity-utils';
import { FieldUtils } from 'src/app/utils/field-utils';
import { EntityComponent } from './entity.component';
import { Field } from './list/field';
import { Option } from './input/tree-select/option';
import { InputComponent } from './input/input.component';

@Injectable()
export abstract class TreeEntityComponent<S extends TreeEntityService> extends EntityComponent<S> {

    expand = false;

    constructor(
        public override entity: TreeEntityService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
    }

    get parentQueryLazy(): boolean {
        return false;
    }

    get parentQueryParams(): any {
        return null;
    }

    get tree(): boolean {
        return true;
    }

    initFields(): Field[] {
        return [
            FieldUtils.buildTreeSelect({
                code: 'parent', name: '上级',
                list: { visible: false },
                edit: {
                    input: {
                        lazy: this.parentQueryLazy,
                        load: (component: InputComponent, event?: NzFormatEmitEvent) => {
                            if (this.entity) {
                                const self = this.editForm;
                                if (this.parentQueryLazy) {
                                    const parent = event?.node?.origin['value'];
                                    this.entity.findAllExcludeSelfAndItsChildrenByParent(parent, self, this.parentQueryParams, {
                                        before: () => component.loading = true,
                                        success: (res: any) => {
                                            if (event?.node) {
                                                event.node.addChildren(EntityUtils.convertListToTree(res));
                                            } else {
                                                this.setOptions(component, EntityUtils.convertListToTree(res) as Option[]);
                                            }
                                        },
                                        after: () => component.loading = false
                                    });
                                } else {
                                    this.entity.findAllExcludeSelfAndItsChildren(self, this.parentQueryParams, {
                                        before: () => component.loading = true,
                                        success: (res: any) => this.setOptions(component, EntityUtils.convertListToTree(res) as Option[]),
                                        after: () => component.loading = false
                                    });
                                }
                            }
                        }
                    }
                }
            })
        ];
    }

    setOptions(component: InputComponent, options: Option[]): void {
        if (component.edit.input) {
            component.edit.input.options = options;
        }
    }

    override list(): void {
        if (this.entity) {
            if (this.parentQueryLazy) {
                this.entity.findAllByParent(null, this.filterForm, {
                    before: () => this.getListComponent().loading = true,
                    success: (res: any) => {
                        const tree = EntityUtils.convertListToTree(res);
                        const list = EntityUtils.convertTreeToList(tree, node => {
                            const value = node['value'];
                            value.expand = false;
                            value.loaded = false;
                            value.children = node.children;
                            return value;
                        });
                        this.listData = list;
                    },
                    after: () => {
                        this.getListComponent().loading = false;
                        super.uncheckAll();
                    }
                });
            } else {
                this.entity.findAll(this.filterForm, this.sortData, {
                    before: () => this.getListComponent().loading = true,
                    success: (res: any) => {
                        if (this.tree) {
                            const tree = EntityUtils.convertListToTree(res);
                            const list = EntityUtils.convertTreeToList(tree, node => {
                                const value = node['value'];
                                value.expand = this.expand;
                                value.loaded = true;
                                value.children = node.children;
                                const parentIds = value.parentIds ? value.parentIds + '::' + value.id : value.id;
                                value.leaf = !res.some((data: any) => data.parentIds.startsWith(parentIds));
                                return value;
                            });
                            this.listData = list;
                        } else {
                            this.listData = res;
                        }
                    },
                    after: () => {
                        this.getListComponent().loading = false;
                        super.uncheckAll();
                    }
                });
            }
        }
    }

    override afterDelete(deletedRows: any[]): void {
        deletedRows.forEach(row => {
            const i = this.listData.indexOf(row);
            this.listData.splice(i, 1);
            const parentIds = row.parentIds ? row.parentIds + '::' + row.id : row.id;
            while (true) {
                const index = this.listData.findIndex(value => value.parentIds === parentIds);
                if (index < 0) {
                    break;
                } else {
                    this.listData.splice(index, 1);
                }
            }
            if (row.parent) {
                const parent = this.listData.find(value => value.id === row.parent.id);
                if (parent) {
                    parent.leaf = this.listData.filter(value => value.parentIds === row.parentIds).length === 0;
                }
            }
        });
        this.listData = [...this.listData];
    }

    expandChange(row: any): void {
        if (!row.loaded) {
            let index = this.listData.findIndex(value => value.id === row.id);
            if (this.entity) {
                this.entity.findAllByParent(row, this.filterForm, {
                    success: (res: any) => {
                        row.loaded = true;
                        row.expand = true;
                        res.forEach((child: any) => {
                            child.parent = null;
                            this.listData.splice(++index, 0, child);
                            this.listData = [...this.listData];
                        });
                    }
                });
            }
        }
    }

}
