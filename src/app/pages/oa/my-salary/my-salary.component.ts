import { Component } from '@angular/core';
import { Button } from 'src/app/components/support/button/button';
import { Field } from 'src/app/components/support/list/field';
import { FieldUtils } from 'src/app/utils/field-utils';
import { PayrollDetailComponent } from '../payroll-detail/payroll-detail.component';

@Component({
    selector: 'app-my-salary',
    templateUrl: './my-salary.component.html',
    styleUrls: ['./my-salary.component.scss']
})
export class MySalaryComponent extends PayrollDetailComponent {

    override initFields(): Field[] {
        let fields: Field[] = [FieldUtils.buildText({
            code: 'payroll', name: '期数',
            list: { width: 150, align: 'center' },
            filter: {}
        })];
        const detailFields = super.initFields();
        if (detailFields[1].children) {
            fields = fields.concat(detailFields[1].children);
            fields.splice(1, 1);
        }
        return fields;
    }


    override initListToolbar(): Button[] {
        const buttons = super.initListToolbar();
        buttons.forEach(button => delete button.authority);
        return buttons;
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        buttons.forEach(button => delete button.authority);
        return buttons;
    }

    override initEditToolbar(): Button[] {
        return [
            { name: '确认', type: 'primary', size: 'default', action: () => this.confirmOfMine()/* , isDisabled: (form: any) => form.confirmedAt */ }
        ];
    }

    confirmOfMine(): void {
        const form = this.buildEditForm();
        this.modal.confirm({
            nzTitle: '确定工资已收到吗?',
            nzOnOk: () =>
                this.entity.confirmMine(form, {
                    errors: this.errors,
                    success: () => {
                        this.message.info('确认成功');
                        this.getEditComponent().hide();
                        this.list();
                    }
                })
        });
    }

    override edit(row?: any): void {
        this.beforeEdit();
        this.getEditComponent().show();
        const id = row ? row.id : null;
        if (this.entity) {
            this.entity.findOneOfMine(id, {
                before: () => this.getEditComponent().loading = true,
                success: res => this.editForm = res,
                after: () => {
                    this.getEditComponent().loading = false;
                    this.afterEdit(row);
                }
            });
        }
    }

    override afterEdit(row?: any): void {
        super.afterEdit(row);
        this.editForm.payroll = this.editForm.payroll.code;
    }

    override list(): void {
        const form = Object.assign({}, this.filterForm);
        if (form['payroll']) {
            form['payroll.code'] = form['payroll'];
            delete form['payroll'];
        }
        this.entity.findPageOfMine(form, this.pageData, {
            before: () => this.getListComponent().loading = true,
            success: (res: any) => {
                this.listData = res.content;
                this.listData.forEach(data => data.payroll = data.payroll.code);
                this.pageData.total = res.totalElements;
            },
            after: () => {
                this.getListComponent().loading = false;
                this.uncheckAll();
            }
        });
    }

}
