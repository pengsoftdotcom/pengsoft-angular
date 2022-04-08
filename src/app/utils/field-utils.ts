import { DomSanitizer } from '@angular/platform-browser';
import { NzCascaderOption } from 'ng-zorro-antd/cascader';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { Edit } from '../components/support/edit/edit';
import { EditComponent } from '../components/support/edit/edit.component';
import { Label } from '../components/support/form-item/label';
import { Input } from '../components/support/input/input';
import { InputComponent } from '../components/support/input/input.component';
import { Upload } from '../components/support/input/upload/upload';
import { Field } from '../components/support/list/field';
import { List } from '../components/support/list/list';
import { InputType } from '../enums/input-type.enum';
import { OrganizationPopupComponent } from '../pages/basedata/organization/organization-popup.component';
import { PersonPopupComponent } from '../pages/basedata/person/person-popup.component';
import { StaffPopupComponent } from '../pages/basedata/staff/staff-popup.component';
import { IdentityCardService } from '../services/basedata/identity-card.service';
import { OrganizationService } from '../services/basedata/organization.service';
import { PersonService } from '../services/basedata/person.service';
import { RegionService } from '../services/basedata/region.service';
import { DictionaryItemService } from '../services/system/dictionary-item.service';
import { DateUtils } from './date-utils';
import { EntityUtils } from './entity-utils';

export class FieldUtils {

    static IMAGE: string = 'image/gif,image/jpeg,image/png';

    static EXECL: string = 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    static buildCaptcha(field: Field = {}): Field {
        field = Object.assign({ code: 'captcha' }, field);
        field = this.getEdit(field, {
            label: { visible: false },
            input: { type: InputType.CAPTCHA, prefixIcon: 'lock', placeholder: '录入验证码' }
        });
        return field;
    }

    static buildJson(field: Field): Field {
        field = this.getList(field, { visible: false });
        field = this.getEdit(field, { input: { type: InputType.JSON } });
        return field;
    }

    static buildUpload(field: Field, upload: Upload): Field {
        field = this.getList(field, { visible: false });
        field = this.getEdit(field, { input: Object.assign(upload, { type: InputType.UPLOAD }) });
        return field;
    }

    static buildImageData(field: Field): Field {
        field = this.getList(field, { visible: false });
        field = this.getEdit(field, { input: { width: 100, height: 100, type: InputType.IMAGE_DATA } });
        return field;
    }

    static buildTextForBusinessKey(): Field {
        return this.buildText({
            code: 'businessKey', name: '业务键',
            list: { sortable: true },
            edit: { label: { tooltip: '外部系统中的唯一标志符' } },
            filter: {}
        });
    }

    static buildTextForCode(list: List = {}): Field {
        return this.buildText({
            code: 'code', name: '编码',
            list: Object.assign({
                sortable: true, sortPriority: 1,
                render: (_field: Field, row: any, sanitizer: DomSanitizer) => sanitizer.bypassSecurityTrustHtml(`<code>${row.code}</code>`)
            }, list),
            edit: { required: true },
            filter: {}
        });
    }

    static buildTextForName(field: Field = {}): Field {
        field = Object.assign({ code: 'name', name: field && field.name ? field.name : '名称' }, field);
        let sortable = true;
        if (field && field.list && !field.list.sortable) {
            sortable = false;
        }
        let required = true;
        if (field && field.edit && !field.edit.required) {
            required = false;
        }
        field = this.getList(field, { sortable });
        field = this.getEdit(field, { required });
        field.filter = Object.assign({}, field.filter);
        return this.buildText(field);
    }

    static buildText(field: Field): Field {
        field = this.getList(field);
        field = this.getEdit(field, { input: { type: InputType.TEXT } });
        return field;
    }

    static buildHidden(field: Field): Field {
        field = this.getList(field, { visible: false, childrenVisible: false });
        field = this.getEdit(field, { visible: false, childrenVisible: false, input: { type: InputType.HIDDEN } });
        return field;
    }

    static buildTextareaForRemark(): Field {
        return this.buildTextarea({ code: 'remark', name: '备注' });
    }

    static buildTextarea(field: Field): Field {
        field = this.getList(field, { visible: false });
        field = this.getEdit(field, { input: { type: InputType.TEXTAREA, rows: 4 } });
        return field;
    }

