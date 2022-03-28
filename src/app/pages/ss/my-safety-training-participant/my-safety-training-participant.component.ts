import { Component } from '@angular/core';
import { Button } from 'src/app/components/support/button/button';
import { Field } from 'src/app/components/support/list/field';
import { FieldUtils } from 'src/app/utils/field-utils';
import { SafetyTrainingParticipantComponent } from '../safety-training-participant/safety-training-participant.component';
import { SafetyTrainingComponent } from '../safety-training/safety-training.component';

@Component({
    selector: 'app-my-safety-training-participant',
    templateUrl: './my-safety-training-participant.component.html',
    styleUrls: ['./my-safety-training-participant.component.scss']
})
export class MySafetyTrainingParticipantComponent extends SafetyTrainingParticipantComponent {

    override ngOnInit(): void {
        super.ngOnInit();
        this.getEditComponent().width = '40%';
    }

    override initFields(): Field[] {
        return [
            FieldUtils.buildText({
                code: 'training', name: '安全培训', children: SafetyTrainingComponent.prototype.initFields()
            }),
            FieldUtils.buildText({ code: '', name: '参与人', children: super.initFields() })
        ];
    }

    override initListToolbar(): Button[] {
        const buttons = super.initListToolbar();
        buttons.forEach(button => delete button.authority);
        return buttons;
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        buttons.forEach(button => delete button.authority);
        buttons.splice(1, 2);
        return buttons;
    }

    override initEditToolbar(): Button[] {
        return [
            { name: '确认', type: 'primary', size: 'default', action: () => this.confirmOfMine(), isDisabled: (form: any) => form.confirmedAt }
        ];
    }

    confirmOfMine(): void {
        const form = this.buildEditForm();
        this.entity.confirmMine(form, {
            errors: this.errors,
            success: () => {
                this.message.info('确认成功');
                this.getEditComponent().hide();
                this.list();
            }
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
                    this.afterEdit();
                }
            });
        }
    }

    override list(): void {
        this.entity.findPageOfMine(this.filterForm, this.pageData, {
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
    }

}