    static buildNumber(field: Field): Field {
        field = this.getList(field, { align: 'right' });
        field = this.getEdit(field, { input: { type: InputType.NUMBER } });
        return field;
    }

    static buildPassword(field: Field): Field {
        field = this.getList(field, { visible: false });
        field = this.getEdit(field, { input: { type: InputType.PASSWORD } });
        return field;
    }

    static buildSelect(field: Field): Field {
        field = this.getList(field, {
            render: (f: Field, row: any) => {
                if (f.code) {
                    return row[f.code] ? row[f.code].name : '-';
                } else {
                    return '-';
                }
            }
        });
        field = this.getEdit(field, { input: { lazy: false, multiple: false, options: field.edit?.input?.options ? field.edit?.input?.options : [], placeholder: '请选择', type: InputType.SELECT } });
        return field;
    }

    static buildSelectForOrganization(organization: OrganizationService, field: Field = {}) {
        if (field) {
            if (!field.edit) {
                field.edit = {};
            }
            field.edit = Object.assign({
                input: {
                    load: (component: InputComponent, event?: string) => {
                        const params: any = {};
                        if (event) {
                            params.name = event;
                        }
                        organization.findAll(params, [], {
                            before: () => component.loading = true,
                            success: (res: any) => {
                                if (component.edit.input) {
                                    component.edit.input.options = res.map((entity: any) => Object.assign({ label: entity.name, value: entity }));
                                }
                            },
                            after: () => component.loading = false
                        });
                    }
                }
            }, field.edit);
        }
        field = Object.assign({
            code: 'organization',
            name: '机构',
        }, field);
        return this.buildSelect(field);
    }

    static buildSelectForGender(dictionaryItem: DictionaryItemService, field: Field = {}): Field {
        field = Object.assign({ code: 'gender', name: '性别' }, field);
        return this.buildSelectForDictionaryItem(field, dictionaryItem);
    }


    static buildSelectForNationality(dictionaryItem: DictionaryItemService, field?: Field): Field {
        field = Object.assign({ code: 'nationality', name: '民族' }, field);
        return this.buildSelectForDictionaryItem(field, dictionaryItem);
    }

    static buildSelectForDictionaryItem(field: Field, dictionaryItem: DictionaryItemService, dictionaryTypeCode?: string): Field {
        const list: List = { align: 'center' };
        if (field && field.list && field.list.width) {
            list.width = field.list.width;
        }
        field = this.getList(field, list);
        field = this.getEdit(field, {
            input: {
                load: (component: InputComponent) => {
                    dictionaryItem.findAllByTypeCode(dictionaryTypeCode ? dictionaryTypeCode : field.code, {}, {
                        before: () => component.loading = true,
                        success: (res: any) => {
                            if (component.edit.input) {
                                component.edit.input.options = res.map((value: any) => Object.assign({ label: value.name, value }));
                            }
                        },
                        after: () => component.loading = false
                    });
                }
            }
        });
        return this.buildSelect(field);
    }

    static buildTreeSelect(field: Field): Field {
        field = this.getList(field, { render: (f: Field, row: any) => f.code && row[f.code] ? row[f.code].name : '-' });
        field = this.getEdit(field, {
            input: {
                lazy: false, multiple: false, options: [], placeholder: '请选择', type: InputType.TREE_SELECT
            }
        });
        return field;
    }

    static buildCascader(field: Field): Field {
        field = this.getList(field, { render: (f: Field, row: any) => f.code && row[f.code] ? row[f.code].name : '-' });
        field = this.getEdit(field, { input: { lazy: false, multiple: false, options: [], placeholder: '请选择', type: InputType.CASCADER } });
        return field;
    }

    static buildCascaderForRegion(region: RegionService, field: Field = {}): Field {
        if (field) {
            field = this.getList(field, {
                render: (_field: Field, row: any) => {
                    const parents = [];
                    let parent = row.region;
                    while (parent) {
                        parents.push(parent);
                        parent = parent.parent;
                    }
                    parents.reverse();
                    return parents.map(p => p.name).join('');
                }
            });
            field = this.getEdit(field, {
                input: {
                    changeOnSelect: true,
                    lazy: true,
                    load: (node: NzCascaderOption, index: number) => new Promise<void>(resolve => {
                        let parent = null;
                        if (index > -1) {
                            parent = node.value;
                        }
                        region.findAllExcludeSelfAndItsChildrenByParent(parent, null, null, {
                            success: (res: any) => {
                                node.children = EntityUtils.convertListToTree(res);
                                resolve();
                            }
                        });
                    })
                }
            });
        }
        field = Object.assign({ code: 'region', name: '行政区划' }, field);
        return this.buildCascader(field);
    }

    static buildDatetimeForExpiredAt(): Field {
        return this.buildDatetime({
            code: 'expiredAt', name: '过期时间',
            list: {
                render: (field: Field, row: any, sanitizer: DomSanitizer) => {
                    if (field.code) {
                        const expiredAt = row[field.code];
                        if (expiredAt) {
                            if (DateUtils.isAfter(expiredAt)) {
                                return sanitizer.bypassSecurityTrustHtml(`<span style="color: #0b8235">${expiredAt}</span>`);
                            } else {
                                return sanitizer.bypassSecurityTrustHtml(`<span style="color: #ff4d4f">${expiredAt}</span>`);
                            }
                        }
                    }
                    return '-';
                }
            },
            filter: { input: { placeholder: '早于录入的时间' } }
        });
    }

    static buildDatetimeForCreatedAt(): Field {
        return this.buildDatetime({
            code: 'createdAt', name: '创建时间',
            edit: { readonly: true }
        });
    }

    static buildDatetimeForUpdatedAt(): Field {
        return this.buildDatetime({
            code: 'updatedAt', name: '更新时间',
            edit: { readonly: true }
        });
    }

    static buildDatetime(field: Field): Field {
        field = this.getList(field, { width: 170, align: 'center' });
        field = this.getEdit(field, { input: { placeholder: '请选择', type: InputType.DATETIME } });
        return field;
    }

    static buildDate(field: Field): Field {
        field = this.getList(field, { width: 170, align: 'center' });
        field = this.getEdit(field, { input: { placeholder: '请选择', type: InputType.DATE } });
        return field;
    }

    static buildDateRange(field: Field): Field {
        field = this.getList(field, {
            width: 200, align: 'center',
            render: (f: Field, row: any) => {
                if (f.code) {
                    const arr = f.code.split('::');
                    if (row[arr[0]]) {
                        return row[arr[0]].replace('-', '.') + ' - ' + row[arr[1]].replace('-', '.');
                    }
                }
                return '-';
            }
        });
        field = this.getEdit(field, { input: { placeholder: '请选择', type: InputType.DATE_RANGE } });
        return field;
    }

    static buildBooleanForEnabled(field: Field = {}): Field {
        field = Object.assign({
            code: 'enabled', name: '是否启用', list: {
                render: (_field: Field, row: any, sanitizer: DomSanitizer) => {
                    if (field && field.code && row[field.code]) {
                        return sanitizer.bypassSecurityTrustHtml('<span style="color: #0b8235">启用</span>');
                    } else {
                        return sanitizer.bypassSecurityTrustHtml('<span style="color: #ff4d4f">禁用</span>');
                    }
                }
            }
        }, field);
        return this.buildBoolean(field);
    }

    static buildBooleanForLocked(field: Field = {}): Field {
        field = Object.assign({
            code: 'locked', name: '是否锁定',
            list: {
                render: (_field: Field, row: any, sanitizer: DomSanitizer) => {
                    if (field && field.code && row[field.code]) {
                        return sanitizer.bypassSecurityTrustHtml('<span style="color: #0b8235">是</span>');
                    } else {
                        return sanitizer.bypassSecurityTrustHtml('<span style="color: #ff4d4f">否</span>');
                    }
                }
            }
        }, field);
        return this.buildBoolean(field);
    }

    static buildBoolean(field: Field): Field {
        field = this.getList(field, { width: 80, align: 'center' });
        field = this.getEdit(field, { input: { type: InputType.BOOLEAN } });
        return field;
    }

    static buildComposite(field: Field): Field {
        field.children?.forEach(subField => {
            if (subField.list) {
                subField.list.visible = false;
            }
            if (subField.edit?.label) {
                subField.edit.label.visible = false;
            }
        });
        field = this.getList(field, { visible: false });
        field = this.getEdit(field, { visible: false, input: { type: InputType.COMPOSITE } });
        return field;
    }

    static buildPersonFields(
        dictionaryItem: DictionaryItemService,
        identityCard: IdentityCardService,
        region: RegionService,
        entity: PersonService,
        component: EditComponent,
    ): Field[] {
        return [
            FieldUtils.buildText({
                name: '基本信息',
                children: [
                    FieldUtils.buildUpload({ code: 'avatar', name: '头像' }, {
                        accept: 'image/*',
                        remove: (file: NzUploadFile) => new Observable(observer => entity.deleteLogoByAsset(component.form, file.response[0], {
                            success: (res: any) => {
                                if (res > -1) {
                                    component.form['version'] = res;
                                }
                                observer.next(true);
                            },
                            failure: () => observer.next(false)
                        }))
                    }),
                    FieldUtils.buildTextForName({ name: '姓名' }),
                    FieldUtils.buildText({ code: 'nickname', name: '昵称', filter: {} }),
                    FieldUtils.buildSelectForGender(dictionaryItem),
                    FieldUtils.buildNumber({
                        code: 'mobile', name: '手机号码',
                        list: {
                            width: 140, align: 'center', render: (_field: Field, row: any, sanitizer: DomSanitizer) => {
                                if (row.mobile) {
                                    return sanitizer.bypassSecurityTrustHtml(`<code>${row ? row.mobile : ''}</code>`);
                                } else {
                                    return '-';
                                }
                            }
                        },
                        edit: { input: { mode: 'numeric' }, readonly: (form: any) => !!form.id },
                        filter: {}
                    }),
                    FieldUtils.buildText({
                        code: 'identityCardNumber', name: '身份证号',
                        list: { width: 190, align: 'center' },
                        edit: { visible: false },
                        filter: {}
                    })
                ]
            }),
            FieldUtils.buildText({
                code: 'identityCard', name: '身份证', list: { visible: false, childrenVisible: false },
                children: [
                    FieldUtils.buildUpload({
                        code: 'face', name: '人像面', edit: { readonly: form => !!form.id }
                    }, {
                        locked: true, accept: 'image/*',
                        modelChange: () => identityCard.recgonize(component.form.identityCard.face.id, 'face', {
                            before: () => component.loading = true,
                            success: res => {
                                const form = JSON.parse(JSON.stringify(component.form));
                                form.identityCard.name = res.name;
                                form.identityCard.gender = res.gender;
                                form.identityCard.nationality = res.nationality;
                                form.identityCard.birthday = res.birthday;
                                form.identityCard.address = res.address;
                                form.identityCard.number = res.number;
                                component.form = form;
                            },
                            after: () => component.loading = false,
                        })
                    }),
                    FieldUtils.buildUpload({
                        code: 'emblem', name: '国徽面', edit: { readonly: form => !!form.id }
                    }, {
                        locked: true, accept: 'image/*',
                        modelChange: () => identityCard.recgonize(component.form.identityCard.emblem.id, 'back', {
                            before: () => component.loading = true,
                            success: res => {
                                const form = JSON.parse(JSON.stringify(component.form));
                                form.identityCard.issue = res.issue;
                                form.identityCard.startDate = res.startDate;
                                form.identityCard.endDate = res.endDate;
                                component.form = form;
                            },
                            after: () => component.loading = false,
                        })
                    }),
                    FieldUtils.buildTextForName({ name: '姓名', edit: { required: false, readonly: form => !!form.id }, filter: { visible: false } }),
                    FieldUtils.buildSelectForGender(dictionaryItem, { edit: { readonly: form => !!form.id } }),
                    FieldUtils.buildSelectForNationality(dictionaryItem, { edit: { readonly: form => !!form.id } }),
                    FieldUtils.buildText({ code: 'number', name: '证件号码', list: { width: 190, align: 'center' }, edit: { readonly: form => !!form.id } }),

                    FieldUtils.buildText({ code: 'issue', name: '签发机关', edit: { readonly: form => !!form.id } }),
                    FieldUtils.buildDateRange({ code: 'startDate::endDate', name: '有效期限', edit: { readonly: form => !!form.id } }),
                    FieldUtils.buildComposite({
                        code: 'address', name: '住址', edit: { column: 1, readonly: form => !!form.id }, children: [
                            FieldUtils.buildCascaderForRegion(region), FieldUtils.buildText({ code: 'detail' })
                        ]
                    })
                ]
            })
        ];
    }

    static buildPopup(field: Field): Field {
        field = this.getList(field);
        field = this.getEdit(field, { input: { type: InputType.POPUP } });
        return field;
    }

    static buildPopupForOrganization(field: Field = {}) {
        return this.buildPopup(this.getField({
            code: 'organization', name: '机构',
            edit: {
                required: true,
                input: { popupComponent: OrganizationPopupComponent, popupComponentParams: { title: field?.name ? '选择' + field.name : null } }
            },
            list: { render: (f: Field, row: any) => f.code && row[f.code] ? row[f.code].shortName : '-' },
            filter: {}
        }, field));
    }

    static buildPopupForStaff(field: Field = {}): Field {
        return this.buildPopup(this.getField({
            code: 'staff', name: '员工',
            edit: {
                required: true, input: {
                    popupComponent: StaffPopupComponent,
                    popupComponentParams: { title: field?.name ? '选择' + field.name : null },
                    popupComponentSelectRowCode: 'person.name'
                }
            },
            list: { align: 'center', width: 100, render: (f: Field, row: any) => f.code && row[f.code] ? row[f.code].person.name : '-' },
            filter: {}
        }, field));
    }

    static buildPopupForPerson(field: Field = {}): Field {
        return this.buildPopup(this.getField({
            code: 'person', name: '人员',
            edit: { required: true, input: { popupComponent: PersonPopupComponent, popupComponentParams: { title: field?.name ? '选择' + field.name : null }, popupComponentSelectRowCode: 'name' } },
            list: { align: 'center', width: 100, render: (f: Field, row: any) => f.code && row[f.code] ? row[f.code].name : '-' },
            filter: {}
        }, field));
    }

    static getField(sourceField: Field, targetField: Field): Field {
        if (!targetField) {
            targetField = {};
        }

        if (!targetField.edit) {
            targetField.edit = {};
        }
        if (sourceField?.edit?.label) {
            targetField.edit.label = Object.assign(sourceField.edit.label, targetField.edit.label);
        }
        if (sourceField?.edit?.input) {
            targetField.edit.input = Object.assign(sourceField.edit.input, targetField.edit.input);
        }
        if (sourceField?.edit) {
            targetField.edit = Object.assign(sourceField.edit, targetField.edit);
        }

        if (sourceField?.list) {
            targetField.list = Object.assign(sourceField.list, targetField.list);
        }
        return Object.assign(sourceField, targetField);
    }

    static getList(field: Field, list: List = {}): Field {
        list = Object.assign({
            filterable: false,
            sortable: false,
            sortPriority: 99,
            visible: true,
            childrenVisible: true,
            align: 'left'
        }, list);
        if (!field) {
            field = {};
        }
        field.list = Object.assign(list, field.list);
        if (!field.list.code) {
            field.list.code = field.code;
        }
        return field;
    }

    static getEdit(field: Field, edit: Edit = {}): Field {
        const label = field.edit?.label;
        const input = field.edit?.input;
        field.edit = Object.assign({ visible: true, colSpan: 1 }, field.edit);
        field.edit = Object.assign(field.edit, edit);
        field = this.getLabel(field, label);
        field = this.getInput(field, input);
        if (field.edit && !field.edit.code) {
            field.edit.code = field.code;
        }
        if (field.filter) {
            const filterLabel = field.filter.label;
            const filterInput = field.filter.input;
            const visible = field.filter.visible;
            field.filter = Object.assign(field.edit, field.filter);
            field.filter.label = Object.assign(field.edit?.label, filterLabel);
            field.filter.input = Object.assign(field.edit?.input, filterInput);
            if (visible !== undefined) {
                field.filter.visible = visible;
            }
        }
        return field;
    }

    static getLabel(field: Field, label: Label = {}): Field {
        field.edit = Object.assign({}, field.edit);
        field.edit.label = Object.assign({ span: 4 }, field.edit.label);
        field.edit.label = Object.assign(label, field.edit.label);
        return field;
    }

    static getInput(field: Field, input: Input = {}): Field {
        field.edit = Object.assign({}, field.edit);
        field.edit.input = Object.assign({ span: 20 }, field.edit.input);
        field.edit.input = Object.assign(input, field.edit.input);
        return field;
    }

}